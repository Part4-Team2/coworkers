import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/api/user";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/oauth/:path*"
  ) {
    if (!accessToken) {
      return NextResponse.next();
    }
    const userData = await getUser();
    if (!("error" in userData) && "id" in userData && userData.id) {
      return NextResponse.redirect(new URL("/teamlist", request.url));
    }
    return NextResponse.next();
  } else {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const userData = await getUser();

    if ("error" in userData || !("id" in userData) || !userData.id) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

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
    "/signup",
    "/oauth/:path*",
  ],
};
