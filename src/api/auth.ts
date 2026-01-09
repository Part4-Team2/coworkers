"use server";

import { cookies } from "next/headers";
import { BASE_URL } from "@/constants/api";
import { fetchApi } from "@/utils/api";
import {
  SignInRequestBody,
  SignInResponse,
  SignUpRequestBody,
  SignUpResponse,
  SignInWithOauthRequestBody,
} from "@/types/api/auth";

export async function postSignup(data: SignUpRequestBody) {
  try {
    const response = await fetch(`${BASE_URL}/auth/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: result.message || result.error || "회원가입에 실패했습니다.",
      };
    }

    const responseData = result as SignUpResponse;

    // 쿠키 설정
    const cookieStore = await cookies();
    cookieStore.set("accessToken", responseData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    cookieStore.set("refreshToken", responseData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: "/",
    });

    return responseData;
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

export async function postSignin(data: SignInRequestBody) {
  try {
    const response = await fetch(`${BASE_URL}/auth/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: result.message || result.error || "로그인에 실패했습니다.",
      };
    }

    const responseData = result as SignInResponse;

    // 쿠키 설정
    const cookieStore = await cookies();
    cookieStore.set("accessToken", responseData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    cookieStore.set("refreshToken", responseData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: "/",
    });

    return responseData;
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

export async function postRefreshToken(data: { refreshToken: string }) {
  try {
    const response = await fetchApi(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "토큰 갱신에 실패했습니다.",
      };
    }

    const result = (await response.json()) as { accessToken: string };

    // 새로운 accessToken을 쿠키에 저장
    const cookieStore = await cookies();
    cookieStore.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    return result;
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

export async function postSigninKakao(data: SignInWithOauthRequestBody) {
  try {
    const response = await fetch(`${BASE_URL}/auth/signIn/kakao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "카카오 로그인에 실패했습니다.",
      };
    }

    const responseData = (await response.json()) as SignInResponse;

    // 쿠키 설정
    const cookieStore = await cookies();
    cookieStore.set("accessToken", responseData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    cookieStore.set("refreshToken", responseData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: "/",
    });

    return responseData;
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}

// 로그아웃 함수입니다.
export async function logoutAction() {
  const cookieStore = cookies();

  (await cookieStore).set("accessToken", "", {
    maxAge: 0,
    path: "/",
  });
}
