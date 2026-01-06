import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/constants/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolvedParams = await Promise.resolve(params);
  return proxyRequest(request, resolvedParams.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolvedParams = await Promise.resolve(params);
  return proxyRequest(request, resolvedParams.path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolvedParams = await Promise.resolve(params);
  return proxyRequest(request, resolvedParams.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolvedParams = await Promise.resolve(params);
  return proxyRequest(request, resolvedParams.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolvedParams = await Promise.resolve(params);
  return proxyRequest(request, resolvedParams.path);
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[] | undefined
) {
  try {
    // pathSegments 확인
    if (
      !pathSegments ||
      !Array.isArray(pathSegments) ||
      pathSegments.length === 0
    ) {
      console.error("[API Proxy] ERROR: Invalid pathSegments:", pathSegments);
      return NextResponse.json(
        { error: true, message: "잘못된 경로입니다." },
        { status: 400 }
      );
    }

    // BASE_URL 확인
    if (!BASE_URL) {
      console.error("[API Proxy] ERROR: BASE_URL is not defined");
      return NextResponse.json(
        {
          error: true,
          message: "서버 설정 오류: API URL이 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    // 쿠키에서 accessToken 읽기
    const accessToken = request.cookies.get("accessToken")?.value;

    // 경로 조합 (예: ['user'] -> '/user', ['groups', '1', 'member'] -> '/groups/1/member')
    const backendPath = `/${pathSegments.join("/")}`;
    const searchParams = request.nextUrl.search;
    const backendUrl = `${BASE_URL}${backendPath}${searchParams}`;

    // 요청 헤더 준비
    const headers = new Headers();

    // accessToken이 있으면 Authorization 헤더 추가
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // 요청 body 처리
    let body: BodyInit | undefined;
    const contentType = request.headers.get("content-type");

    if (request.method !== "GET" && request.method !== "HEAD") {
      // FormData인 경우
      if (contentType?.includes("multipart/form-data")) {
        body = await request.formData();
        // FormData는 boundary가 자동으로 설정되므로 Content-Type 헤더를 설정하지 않음
      } else {
        // JSON이나 다른 타입인 경우
        if (contentType) {
          headers.set("Content-Type", contentType);
        }
        body = await request.text();
      }
    }

    let response: Response;
    try {
      response = await fetch(backendUrl, {
        method: request.method,
        headers,
        body,
      });
    } catch (fetchError) {
      throw fetchError;
    }

    // 응답 헤더 복사
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // CORS 관련 헤더는 제외
      if (
        !key.toLowerCase().startsWith("access-control-") &&
        key.toLowerCase() !== "content-encoding"
      ) {
        responseHeaders.set(key, value);
      }
    });

    // 응답 데이터 가져오기
    const data = await response.text();

    // Content-Type 확인
    const responseContentType = response.headers.get("content-type");

    // JSON인 경우 파싱 시도
    if (responseContentType?.includes("application/json") && data) {
      try {
        const jsonData = JSON.parse(data);
        return NextResponse.json(jsonData, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      } catch (parseError) {
        // 파싱 실패 시 원본 텍스트 반환
        return new NextResponse(data, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      }
    }

    // JSON이 아닌 경우 원본 그대로 반환
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        message:
          error instanceof Error
            ? error.message
            : "프록시 요청에 실패했습니다.",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
