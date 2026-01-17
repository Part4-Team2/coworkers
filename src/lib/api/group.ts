"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";
import { CreateGroupBody } from "@/lib/types/group";
import { Role } from "@/types/schemas";
import { ApiResult } from "@/lib/types/api";

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

/**
 * 그룹(팀) 정보 수정
 */
export async function patchGroup(
  groupId: string,
  data: { name: string; image?: string | null }
): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "팀 수정에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "팀 수정에 실패했습니다.",
      };
    }

    revalidatePath(`/${groupId}`);
    revalidatePath(`/${groupId}/edit`);
    revalidatePath("/teamlist");
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
      // POST 요청은 fetchApi를 통해 자동으로 캐싱되지 않음
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "팀 생성에 실패했습니다.",
      };
    }

    const result = (await response.json()) as {
      name: string;
      image: string | null;
      updatedAt: string;
      createdAt: string;
      id: number;
    };

    // 팀 생성 성공 후 관련 캐시 무효화
    revalidatePath("/teamlist");
    // 새로 생성된 팀 페이지도 무효화
    if (result.id) {
      revalidatePath(`/${result.id}`);
    }

    return result;
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

    // API가 토큰 문자열을 직접 반환 (큰따옴표 제거)
    const token = (await response.text()).replace(/^"|"$/g, "");
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
      // POST 요청은 fetchApi를 통해 자동으로 캐싱되지 않음
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        status: response.status,
        message: error.message || "초대 수락에 실패했습니다.",
      };
    }

    const result = (await response.json()) as { groupId: number };

    // 초대 수락 성공 후 관련 캐시 무효화
    revalidatePath(`/${result.groupId}`);
    revalidatePath("/teamlist");

    return result;
  } catch {
    return {
      error: true,
      status: 500,
      message: "서버 오류가 발생했습니다.",
    };
  }
}
