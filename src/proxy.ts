import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret"
);

async function isTokenValid(token: string) {
  try {
    await jwtVerify(token, secret);
    return false;
  } catch {
    return true;
  }
}

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
    const isValid = await isTokenValid(accessToken);
    if (isValid) {
      return NextResponse.redirect(new URL("/teamlist", request.url));
    }
    // const userData = await getUser();
    // if (!("error" in userData) && "id" in userData && userData.id) {
    //   return NextResponse.redirect(new URL("/teamlist", request.url));
    // }
    return NextResponse.next();
  } else {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const isValid = await isTokenValid(accessToken);
    if (!isValid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // const userData = await getUser();

    // if ("error" in userData || !("id" in userData) || !userData.id) {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

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
