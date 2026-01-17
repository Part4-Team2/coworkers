"use server";

import { fetchApi } from "@/utils/api";
import { BASE_URL } from ".";
import { ApiResult } from "@/lib/types/api";

// 응답 타입 정의
export type CommentResponse = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: number;
  userId: number;
  user: {
    id: number;
    nickname: string;
    image: string | null;
  };
};

/**
 * 댓글 목록 조회
 */
export async function getComments(
  taskId: string
): Promise<ApiResult<CommentResponse[]>> {
  try {
    const response = await fetchApi(`${BASE_URL}/tasks/${taskId}/comments`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "댓글을 가져오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "댓글을 가져오는데 실패했습니다.",
      };
    }

    const data = (await response.json()) as CommentResponse[];
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 댓글 생성
 */
export async function createComment(
  taskId: string,
  content: string
): Promise<ApiResult<CommentResponse>> {
  try {
    const response = await fetchApi(`${BASE_URL}/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "댓글 생성에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "댓글 생성에 실패했습니다.",
      };
    }

    const data = (await response.json()) as CommentResponse;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 댓글 수정
 */
export async function updateComment(
  taskId: string,
  commentId: string,
  content: string
): Promise<ApiResult<CommentResponse>> {
  try {
    const response = await fetchApi(
      `${BASE_URL}/tasks/${taskId}/comments/${commentId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "댓글 수정에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "댓글 수정에 실패했습니다.",
      };
    }

    const data = (await response.json()) as CommentResponse;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 댓글 삭제
 */
export async function deleteComment(
  taskId: string,
  commentId: string
): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(
      `${BASE_URL}/tasks/${taskId}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "댓글 삭제에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "댓글 삭제에 실패했습니다.",
      };
    }

    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}
