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
    console.log("[API Proxy] accessToken:", accessToken ? "exists" : "missing");
    console.log("[API Proxy] pathSegments:", pathSegments);

    // 경로 조합 (예: ['user'] -> '/user', ['groups', '1', 'member'] -> '/groups/1/member')
    const backendPath = `/${pathSegments.join("/")}`;
    const searchParams = request.nextUrl.search;
    const backendUrl = `${BASE_URL}${backendPath}${searchParams}`;

    console.log("[API Proxy] BASE_URL:", BASE_URL);
    console.log("[API Proxy] Backend URL:", backendUrl);
    console.log("[API Proxy] Method:", request.method);

    // 요청 헤더 준비
    const headers = new Headers();

    // accessToken이 있으면 Authorization 헤더 추가
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
      console.log("[API Proxy] Authorization header added");
    } else {
      console.log("[API Proxy] WARNING: No accessToken in cookie");
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

    // 백엔드로 프록시 요청
    console.log("[API Proxy] Sending request to backend...");
    console.log(
      "[API Proxy] Request headers:",
      Object.fromEntries(headers.entries())
    );

    let response: Response;
    try {
      response = await fetch(backendUrl, {
        method: request.method,
        headers,
        body,
      });
      console.log("[API Proxy] Backend response status:", response.status);
      console.log("[API Proxy] Backend response ok:", response.ok);
    } catch (fetchError) {
      console.error("[API Proxy] Fetch failed:", fetchError);
      console.error("[API Proxy] Fetch error details:", {
        message:
          fetchError instanceof Error ? fetchError.message : String(fetchError),
        backendUrl,
        method: request.method,
      });
      throw fetchError;
    }

    // Unauthorized 에러인 경우 로깅
    if (response.status === 401) {
      console.error("[API Proxy] UNAUTHORIZED ERROR from backend");
      console.error("[API Proxy] Was accessToken sent?", !!accessToken);
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
        console.error("[API Proxy] JSON parse error:", parseError);
        console.error("[API Proxy] Response text:", data.substring(0, 200));
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
    console.error("[API Proxy] Proxy error:", error);
    console.error("[API Proxy] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      BASE_URL,
    });
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
