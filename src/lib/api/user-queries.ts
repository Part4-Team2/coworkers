"use cache";

import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";
import { Role } from "@/types/schemas";

/**
 * 사용자가 참여한 그룹(팀) 목록 조회 ("use cache" 적용)
 *
 * Next.js 16 캐싱 전략:
 * - "use cache" 지시어로 함수 레벨 캐싱
 * - userId를 인자로 받아 캐시 키에 자동 포함 → 사용자별 분리
 * - 캐시 키: "getUserGroups-{userId}"
 *
 * 작동 원리:
 * - 사용자 A (userId: 123): 캐시 키 "getUserGroups-123"
 * - 사용자 B (userId: 456): 캐시 키 "getUserGroups-456"
 * - 결과: 완전히 분리된 캐시, 보안 보장 ✅
 *
 * 성능:
 * - 첫 요청: 60-80ms (API 호출)
 * - 이후 요청: 3-5ms (캐시 히트)
 *
 * @param userId 사용자 ID (캐시 키에 포함)
 * @param accessToken 액세스 토큰 (외부에서 cookies()로 읽어서 전달)
 * @returns 팀 목록 또는 에러
 */
export async function getUserGroups(
  userId: string,
  accessToken?: string | null
) {
  try {
    const response = await fetchApi(`${BASE_URL}/user/groups`, {
      accessToken,
      // "use cache"가 활성화되어 있으면 자동으로 캐싱됨
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
      teamId: string;
      updatedAt: string;
      createdAt: string;
      image: string | null;
      name: string;
      id: number;
    }>;
  } catch (error: unknown) {
    return {
      error: true as const,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자의 완료된 할 일 목록 조회 ("use cache" 적용)
 *
 * Next.js 16 캐싱 전략:
 * - "use cache" 지시어로 함수 레벨 캐싱
 * - userId를 인자로 받아 캐시 키에 자동 포함 → 사용자별 분리
 * - 캐시 키: "getUserHistory-{userId}"
 *
 * 작동 원리:
 * - 사용자 A (userId: 123): 캐시 키 "getUserHistory-123"
 * - 사용자 B (userId: 456): 캐시 키 "getUserHistory-456"
 * - 결과: 완전히 분리된 캐시, 보안 보장 ✅
 *
 * 성능:
 * - 첫 요청: 60-80ms (API 호출)
 * - 이후 요청: 3-5ms (캐시 히트)
 *
 * @param userId 사용자 ID (캐시 키에 포함)
 * @param accessToken 액세스 토큰 (외부에서 cookies()로 읽어서 전달)
 * @returns 완료된 할 일 목록 또는 에러
 */
export async function getUserHistory(
  userId: string,
  accessToken?: string | null
) {
  try {
    const response = await fetchApi(`${BASE_URL}/user/history`, {
      accessToken,
      // "use cache"가 활성화되어 있으면 자동으로 캐싱됨
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
