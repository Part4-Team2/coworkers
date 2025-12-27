// CircleConfig 타입 정의
export interface CircleConfig {
  size: number;
  viewBox: string;
  centerX: number;
  centerY: number;
  radius: number;
  strokeWidth: number;
}

// 데스크탑 프로그래스 서클 설정
export const DESKTOP_CONFIG: CircleConfig = {
  size: 170,
  viewBox: "0 0 170 170",
  centerX: 84.7891,
  centerY: 84.7896,
  radius: 70,
  strokeWidth: 29.5793,
};

// 모바일 프로그래스 서클 설정
export const MOBILE_CONFIG: CircleConfig = {
  size: 137,
  viewBox: "0 0 137 137",
  centerX: 68.3107,
  centerY: 68.3107,
  radius: 56.3107,
  strokeWidth: 24,
};

// Circumference 계산
export const calculateCircumference = (radius: number) => 2 * Math.PI * radius;

// 미리 계산된 값
export const DESKTOP_CIRCUMFERENCE = calculateCircumference(
  DESKTOP_CONFIG.radius
);
export const MOBILE_CIRCUMFERENCE = calculateCircumference(
  MOBILE_CONFIG.radius
);

// offset 계산
export const calculateOffset = (circumference: number, percentage: number) =>
  circumference - (percentage / 100) * circumference;
