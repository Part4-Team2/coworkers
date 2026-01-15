"use client";

import { memo, useMemo } from "react";
import { useCountAnimation } from "@/hooks/Team/useCountAnimation";
import {
  DESKTOP_CONFIG,
  MOBILE_CONFIG,
  DESKTOP_CIRCUMFERENCE,
  MOBILE_CIRCUMFERENCE,
  calculateOffset,
  type CircleConfig,
} from "@/constants/report";

interface ProgressCircleProps {
  percentage: number;
}

const validatePercentage = (percentage: number): number => {
  if (percentage < 0) return 0;
  if (percentage > 100) return 100;
  return percentage;
};

interface CircleSVGProps {
  config: CircleConfig;
  circumference: number;
  offset: number;
  animatedPercentage: number;
  gradientId: string;
}

const CircleSVG = memo(function CircleSVG({
  config,
  circumference,
  offset,
  animatedPercentage,
  gradientId,
}: CircleSVGProps) {
  return (
    <svg
      width={config.size}
      height={config.size}
      viewBox={config.viewBox}
      className="transform rotate-0 shrink-0"
      aria-label={`진행률 ${animatedPercentage}%`}
    >
      {/* 배경 원 */}
      <circle
        cx={config.centerX}
        cy={config.centerY}
        r={config.radius}
        stroke="#334155"
        strokeWidth={config.strokeWidth}
        fill="none"
      />
      {/* 진행률 원 */}
      <circle
        cx={config.centerX}
        cy={config.centerY}
        r={config.radius}
        stroke={`url(#${gradientId})`}
        strokeWidth={config.strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
      {/* 그라데이션 정의 */}
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="0" stopColor="#10B981" />
          <stop offset="1" stopColor="#A3E635" />
        </linearGradient>
      </defs>
    </svg>
  );
});

export default function ProgressCircle({ percentage }: ProgressCircleProps) {
  const validatedPercentage = validatePercentage(percentage);

  const animatedPercentage = useCountAnimation(validatedPercentage, {
    duration: 1000,
  });

  // offset 계산
  const desktopOffset = useMemo(
    () => calculateOffset(DESKTOP_CIRCUMFERENCE, animatedPercentage),
    [animatedPercentage]
  );
  const mobileOffset = useMemo(
    () => calculateOffset(MOBILE_CIRCUMFERENCE, animatedPercentage),
    [animatedPercentage]
  );

  return (
    <>
      {/* 모바일 버전 */}
      <div className="sm:hidden relative inline-block">
        <CircleSVG
          config={MOBILE_CONFIG}
          circumference={MOBILE_CIRCUMFERENCE}
          offset={mobileOffset}
          animatedPercentage={animatedPercentage}
          gradientId="progressGradientMobile"
        />
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs font-medium leading-16 text-text-primary text-center mb-2">
            오늘
          </p>
          <p className="text-center text-[20px] font-bold bg-linear-to-r from-brand-primary to-brand-tertiary bg-clip-text text-transparent">
            {animatedPercentage}%
          </p>
        </div>
      </div>

      {/* 데스크탑 버전 */}
      <div className="hidden sm:flex items-center gap-41 lg:gap-49">
        <CircleSVG
          config={DESKTOP_CONFIG}
          circumference={DESKTOP_CIRCUMFERENCE}
          offset={desktopOffset}
          animatedPercentage={animatedPercentage}
          gradientId="progressGradientDesktop"
        />
        {/* 오른쪽 텍스트 */}
        <div className="flex flex-col">
          <p className="text-md font-medium leading-md text-text-primary">
            오늘의
            <br />
            진행 상황
          </p>
          <p className="text-center text-[40px] font-bold bg-linear-to-r from-brand-primary to-brand-tertiary bg-clip-text text-transparent">
            {animatedPercentage}%
          </p>
        </div>
      </div>
    </>
  );
}
