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

export const measureSSR = <T>({
  name,
  fn,
  attr,
  useCache = true,
  showCacheStatus = true,
}: MeasureArgs<T>): (() => Promise<T>) => {
  const measure = async (): Promise<T> => {
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

        if (isDev) {
          if (showCacheStatus) {
            // 캐시 상태와 함께 출력
            console.log(
              `[Measure] ${name}: ${duration.toFixed(2)}ms ${
                isCacheHit ? "✅ (캐시 가능성)" : "❌ (API 호출)"
              }`
            );
          } else {
            // 기본 출력
            console.log(`[Measure] ${name}: ${duration.toFixed(2)}ms`);
          }
        }

        span.setAttribute("duration.ms", duration.toFixed(2));
        span.setAttribute("cache.estimated", isCacheHit);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
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
