import { BASE_URL } from "@/constants/api";
import {
  SignInRequestBody,
  SignInResponse,
  SignUpRequestBody,
  SignUpResponse,
  SignInWithOauthRequestBody,
} from "@/types/api/auth";

export async function postSignup(data: SignUpRequestBody) {
  const response = await fetch("/api/auth/signup", {
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
      message: error.message || "회원가입에 실패했습니다.",
    };
  }

  return (await response.json()) as SignUpResponse;
}

export async function postSignin(data: SignInRequestBody) {
  const response = await fetch("/api/auth/signin", {
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
      message: error.message || "로그인에 실패했습니다.",
    };
  }
  return (await response.json()) as SignInResponse;
}

export async function postRefreshToken(data: { refreshToken: string }) {
  const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (await response.json()) as { accessToken: string };
}

export async function postSigninKakao(data: SignInWithOauthRequestBody) {
  const response = await fetch(`${BASE_URL}/auth/signIn/kakao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (await response.json()) as SignInResponse;
}
