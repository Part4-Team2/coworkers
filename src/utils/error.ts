import { toast } from "react-toastify";

/**
 * 표준 에러 타입
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * AppError 타입 가드
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * API 응답을 파싱하고 에러를 던지는 헬퍼 함수
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "알 수 없는 오류가 발생했습니다.",
    }));

    throw new AppError(
      errorData.message || "요청에 실패했습니다.",
      errorData.code,
      response.status
    );
  }

  return response.json();
}

/**
 * 에러 메시지를 사용자 친화적으로 변환
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "알 수 없는 오류가 발생했습니다.";
}

/**
 * Toast 공통 설정
 */
export const TOAST_DEFAULT_CONFIG = {
  position: "bottom-center" as const,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * 공통 토스트 표시 함수
 */
function showToast(
  type: "error" | "success" | "info" | "warning",
  message: string,
  autoClose: number
) {
  toast[type](message, {
    ...TOAST_DEFAULT_CONFIG,
    autoClose,
  });
}

/**
 * 에러 토스트 표시
 */
export function showErrorToast(error: unknown, fallbackMessage?: string) {
  const message = fallbackMessage || getUserFriendlyErrorMessage(error);
  showToast("error", message, 3000);
}

/**
 * 성공 토스트 표시
 */
export function showSuccessToast(message: string) {
  showToast("success", message, 2000);
}

/**
 * 정보 토스트 표시
 */
export function showInfoToast(message: string) {
  showToast("info", message, 2000);
}

/**
 * 경고 토스트 표시
 */
export function showWarningToast(message: string) {
  showToast("warning", message, 3000);
}

/**
 * HTTP 상태 코드별 에러 메시지 매핑
 */
export function getErrorMessageByStatus(status: number): string {
  switch (status) {
    case 400:
      return "잘못된 요청입니다.";
    case 401:
      return "로그인이 필요합니다.";
    case 403:
      return "권한이 없습니다.";
    case 404:
      return "요청한 정보를 찾을 수 없습니다.";
    case 409:
      return "이미 존재하는 데이터입니다.";
    case 500:
      return "서버 오류가 발생했습니다.";
    case 503:
      return "서비스를 일시적으로 사용할 수 없습니다.";
    default:
      return "알 수 없는 오류가 발생했습니다.";
  }
}
