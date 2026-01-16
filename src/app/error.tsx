"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary px-16">
      <div className="max-w-500 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-16">
          문제가 발생했습니다
        </h2>
        <p className="text-md text-text-secondary mb-24">
          {error.message || "페이지를 불러오는 중 오류가 발생했습니다."}
        </p>
        {error.digest && (
          <p className="text-sm text-text-disabled mb-24">
            오류 코드: {error.digest}
          </p>
        )}
        <div className="flex gap-12 justify-center">
          <button
            onClick={() => reset()}
            className="px-24 py-12 bg-brand-primary text-text-inverse rounded-xl hover:bg-interaction-hover transition-colors"
          >
            다시 시도
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-24 py-12 bg-background-secondary text-text-primary rounded-xl hover:bg-background-tertiary transition-colors border border-border-primary"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
