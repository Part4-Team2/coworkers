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
    maxAge: accessTokenMaxAge,
  });

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: refreshTokenMaxAge,
    });
  }
}

/**
 * 쿠키에서 accessToken을 읽어서 Authorization 헤더 값으로 변환합니다.
 * @returns Authorization 헤더 값 (Bearer {token}) 또는 null
 */
async function getAuthorizationHeader(): Promise<string | null> {
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
