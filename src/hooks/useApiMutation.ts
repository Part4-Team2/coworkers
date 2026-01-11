"use client";

import { useState, useCallback } from "react";

interface UseApiMutationOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * API 뮤테이션을 위한 범용 커스텀 훅
 * - 로딩 상태 관리
 * - 중복 호출 방지
 * - 에러 처리
 */
export function useApiMutation<T>(options?: UseApiMutationOptions) {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (fn: () => Promise<T>): Promise<T | null> => {
      // 중복 호출 방지
      if (isLoading) {
        return null;
      }

      setIsLoading(true);
      try {
        const result = await fn();
        options?.onSuccess?.();
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "오류가 발생했습니다.";
        options?.onError?.(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, options]
  );

  return { mutate, isLoading };
}
