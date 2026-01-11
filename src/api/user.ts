"use server";

import { cookies } from "next/headers";
import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/constants/api";
import { Role } from "@/types/schemas";
import {
  UpdateUserRequestBody,
  SendResetPasswordEmailRequest,
  ResetPasswordBody,
  UpdatePasswordBody,
} from "@/types/api/user";

export async function getUser() {
  try {
    const response = await fetchApi(`${BASE_URL}/user`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "사용자 정보를 가져오는데 실패했습니다.",
      }));
      return {
        error: true as const,
        message: error.message || "사용자 정보를 가져오는데 실패했습니다.",
      };
    }

    return (await response.json()) as {
      teamId: string;
      image: string | null;
      nickname: string;
      updatedAt: string;
      createdAt: string;
      email: string;
      id: number;
      memberships: Array<{
        group: {
          teamId: string;
          updatedAt: string;
          createdAt: string;
          image: string | null;
          name: string;
          id: number;
        };
        role: Role;
        userImage: string | null;
        userEmail: string;
        userName: string;
        groupId: number;
        userId: number;
      }>;
    };
  } catch (error) {
    return {
      error: true as const,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자의 멤버십 정보 조회
 */
export async function getUserMemberships() {
  try {
    const response = await fetchApi(`${BASE_URL}/user/memberships`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "멤버십 정보를 가져오는데 실패했습니다.",
      }));
      return {
        error: true as const,
        message: error.message || "멤버십 정보를 가져오는데 실패했습니다.",
      };
    }

    return (await response.json()) as Array<{
      userId: number;
      groupId: number;
      userName: string;
      userEmail: string;
      userImage: string | null;
      role: Role;
      group: {
        id: number;
        name: string;
        image: string | null;
        createdAt: string;
        updatedAt: string;
        teamId: string;
      };
    }>;
  } catch (error: unknown) {
    return {
      error: true as const,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자가 참여한 그룹(팀) 목록 조회
 */
export async function getUserGroups() {
  try {
    const response = await fetchApi(`${BASE_URL}/user/groups`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "팀 목록을 가져오는데 실패했습니다.",
      }));
      return {
        error: true as const,
        message: error.message || "팀 목록을 가져오는데 실패했습니다.",
      };
    }

    return (await response.json()) as Array<{
      id: number;
      name: string;
      image: string | null;
      createdAt: string;
      updatedAt: string;
      teamId: string;
    }>;
  } catch (error: unknown) {
    return {
      error: true as const,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

export async function patchUser(data: UpdateUserRequestBody) {
  try {
    const response = await fetchApi(`${BASE_URL}/user`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "사용자 정보 수정에 실패했습니다.",
      }));
      return {
        error: true,
        message: error.message || "사용자 정보 수정에 실패했습니다.",
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

export async function deleteUser() {
  try {
    const response = await fetchApi(`${BASE_URL}/user`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "사용자 삭제에 실패했습니다.",
      };
    }

    // 쿠키 삭제
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    // 성공 응답 반환 (클라이언트에서 리다이렉트 처리)
    return { success: true };
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/*
GET /{teamId}/user/groups
GET /{teamId}/user/memberships
GET /{teamId}/user/history
추가해 주시면 됩니다!
*/

/*
비밀번호 재설정 이메일 전송

{redirectUrl}/reset-password?token=${token}로 이동할 수 있는 링크를 이메일로 전송합니다. 
e.g. "https://coworkers.vercel.app/reset-password?token=1234567890"
*/
export async function postUserResetPassword(
  data: SendResetPasswordEmailRequest
) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/user/send-reset-password-email`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "비밀번호 재설정 이메일 전송에 실패했습니다.",
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

/*
이메일로 전달받은 링크에서 비밀번호 초기화

POST user/send-reset-password-email 요청으로 발송한 메일의 링크에 담긴 토큰을 사용해야 합니다.

토큰 유효 시간: 1시간
*/
export async function patchUserResetPassword(data: ResetPasswordBody) {
  try {
    const response = await fetchApi(`${BASE_URL}/user/reset-password`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "비밀번호 재설정에 실패했습니다.",
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

export async function patchUserPassword(data: UpdatePasswordBody) {
  try {
    const response = await fetchApi(`${BASE_URL}/user/password`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "비밀번호 변경에 실패했습니다.",
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
