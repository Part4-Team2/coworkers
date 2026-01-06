import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("pathname", pathname);
  // 이전에 middleware.ts에서는 matcher안하면 동작 안했음 차이점.
  // 명시한 패스에 대해서만 동작
  const accessToken = req.cookies.get("accessToken")?.value ?? ""; // undefined일때 빈 스트링
  console.log("accessToken", accessToken);
  // 개발 전용 페이지 - /test로 시작하는 모든 경로
  const isDevOnlyPage = pathname.startsWith("/test");

  // 🚫 프로덕션에서는 접근 차단
  if (process.env.NODE_ENV === "production" && isDevOnlyPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (accessToken) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/addteam"],
};
