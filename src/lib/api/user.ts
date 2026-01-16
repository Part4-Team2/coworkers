"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";
import { REVALIDATE_TIME, REVALIDATE_TAG } from "@/constants/cache";
import { Role } from "@/types/schemas";
import {
  UpdateUserRequestBody,
  SendResetPasswordEmailRequest,
  ResetPasswordBody,
  UpdatePasswordBody,
} from "@/lib/types/user";

export async function getUser() {
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
 *
 * 캐싱 전략:
 * - URL 기반 캐싱으로 모든 사용자가 동일한 캐시 공유
 * - accessToken은 Authorization 헤더로 전달되어 캐시 키에 포함되지 않음
 * - 팀 목록은 자주 보지만 변경은 드물어 캐싱 효과적
 *
 * @param accessToken 액세스 토큰 (선택사항, 외부에서 cookies()로 읽어서 전달)
 */
export async function getUserGroups(accessToken: string | null = null) {
  try {
    const response = await fetchApi(`${BASE_URL}/user/groups`, {
      accessToken,
      cache: "force-cache",
      next: {
        revalidate: REVALIDATE_TIME.GROUP_LIST, // 60초
        tags: [REVALIDATE_TAG.GROUP_LIST],
      },
    });

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
      // PATCH 요청은 캐싱하지 않음
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

    const result = (await response.json()) as { message: string };

    // 사용자 정보 수정 성공 후 관련 캐시 무효화
    revalidatePath("/mypage");
    // 태그 기반 캐시 무효화 (getUser에서 사용하는 태그)
    // revalidateTag는 타입 이슈로 주석 처리, 필요시 revalidatePath로 대체

    return result;
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
      // DELETE 요청은 캐싱하지 않음
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

    // 사용자 삭제 성공 후 관련 캐시 무효화
    revalidatePath("/mypage");
    revalidatePath("/teamlist");
    // 모든 사용자 관련 페이지 캐시 무효화

    // 성공 응답 반환 (클라이언트에서 리다이렉트 처리)
    return { success: true };
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자의 완료된 할 일 목록 조회
 *
 * 캐싱 전략:
 * - URL 기반 캐싱으로 모든 사용자가 동일한 캐시 공유
 * - accessToken은 Authorization 헤더로 전달되어 캐시 키에 포함되지 않음
 * - 히스토리는 자주 보지만 변경은 드물어 캐싱 효과적
 *
 * @param accessToken 액세스 토큰 (선택사항, 외부에서 cookies()로 읽어서 전달)
 */
export async function getUserHistory(accessToken: string | null = null) {
  try {
    const response = await fetchApi(`${BASE_URL}/user/history`, {
      accessToken,
      cache: "force-cache",
      next: {
        tags: [REVALIDATE_TAG.USER_HISTORY(0)],
        revalidate: REVALIDATE_TIME.USER_HISTORY,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "완료된 할 일 목록을 가져오는데 실패했습니다.",
      }));
      return {
        error: true as const,
        message:
          error.message || "완료된 할 일 목록을 가져오는데 실패했습니다.",
      };
    }

    return (await response.json()) as {
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
  } catch (error) {
    return {
      error: true as const,
      message: "서버 오류가 발생했습니다.",
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
) {
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
      // PATCH 요청은 캐싱하지 않음
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
      // PATCH 요청은 캐싱하지 않음
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "비밀번호 변경에 실패했습니다.",
      };
    }

    const result = (await response.json()) as { message: string };

    // 비밀번호 변경 성공 후 사용자 관련 캐시 무효화
    revalidatePath("/mypage");

    return result;
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}
