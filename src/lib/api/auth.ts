"use server";

import { BASE_URL } from "@/lib/api";
import { setAuthCookies } from "@/utils/cookies";
import {
  SignInRequestBody,
  SignInResponse,
  SignUpRequestBody,
  SignUpResponse,
  SignInWithOauthRequestBody,
} from "@/lib/types/auth";
import { cookies } from "next/headers";
import { ApiResult } from "@/lib/types/api";

export async function postSignup(
  data: SignUpRequestBody
): Promise<ApiResult<SignUpResponse>> {
  try {
    const response = await fetch(`${BASE_URL}/auth/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store", // 인증 API는 캐싱하지 않음
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || "회원가입에 실패했습니다.",
      };
    }

    const responseData = result as SignUpResponse;

    // 쿠키 설정
    await setAuthCookies(responseData.accessToken, responseData.refreshToken);

    return { success: true, data: responseData };
  } catch (error) {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

export async function postSignin(
  data: SignInRequestBody
): Promise<ApiResult<SignInResponse>> {
  try {
    const response = await fetch(`${BASE_URL}/auth/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store", // 인증 API는 캐싱하지 않음
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || "로그인에 실패했습니다.",
      };
    }

    const responseData = result as SignInResponse;

    // 쿠키 설정
    await setAuthCookies(responseData.accessToken, responseData.refreshToken);

    return { success: true, data: responseData };
  } catch (error) {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

export async function postRefreshToken(data: {
  refreshToken: string;
}): Promise<ApiResult<{ accessToken: string }>> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store", // 토큰 갱신은 항상 최신 상태로 요청
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "토큰 갱신에 실패했습니다.",
      };
    }

    const result = (await response.json()) as { accessToken: string };

    // 새로운 accessToken을 쿠키에 저장
    await setAuthCookies(result.accessToken);

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

export async function postSigninKakao(
  data: SignInWithOauthRequestBody
): Promise<ApiResult<SignInResponse>> {
  try {
    const response = await fetch(`${BASE_URL}/auth/signIn/KAKAO`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store", // 인증 API는 캐싱하지 않음
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "카카오 로그인에 실패했습니다.",
      };
    }

    const responseData = (await response.json()) as SignInResponse;

    // 쿠키 설정
    await setAuthCookies(responseData.accessToken, responseData.refreshToken);

    return { success: true, data: responseData };
  } catch (error) {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 로그아웃 함수입니다.
export async function logoutAction() {
  await setAuthCookies("", "", 0, 0);

  const cookieStore = await cookies();
  cookieStore.delete("refreshToken");
}
