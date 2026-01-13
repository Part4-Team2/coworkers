import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/api/user";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // /login 페이지 처리
  if (pathname === "/login") {
    // accessToken이 없으면 로그인 페이지 접근 허용 (getUser() 호출 없이)
    if (!accessToken) {
      return NextResponse.next();
    }
    // accessToken이 있을 때만 getUser() 호출하여 리다이렉트 여부 결정
    const userData = await getUser();
    if (!("error" in userData) && "id" in userData && userData.id) {
      // isLogin = true → /teamlist로 리다이렉트
      return NextResponse.redirect(new URL("/teamlist", request.url));
    }
    // 사용자 정보 조회 실패 시 로그인 페이지 접근 허용
    return NextResponse.next();
  } else {
    // 보호된 페이지 처리
    // accessToken이 없으면 바로 리다이렉트 (getUser() 호출 없이 - 비용 절감)
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // accessToken이 있을 때만 getUser() 호출
    const userData = await getUser();

    // isLogin = false (에러 또는 userId 없음) → 로그인 페이지로 리다이렉트
    if ("error" in userData || !("id" in userData) || !userData.id) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // isLogin = true → 페이지 접근 허용
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/addteam",
    "/jointeam",
    "/myhistory",
    "/mypage",
    "/teamlist",
    "/boards/writeArticle",
    "/login",
  ],
};
