import "server-only";
import { trace, SpanStatusCode } from "@opentelemetry/api";

const isDev = process.env.NODE_ENV !== "production";
const tracer = trace.getTracer("coworkers-app");

type MeasureArgs<T> = {
  name: string;
  fn: () => Promise<T>;
  attr?: Record<string, string | number>;
};

export const measureSSR = async <T>({
  name,
  fn,
  attr,
}: MeasureArgs<T>): Promise<T> => {
  return tracer.startActiveSpan(name, async (span) => {
    if (attr) {
      span.setAttributes(attr);
    }
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      if (isDev) {
        console.log(`[Measure] ${name}: ${duration.toFixed(2)}ms`);
      }
      span.setAttribute("duration.ms", duration.toFixed(2));
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      span.setStatus({ code: SpanStatusCode.ERROR, message: errorMessage });
      span.recordException(err as Error);
      throw err;
    } finally {
      span.end();
    }
  });
};
