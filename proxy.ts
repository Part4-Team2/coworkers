import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 개발 전용 페이지 - /test로 시작하는 모든 경로
  const isDevOnlyPage = pathname.startsWith("/test");

  // 🚫 프로덕션에서는 접근 차단
  if (process.env.NODE_ENV === "production" && isDevOnlyPage) {
    return NextResponse.redirect(new URL("/404", req.url));
  }

  return NextResponse.next();
}
