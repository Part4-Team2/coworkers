"use server";

import { BASE_URL } from "@/lib/api";
import { fetchApi } from "@/utils/api";

interface CreateTaskRequestBody {
  name: string;
  description?: string;
  startDate?: string;
  frequencyType?: string;
  monthDay?: number;
  weekDays?: number;
}

interface UpdateTaskRequestBody {
  name?: string;
  description?: string;
  done?: boolean;
}

export async function postTasks(
  groupId: number,
  taskListId: number,
  data: CreateTaskRequestBody
) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks`,
      { method: "POST", body: JSON.stringify(data) }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "(반복)일정 생성에 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "(반복)일정 생성에 실패했습니다.",
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

export async function getTasks(
  groupId: number,
  taskListId: number,
  date?: string
) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks${date ? `?date=${date}` : ""}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "특정 일자의 할 일을 가져오는데 실패했습니다.",
      }));

      return {
        error: true,
        message:
          error.message || "특정 일자의 할 일을 가져오는데 실패했습니다.",
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

export async function getSpecificTask(
  groupId: number,
  taskListId: number,
  taskId: number
) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "할 일 상세 정보를 가져오는데 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "할 일 상세 정보를 가져오는데 실패했습니다.",
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

export async function patchTask(
  groupId: number,
  taskListId: number,
  taskId: number,
  data: UpdateTaskRequestBody
) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
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
        message: "할 일 수정에 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "할 일 수정에 실패했습니다.",
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

export async function deleteTask(
  groupId: number,
  taskListId: number,
  taskId: number
) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "특정 할 일 삭제에 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "특정 할 일 삭제에 실패했습니다.",
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

/* PATCH /groups/${groupId}/task-lists/${taskListId}/tasks/{id}/order
할일 순서 변경 API
기능 추가할 때 API 추가
*/

export async function deleteTasks(
  groupId: number,
  taskListId: number,
  taskId: number,
  recurringId: number
) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}/recurring/${recurringId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "반복 할 일 삭제에 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "반복 할 일 삭제에 실패했습니다.",
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
