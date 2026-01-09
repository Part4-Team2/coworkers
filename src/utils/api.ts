import { postRefreshToken } from "@/api/auth";
import { cookies } from "next/headers";

/**
 * accessToken과 refreshToken을 쿠키에 설정하는 공통 함수
 * @param accessToken accessToken 값
 * @param refreshToken refreshToken 값
 * @param accessTokenMaxAge accessToken의 유효 기간 (초 단위, 선택사항)
 * @param refreshTokenMaxAge refreshToken의 유효 기간 (초 단위, 선택사항)
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken?: string,
  accessTokenMaxAge: number = 3600, // 1시간
  refreshTokenMaxAge: number = 604800 // 7일
): Promise<void> {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };

  cookieStore.set("accessToken", accessToken, {
    ...cookieOptions,
    ...(accessTokenMaxAge && { maxAge: accessTokenMaxAge }),
  });

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      ...cookieOptions,
      ...(refreshTokenMaxAge && { maxAge: refreshTokenMaxAge }),
    });
  }
}

/**
 * 쿠키에서 accessToken을 읽어서 Authorization 헤더 값으로 변환합니다.
 * @returns Authorization 헤더 값 (Bearer {token}) 또는 null
 */
export async function getAuthorizationHeader(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  return `Bearer ${accessToken}`;
}

/**
 * 쿠키에서 accessToken을 읽어서 fetch 요청 헤더에 Authorization을 추가합니다.
 * @param headers 기존 헤더 객체 (선택사항)
 * @returns Authorization 헤더가 포함된 Headers 객체
 */
export async function createHeadersWithAuth(
  headers?: HeadersInit
): Promise<Headers> {
  const newHeaders = new Headers(headers);
  const authorization = await getAuthorizationHeader();

  if (authorization) {
    newHeaders.set("Authorization", authorization);
  }

  return newHeaders;
}

/**
 * 쿠키에서 refreshToken을 읽어옵니다.
 * @returns refreshToken 값 또는 null
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  return refreshToken || null;
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
      const refreshResult = await postRefreshToken({ refreshToken });

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
