"use server";

import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/constants/api";
import { CreateGroupBody } from "@/types/api/group";
import { Role } from "@/types/schemas";

/*
GET /{teamId}/groups/{id}
PATCH /{teamId}/groups/{id}
DELETE /{teamId}/groups/{id}
추가해 주시면 됩니다!
*/

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
export async function getGroup(groupId: string) {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "그룹 정보를 가져오는데 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "그룹 정보를 가져오는데 실패했습니다.",
      };
    }

    return (await response.json()) as GroupDetailResponse;
  } catch (error: unknown) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
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
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/*
GET /{teamId}/groups/{id}/member/{memberUserId}
DELETE /{teamId}/groups/{id}/member/{memberUserId}
GET /{teamId}/groups/{id}/invitation
추가해 주시면 됩니다!
*/

/* 
GET {id}/invitation으로 생성한 토큰으로, 초대를 수락하는 엔드포인트 
token은 초대 링크에 포함되어있는 토큰, userEmail은 초대를 수락하는 유저의 이메일
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
        message: error.message || "초대 수락에 실패했습니다.",
      };
    }

    return (await response.json()) as { groupId: number };
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/* 초대 링크없이 그룹에 유저를 추가하는 엔드포인트 */
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
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/*
GET /{teamId}/groups/{id}/tasks
추가해 주시면 됩니다!
*/
