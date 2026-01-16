"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";
import { REVALIDATE_TIME, REVALIDATE_TAG } from "@/constants/cache";
import { CreateGroupBody } from "@/lib/types/group";
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
 *
 * Next.js 16 Cache Components:
 * - 'use cache' 지시어로 함수 레벨 캐싱
 * - cacheTag로 수동 무효화 지원
 * - cacheLife 'max' 프로필: stale-while-revalidate 동작
 */
/**
 * 그룹 상세 정보 조회
 *
 * 캐싱 전략:
 * - fetch의 force-cache + revalidate (REVALIDATE_TIME.GROUP_DETAIL)
 * - URL 기반 캐싱으로 모든 사용자가 동일한 캐시 공유
 * - accessToken은 Authorization 헤더로 전달되어 캐시 키에 포함되지 않음
 * - tags: REVALIDATE_TAG.GROUP로 수동 무효화 지원
 *
 * Note: "use cache" 지시어는 인증 헤더를 동적으로 처리할 수 없어
 * fetch의 cache 옵션을 사용합니다.
 *
 * @param groupId 그룹 ID
 * @param accessToken 액세스 토큰 (선택사항, 외부에서 cookies()로 읽어서 전달)
 * @returns 그룹 상세 정보 또는 에러
 */
export async function getGroup(
  groupId: string,
  accessToken: string | null = null
): Promise<ApiResult<GroupDetailResponse>> {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
      accessToken,
      cache: "force-cache",
      next: {
        revalidate: REVALIDATE_TIME.GROUP_DETAIL,
        tags: [REVALIDATE_TAG.GROUP(groupId)],
      },
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
 *
 * 캐싱 전략:
 * - cache: "no-store" (변경 작업이므로 캐싱하지 않음)
 * - 캐시 무효화: revalidatePath(`/${groupId}`)로 해당 그룹 페이지 재검증
 *
 * @param groupId 그룹 ID
 * @param name 할 일 목록 이름
 * @returns 생성된 할 일 목록 정보 또는 에러
 *
 * @todo Server Action으로 전환 후 revalidateTag(`group-${groupId}`) 사용 권장
 *       (read-your-writes 일관성을 위해)
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
        cache: "no-store",
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

    // 캐시 무효화: 그룹 페이지 재검증
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
 *
 * 캐싱 전략:
 * - cache: "no-store" (변경 작업이므로 캐싱하지 않음)
 * - 캐시 무효화: revalidatePath(`/${groupId}`)로 해당 그룹 페이지 재검증
 *
 * @param groupId 그룹 ID
 * @param taskListId 할 일 목록 ID
 * @param name 새로운 할 일 목록 이름
 * @returns 수정된 할 일 목록 정보 또는 에러
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
        cache: "no-store",
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

    // 캐시 무효화: 그룹 페이지 재검증
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
 *
 * 캐싱 전략:
 * - cache: "no-store" (변경 작업이므로 캐싱하지 않음)
 * - 캐시 무효화: revalidatePath(`/${groupId}`)로 해당 그룹 페이지 재검증
 *
 * @param groupId 그룹 ID
 * @param taskListId 삭제할 할 일 목록 ID
 * @returns 성공 여부 또는 에러
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
        cache: "no-store",
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

    // 캐시 무효화: 그룹 페이지 재검증
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
 * - 변경 작업: cache no-store
 * - 캐시 무효화: 해당 그룹 및 전체 목록
 */
export async function deleteGroup(groupId: string): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
      method: "DELETE",
      cache: "no-store",
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

    // 그룹 및 목록 캐시 무효화
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
 * - 변경 작업: cache no-store
 * - 캐시 무효화: 해당 그룹의 멤버 정보
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
        cache: "no-store",
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

    // 캐시 무효화 - 해당 그룹의 멤버 정보
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
 * - 변경 작업: cache no-store
 * - 캐시 무효화: 해당 그룹 및 전체 목록
 */
export async function patchGroup(
  groupId: string,
  data: { name: string; image?: string | null }
): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      cache: "no-store",
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

    // 캐시 무효화 - 해당 그룹 및 전체 목록
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
 * 그룹(팀) 생성
 * - 변경 작업: cache no-store
 * - 캐시 무효화: 전체 목록
 */
export async function postGroup(data: CreateGroupBody) {
  try {
    const response = await fetchApi(`${BASE_URL}/groups`, {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
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

    // 팀 목록 캐시 무효화
    revalidatePath("/teamlist");

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
 * - 매번 새로운 토큰 생성: cache no-store
 */
export async function getGroupInvitation(groupId: string) {
  try {
    const response = await fetchApi(
      `${BASE_URL}/groups/${groupId}/invitation`,
      {
        cache: "no-store",
      }
    );

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
 * - 변경 작업: cache no-store
 * - 캐시 무효화: 해당 그룹 및 전체 목록
 */
export async function postGroupAcceptInvitation(data: {
  userEmail: string;
  token: string;
}) {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/accept-invitation`, {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
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

    // 그룹 및 멤버, 목록 캐시 무효화
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
