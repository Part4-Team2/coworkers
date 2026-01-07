import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/constants/api";
import { SignUpRequestBody } from "@/types/api/auth";

export async function POST(request: NextRequest) {
  try {
    const body: SignUpRequestBody = await request.json();

    // 백엔드 API 호출
    const response = await fetch(`${BASE_URL}/auth/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      // 에러 응답
      return NextResponse.json(
        {
          error: true,
          message: data.message || data.error || "회원가입에 실패했습니다.",
        },
        { status: response.status }
      );
    }

    // 성공 응답 - 쿠키 설정
    const apiResponse = NextResponse.json(data);

    // accessToken 쿠키 설정
    apiResponse.cookies.set("accessToken", data.accessToken, {
      httpOnly: true, // XSS 방지를 위해 JavaScript에서 접근 불가
      secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
      sameSite: "strict", // CSRF 방지
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    // refreshToken 쿠키 설정
    apiResponse.cookies.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30일 (refreshToken은 더 길게)
      path: "/",
    });

    return apiResponse;
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
