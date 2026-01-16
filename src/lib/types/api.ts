/**
 * 공통 API 응답 타입
 * 모든 API 함수는 이 형식을 따라야 합니다.
 */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/**
 * API 에러 응답
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Pagination 메타데이터
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

/**
 * 페이지네이션이 있는 API 응답
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * API 응답을 ApiResult로 변환하는 헬퍼 함수
 */
export async function toApiResult<T>(
  fetchFn: () => Promise<Response>,
  errorMessage: string
): Promise<ApiResult<T>> {
  try {
    const response = await fetchFn();

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: errorMessage,
      }));
      return {
        success: false,
        error: error.message || errorMessage,
        code: error.code,
      };
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
    };
  }
}
