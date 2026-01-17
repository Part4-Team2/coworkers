"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";
import { Role } from "@/types/schemas";
import {
  UpdateUserRequestBody,
  SendResetPasswordEmailRequest,
  ResetPasswordBody,
  UpdatePasswordBody,
} from "@/lib/types/user";
import { ApiResult } from "@/lib/types/api";

export type User = {
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

export type UserGroup = {
  id: number;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  teamId: string;
};

export type UserHistory = {
  tasksDone: Array<{
    displayIndex: number;
    writerId: number;
    userId: number;
    deletedAt: string | null;
    frequency: string;
    description: string;
    name: string;
    recurringId: number;
    doneAt: string;
    date: string;
    updatedAt: string;
    id: number;
  }>;
};

export async function getUser(): Promise<ApiResult<User>> {
  try {
    const response = await fetchApi(`${BASE_URL}/user`, {
      // 사용자 정보는 자주 변경될 수 있으므로 짧은 시간 캐싱 (60초)
      // 또는 태그 기반 캐싱으로 무효화 가능
      next: { tags: ["user"] },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "사용자 정보를 가져오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "사용자 정보를 가져오는데 실패했습니다.",
      };
    }

    const responseData = (await response.json()) as User;
    return { success: true, data: responseData };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자가 참여한 그룹(팀) 목록 조회
 */
export async function getUserGroups(): Promise<ApiResult<UserGroup[]>> {
  try {
    const response = await fetchApi(`${BASE_URL}/user/groups`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "팀 목록을 가져오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "팀 목록을 가져오는데 실패했습니다.",
      };
    }

    const responseData = (await response.json()) as UserGroup[];
    return { success: true, data: responseData };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

export async function patchUser(
  data: UpdateUserRequestBody
): Promise<ApiResult<{ message: string }>> {
  try {
    const response = await fetchApi(`${BASE_URL}/user`, {
      method: "PATCH",
      body: JSON.stringify(data),
      // PATCH 요청은 캐싱하지 않음
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "사용자 정보 수정에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "사용자 정보 수정에 실패했습니다.",
      };
    }

    const responseData = (await response.json()) as { message: string };

    // 사용자 정보 수정 성공 후 관련 캐시 무효화
    revalidatePath("/mypage");
    // 태그 기반 캐시 무효화 (getUser에서 사용하는 태그)
    // revalidateTag는 타입 이슈로 주석 처리, 필요시 revalidatePath로 대체

    return { success: true, data: responseData };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

export async function deleteUser(): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(`${BASE_URL}/user`, {
      method: "DELETE",
      // DELETE 요청은 캐싱하지 않음
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "사용자 삭제에 실패했습니다.",
      };
    }

    // 쿠키 삭제
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    // 사용자 삭제 성공 후 관련 캐시 무효화
    revalidatePath("/mypage");
    revalidatePath("/teamlist");
    // 모든 사용자 관련 페이지 캐시 무효화

    // 성공 응답 반환 (클라이언트에서 리다이렉트 처리)
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자의 완료된 할 일 목록 조회
 */
export async function getUserHistory() {
  try {
    const response = await fetchApi(`${BASE_URL}/user/history`, {
      next: {
        tags: ["user-history"],
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "완료된 할 일 목록을 가져오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "완료된 할 일 목록을 가져오는데 실패했습니다.",
      };
    }

    const responseData = (await response.json()) as UserHistory;
    return { success: true, data: responseData };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/*
GET /{teamId}/user/groups
GET /{teamId}/user/memberships
추가해 주시면 됩니다!
*/

/*
비밀번호 재설정 이메일 전송

{redirectUrl}/reset-password?token=${token}로 이동할 수 있는 링크를 이메일로 전송합니다. 
e.g. "https://coworkers.vercel.app/reset-password?token=1234567890"
*/
export async function postUserResetPassword(
  data: SendResetPasswordEmailRequest
): Promise<ApiResult<{ message: string }>> {
  try {
    const response = await fetchApi(
      `${BASE_URL}/user/send-reset-password-email`,
      {
        method: "POST",
        body: JSON.stringify(data),
        // POST 요청은 캐싱하지 않음
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "비밀번호 재설정 이메일 전송에 실패했습니다.",
      };
    }

    const responseData = (await response.json()) as { message: string };
    return { success: true, data: responseData };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/*
이메일로 전달받은 링크에서 비밀번호 초기화

POST user/send-reset-password-email 요청으로 발송한 메일의 링크에 담긴 토큰을 사용해야 합니다.

토큰 유효 시간: 1시간
*/
export async function patchUserResetPassword(
  data: ResetPasswordBody
): Promise<ApiResult<{ message: string }>> {
  try {
    const response = await fetchApi(`${BASE_URL}/user/reset-password`, {
      method: "PATCH",
      body: JSON.stringify(data),
      // PATCH 요청은 캐싱하지 않음
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "비밀번호 재설정에 실패했습니다.",
      };
    }

    const responseData = (await response.json()) as { message: string };
    return { success: true, data: responseData };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

export async function patchUserPassword(
  data: UpdatePasswordBody
): Promise<ApiResult<{ message: string }>> {
  try {
    const response = await fetchApi(`${BASE_URL}/user/password`, {
      method: "PATCH",
      body: JSON.stringify(data),
      // PATCH 요청은 캐싱하지 않음
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "비밀번호 변경에 실패했습니다.",
      };
    }

    const responseData = (await response.json()) as { message: string };

    // 비밀번호 변경 성공 후 사용자 관련 캐시 무효화
    revalidatePath("/mypage");

    return { success: true, data: responseData };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}
