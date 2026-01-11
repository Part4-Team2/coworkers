"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/constants/api";
import { CreateGroupBody } from "@/types/api/group";
import { Role } from "@/types/schemas";

// 공통 API 응답 타입
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// 개별 응답 타입 정의
export type TaskListResponse = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  groupId: number;
  displayIndex: number;
};

export type GroupDetailResponse = {
  id: number;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  teamId: string;
  members: Array<{
    userId: number;
    groupId: number;
    userName: string;
    userEmail: string;
    userImage: string | null;
    role: Role;
  }>;
  taskLists: Array<{
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    groupId: number;
    displayIndex: number;
    tasks: Array<{
      id: number;
      name: string;
      description: string;
      date: string;
      doneAt: string | null;
      updatedAt: string;
      user: {
        id: number;
        nickname: string;
        image: string | null;
      } | null;
      recurringId: number;
      deletedAt: string | null;
      displayIndex: number;
      writer: {
        id: number;
        nickname: string;
        image: string | null;
      };
      doneBy: {
        id: number;
        nickname: string;
        image: string | null;
      } | null;
      commentCount: number;
      frequency: string;
    }>;
  }>;
};

/**
 * 그룹 상세 정보 조회 (멤버, 할 일 목록 포함)
 */
export async function getGroup(
  groupId: string
): Promise<ApiResult<GroupDetailResponse>> {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
      next: { tags: [`group-${groupId}`] },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "그룹 정보를 가져오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "그룹 정보를 가져오는데 실패했습니다.",
      };
    }

    const data = (await response.json()) as GroupDetailResponse;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

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
    revalidatePath(`/${groupId}`);
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
    revalidatePath(`/${groupId}`);
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

    revalidatePath(`/${groupId}`);
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 그룹(팀) 삭제
 */
export async function deleteGroup(groupId: string): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "팀 삭제에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "팀 삭제에 실패했습니다.",
      };
    }

    revalidatePath(`/${groupId}`);
    revalidatePath("/teamlist");
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 그룹 멤버 삭제
 */
export async function deleteMember(
  groupId: string,
  memberUserId: number
): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/member/${memberUserId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "멤버 삭제에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "멤버 삭제에 실패했습니다.",
      };
    }

    revalidatePath(`/${groupId}`);
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

export async function postGroup(data: CreateGroupBody) {
  try {
    const response = await fetchApi(`${BASE_URL}/groups`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "팀 생성에 실패했습니다.",
      };
    }

    return (await response.json()) as {
      name: string;
      image: string | null;
      updatedAt: string;
      createdAt: string;
      id: number;
    };
  } catch {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 그룹 초대 토큰 생성
 */
export async function getGroupInvitation(groupId: string) {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}/invitation`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "초대 링크 생성에 실패했습니다.",
      }));
      return {
        error: true as const,
        message: error.message || "초대 링크 생성에 실패했습니다.",
      };
    }

    // API가 토큰 문자열을 직접 반환
    const token = await response.text();
    return { token };
  } catch {
    return {
      error: true as const,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 초대 토큰으로 그룹 참여 수락
 * GET {id}/invitation으로 생성한 토큰으로, 초대를 수락하는 엔드포인트
 * token은 초대 링크에 포함되어있는 토큰, userEmail은 초대를 수락하는 유저의 이메일
 * 링크 토큰 유효 시간: 3일 / 참고: jwt.io
 */
export async function postGroupAcceptInvitation(data: {
  userEmail: string;
  token: string;
}) {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/accept-invitation`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        status: response.status,
        message: error.message || "초대 수락에 실패했습니다.",
      };
    }

    return (await response.json()) as { groupId: number };
  } catch {
    return {
      error: true,
      status: 500,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 초대 링크 없이 그룹에 멤버 추가
 */
export async function postGroupMember(
  groupId: number,
  data: { userEmail: string }
) {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}/member`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "멤버 추가에 실패했습니다.",
      };
    }

    return await response.json();
  } catch {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}
