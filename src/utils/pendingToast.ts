/**
 * 페이지 이동 후 토스트 메시지를 표시하기 위한 유틸리티
 * sessionStorage를 사용하여 페이지 이동 간 메시지 전달
 */

import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "@/utils/error";

const TOAST_MESSAGE_KEY = "pendingToastMessage";

export interface PendingToastMessage {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

/**
 * 페이지 이동 전에 토스트 메시지를 저장
 */
export function setPendingToast(
  type: PendingToastMessage["type"],
  message: string
) {
  if (typeof window === "undefined") return;

  const toastData: PendingToastMessage = { type, message };
  sessionStorage.setItem(TOAST_MESSAGE_KEY, JSON.stringify(toastData));
}

/**
 * 페이지 마운트 시 저장된 토스트 메시지를 가져오고 삭제
 */
export function getPendingToast(): PendingToastMessage | null {
  if (typeof window === "undefined") return null;

  const data = sessionStorage.getItem(TOAST_MESSAGE_KEY);
  if (!data) return null;

  // 메시지 읽은 후 즉시 삭제
  sessionStorage.removeItem(TOAST_MESSAGE_KEY);

  try {
    return JSON.parse(data) as PendingToastMessage;
  } catch (error) {
    console.warn("[pendingToast] Failed to parse toast data:", error);
    return null;
  }
}

/**
 * 저장된 토스트 메시지 삭제
 */
export function clearPendingToast() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOAST_MESSAGE_KEY);
}

/**
 * 저장된 토스트 메시지를 가져와서 표시
 * useEffect에서 호출하여 페이지 마운트 시 pending 토스트 자동 표시
 */
export function displayPendingToast() {
  const pendingToast = getPendingToast();
  if (!pendingToast) return;

  const toastFunctions = {
    success: showSuccessToast,
    error: showErrorToast,
    info: showInfoToast,
    warning: showWarningToast,
  };

  toastFunctions[pendingToast.type](pendingToast.message);
}
