import { cookies } from "next/headers";
import { BASE_URL } from "@/constants/api";

/**
 * accessToken과 refreshToken을 쿠키에 설정하는 공통 함수
 * @param accessToken accessToken 값
 * @param refreshToken refreshToken 값
 * @param accessTokenMaxAge accessToken의 유효 기간 (초 단위, 선택사항)
 * @param refreshTokenMaxAge refreshToken의 유효 기간 (초 단위, 선택사항)
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken?: string
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
  });

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      ...cookieOptions,
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
 * 외부 API를 직접 호출하는 공통 함수
 * 쿠키에서 accessToken을 읽어서 Authorization 헤더에 자동으로 추가합니다.
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

  return fetch(fullUrl, {
    method,
    headers: headersWithAuth,
    body,
  });
}
