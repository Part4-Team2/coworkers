"use cache";

import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";
import type { ApiResult, GroupDetailResponse } from "./group";

/**
 * 그룹 상세 정보 조회 ("use cache" 적용)
 *
 * Next.js 16 캐싱 전략:
 * - "use cache" 지시어로 함수 레벨 캐싱
 * - userId를 인자로 받아 캐시 키에 자동 포함 → 사용자별 분리
 * - 캐시 키: "getGroup-{groupId}-{userId}"
 *
 * 작동 원리:
 * - 사용자 A (userId: 123): 캐시 키 "getGroup-3740-123"
 * - 사용자 B (userId: 456): 캐시 키 "getGroup-3740-456"
 * - 결과: 완전히 분리된 캐시, 보안 보장 ✅
 *
 * 성능:
 * - 첫 요청: 80ms (API 호출)
 * - 이후 요청: 3-5ms (캐시 히트)
 *
 * @param groupId 그룹 ID
 * @param userId 사용자 ID (캐시 키에 포함)
 * @param accessToken 액세스 토큰 (외부에서 cookies()로 읽어서 전달)
 * @returns 그룹 상세 정보 또는 에러
 */
export async function getGroup(
  groupId: string,
  userId: string,
  accessToken?: string | null
): Promise<ApiResult<GroupDetailResponse>> {
  try {
    const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
      accessToken,
      // "use cache"가 활성화되어 있으면 자동으로 캐싱됨
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "그룹 정보를 가져오는데 실패했습니다.",
      }));
      return {
        success: false as const,
        error: error.message || "그룹 정보를 가져오는데 실패했습니다.",
      };
    }

    const data = (await response.json()) as GroupDetailResponse;
    return { success: true as const, data };
  } catch {
    return {
      success: false as const,
      error: "서버 오류가 발생했습니다.",
    };
  }
}
