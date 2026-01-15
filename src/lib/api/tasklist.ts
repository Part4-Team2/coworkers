"use server";

import { BASE_URL } from "@/lib/api";
import { fetchApi } from "@/utils/api";
import { ApiResult } from "./group";
import { TaskListResponse } from "../types/tasklist";

export async function getTaskList(groupId: string, id: string) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${id}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "할 일 목록을 가져오는데 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "할 일 목록을 가져오는데 실패했습니다.",
      };
    }

    return await response.json();
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

export async function patchTaskList(
  groupId: string,
  id: string,
  data: { name: string }
) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "할 일 목록 수정에 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "할 일 목록 수정에 실패했습니다.",
      };
    }

    return (await response.json()) as { message: string };
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

export async function deleteTaskList(groupId: string, id: string) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "할 일 목록 삭제에 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "할 일 목록 삭제에 실패했습니다.",
      };
    }
    return { success: true };
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

export async function postTaskList(
  groupId: string,
  data: { name: string }
): Promise<ApiResult<TaskListResponse>> {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "할 일 목록 생성에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "할 일 목록 생성에 실패했습니다.",
      };
    }

    return await response.json();
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/* PATCH /groups/${groupId}/task-lists/${id}/order
할일 목록 순서 변경 API
기능 추가할 때 API 추가
*/
