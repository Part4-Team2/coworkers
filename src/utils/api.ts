import { postRefreshToken } from "@/api/auth";
import { getRefreshToken, createHeadersWithAuth } from "@/utils/cookies";
// 진행 중인 토큰 리프레시 Promise를 저장
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let refreshPromise: Promise<any> | null = null;

async function refreshTokenOnce(refreshToken: string) {
  if (!refreshPromise) {
    refreshPromise = postRefreshToken({ refreshToken }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}
/**
 * 외부 API를 직접 호출하는 공통 함수
 * 쿠키에서 accessToken을 읽어서 Authorization 헤더에 자동으로 추가합니다.
 * accessToken이 만료되면 자동으로 refreshToken을 사용해 갱신합니다.
 * @param url 전체 URL (예: `${BASE_URL}/groups/accept-invitation`)
 */
export async function fetchApi(
  url: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    headers?: HeadersInit;
    body?: BodyInit;
    searchParams?: string;
  } = {}
): Promise<Response> {
  const { method = "GET", headers = {}, body, searchParams = "" } = options;

  // Authorization 헤더 추가
  const headersWithAuth = await createHeadersWithAuth(headers);

  // Content-Type이 설정되지 않았고 body가 있으면 기본값 설정
  if (body && !headersWithAuth.has("Content-Type")) {
    if (body instanceof FormData) {
      // FormData는 boundary가 자동으로 설정되므로 Content-Type을 설정하지 않음
    } else {
      headersWithAuth.set("Content-Type", "application/json");
    }
  }

  const fullUrl = `${url}${searchParams}`;

  // 첫 번째 요청 시도
  let response = await fetch(fullUrl, {
    method,
    headers: headersWithAuth,
    body,
  });

  // 401 Unauthorized 응답이고 refreshToken이 있으면 토큰 갱신 시도
  if (response.status === 401) {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      // refreshToken으로 새로운 accessToken 요청
      const refreshResult = await refreshTokenOnce(refreshToken);

      if (!("error" in refreshResult)) {
        // 토큰 갱신 성공 - 새로운 accessToken으로 원래 요청 재시도
        const newHeadersWithAuth = await createHeadersWithAuth(headers);

        // Content-Type 재설정
        if (body && !newHeadersWithAuth.has("Content-Type")) {
          if (body instanceof FormData) {
            // FormData는 boundary가 자동으로 설정되므로 Content-Type을 설정하지 않음
          } else {
            newHeadersWithAuth.set("Content-Type", "application/json");
          }
        }
        // 원래 요청 재시도
        response = await fetch(fullUrl, {
          method,
          headers: newHeadersWithAuth,
          body,
        });
      }
      // refreshToken도 만료되었거나 갱신 실패한 경우 원래 401 응답 반환
    }
  }

  return response;
}
