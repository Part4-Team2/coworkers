import "server-only";
import { cache } from "react";
import { trace, SpanStatusCode } from "@opentelemetry/api";

const isDev = process.env.NODE_ENV !== "production";
const tracer = trace.getTracer("coworkers-app");

// 환경별 캐시 히트 임계값 (프로덕션은 네트워크 지연 고려)
const CACHE_HIT_THRESHOLD = isDev ? 5 : 10;

type MeasureArgs<T> = {
  name: string;
  fn: () => Promise<T>;
  attr?: Record<string, string | number>;
  useCache?: boolean; // 캐시 사용 여부 (기본: true)
  showCacheStatus?: boolean; // 캐시 상태 표시 여부 (기본: true)
};

type MeasureResult<T> = {
  result: T;
  duration: number;
  isCacheHit: boolean;
};

export const measureSSR = <T>({
  name,
  fn,
  attr,
  useCache = true,
  showCacheStatus = true,
}: MeasureArgs<T>): (() => Promise<MeasureResult<T>>) => {
  const measure = async (): Promise<MeasureResult<T>> => {
    return tracer.startActiveSpan(name, async (span) => {
      if (attr) {
        span.setAttributes(attr);
      }
      const startTime = performance.now();
      try {
        const result = await fn();
        const duration = performance.now() - startTime;

        // 환경별 임계값으로 캐시 상태 추정
        const isCacheHit = duration < CACHE_HIT_THRESHOLD;

        // OpenTelemetry 속성 설정 (프로덕션 모니터링용)
        span.setAttribute("duration.ms", duration.toFixed(2));
        span.setAttribute("cache.hit", isCacheHit);
        span.setAttribute("cache.threshold.ms", CACHE_HIT_THRESHOLD);
        span.setAttribute("function.name", name);

        // 캐시 상태를 이벤트로 기록 (APM에서 확인 가능)
        span.addEvent(isCacheHit ? "cache.hit" : "cache.miss", {
          "duration.ms": duration.toFixed(2),
          timestamp: new Date().toISOString(),
        });

        // 개발 환경에서만 콘솔 출력
        if (isDev) {
          if (showCacheStatus) {
            // 캐시 상태와 함께 출력
            console.log(
              `[Measure] ${name}: ${duration.toFixed(2)}ms ${
                isCacheHit ? "✅ Next Cache" : "❌ (API 호출)"
              }`
            );
          } else {
            // 기본 출력
            console.log(`[Measure] ${name}: ${duration.toFixed(2)}ms`);
          }
        }

        // 프로덕션에서도 캐시 상태 로깅 (간단하게)
        if (!isDev) {
          console.log(
            `[${name}] ${isCacheHit ? "CACHE_HIT" : "CACHE_MISS"} ${duration.toFixed(1)}ms`
          );
        }

        span.setStatus({ code: SpanStatusCode.OK });
        return { result, duration, isCacheHit };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "UNKNOWN_ERROR";
        span.setStatus({ code: SpanStatusCode.ERROR, message: errorMessage });
        span.recordException(err as Error);
        throw err;
      } finally {
        span.end();
      }
    });
  };

  // useCache가 true면 React cache로 감싸서 반환
  return useCache ? cache(measure) : measure;
};
