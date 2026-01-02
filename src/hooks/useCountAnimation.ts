"use client";

import { useEffect, useState, useRef } from "react";

interface UseCountAnimationOptions {
  duration?: number;
}

/**
 * 숫자 카운팅 애니메이션 훅
 * @param target 목표 숫자
 * @param options 애니메이션 옵션 (duration: 지속시간(ms))
 * @returns 현재 애니메이션된 숫자 값
 */

export function useCountAnimation(
  target: number,
  options: UseCountAnimationOptions = {}
): number {
  const { duration = 1000 } = options;
  const [value, setValue] = useState(0);
  const isFirstRender = useRef(true);
  const prevValueRef = useRef(0);

  useEffect(() => {
    let isCancelled = false;
    let animationFrameId: number;

    // 초기 렌더링 시에는 0부터 시작, 이후에는 이전 값에서 시작
    const startValue = isFirstRender.current ? 0 : prevValueRef.current;
    isFirstRender.current = false;

    const diff = target - startValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      if (isCancelled) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0 ~ 1

      if (progress >= 1) {
        // 애니메이션 완료
        if (!isCancelled) {
          setValue(target);
          prevValueRef.current = target;
        }
      } else {
        // 애니메이션 진행 중
        const currentValue = startValue + diff * progress;
        if (!isCancelled) {
          const newValue = Math.floor(currentValue);
          setValue(newValue);
          prevValueRef.current = newValue;
        }
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, duration]);

  return value;
}
