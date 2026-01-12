"use server";
// 타입과 api 파일 위치는 수정
// 해당 파일 사용 안된다면(다른 api로 사용이 다 가능하다면) 삭제

import { BASE_URL } from "@/constants/api";
import { fetchApi } from "@/utils/api";

// 타입은 추후 별도로 분리
interface CreateTaskListRequestBody {
  name: string;
}
interface UpdateTaskListRequestBody {
  name: string;
}

export async function getTaskList(groupId: number, id: string) {
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
  groupId: number,
  id: string,
  data: UpdateTaskListRequestBody
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
  groupId: number,
  data: CreateTaskListRequestBody
) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/task-lists`,
      {
        method: "POST",
        body: JSON.stringify({ data }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "할 일 목록 생성에 실패했습니다.",
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

/* PATCH /groups/${groupId}/task-lists/${id}/order
할일 목록 순서 변경 API
기능 추가할 때 API 추가
*/
