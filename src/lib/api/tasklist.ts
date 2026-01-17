"use server";

import { BASE_URL } from "@/lib/api";
import { fetchApi } from "@/utils/api";
import { ApiResult } from "./group";
import { TaskListResponse } from "../types/tasklist";
import { GetTaskListResponse, GetTasksParams } from "../types/task";

// 함수 안에서만 쓰는 임시 타입
type TaskMaybeStart = GetTaskListResponse["tasks"][number] & {
  startDate?: string;
};

export async function getTaskList(
  groupId: string,
  id: string,
  params?: GetTasksParams
): Promise<ApiResult<GetTaskListResponse>> {
  try {
    const queryString = params?.date ? `?date=${params.date}` : "";

    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${id}${queryString}`
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "할 일 목록을 가져오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "할 일 목록을 가져오는데 실패했습니다.",
      };
    }

    const data = (await response.json()) as GetTaskListResponse;

    // recurring 응답 대비하여 date 보정
    const mapped: GetTaskListResponse = {
      ...data,
      tasks: (data.tasks as TaskMaybeStart[])
        .map((t) => {
          const date = t.date ?? t.startDate;
          return date ? { ...t, date } : null;
        })
        .filter((t): t is GetTaskListResponse["tasks"][number] => t !== null),
    };

    return { success: true, data: mapped };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// lib/api/group 에서 로직 가져옴 (revalidatePath 삭제)
/**
 * 할 일 목록 생성
 */
export async function createTaskList(
  groupId: string,
  name: string
): Promise<ApiResult<TaskListResponse>> {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists`,
      {
        method: "POST",
        body: JSON.stringify({ name }),
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

    const data = (await response.json()) as TaskListResponse;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 할 일 목록 수정
 */
export async function updateTaskList(
  groupId: string,
  taskListId: number,
  name: string
): Promise<ApiResult<TaskListResponse>> {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "할 일 목록 수정에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "할 일 목록 수정에 실패했습니다.",
      };
    }

    const data = (await response.json()) as TaskListResponse;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 할 일 목록 삭제
 */
export async function deleteTaskList(
  groupId: string,
  taskListId: number
): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "할 일 목록 삭제에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "할 일 목록 삭제에 실패했습니다.",
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

/* PATCH /groups/${groupId}/task-lists/${id}/order
할일 목록 순서 변경 API
기능 추가할 때 API 추가
*/
