"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postSigninKakao } from "@/lib/api/auth";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useHeaderStore } from "@/store/headerStore";

export default function KakaoOAuthCallbackPage() {
  const fetchUser = useHeaderStore((state) => state.fetchUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const isProcessing = useRef(false);
  const processedCodeRef = useRef<string | null>(null);

  // code와 state 값을 직접 추출
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    // code가 없으면 처리하지 않음
    if (!code) {
      setError("인증 코드를 받지 못했습니다.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    // 이미 처리한 코드면 중복 처리 방지 (가장 중요!)
    if (processedCodeRef.current === code) {
      return;
    }

    // 이미 처리 중이면 중복 처리 방지
    if (isProcessing.current) {
      return;
    }

    isProcessing.current = true;
    processedCodeRef.current = code; // 처리 시작 전에 코드 저장

    const handleCallback = async () => {
      try {
        const APP_URL =
          process.env.NEXT_PUBLIC_APP_URL ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          window.location.origin;
        const redirectUri = `${APP_URL}/oauth/kakao`;

        const response = await postSigninKakao({
          token: code,
          redirectUri,
          state: state || undefined,
        });

        if ("error" in response) {
          setError(response.message || "카카오 로그인에 실패했습니다.");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }
        await fetchUser();
        router.push("/");
      } catch (error) {
        setError("로그인 처리 중 오류가 발생했습니다.");
        setTimeout(() => router.push("/login"), 2000);
      } finally {
        // 에러 발생 시에도 isProcessing 초기화 (다만 processedCodeRef는 유지하여 중복 방지)
        isProcessing.current = false;
      }
    };

    handleCallback();
  }, [code, state, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-primary">
        <div className="flex flex-col items-center gap-16">
          <p className="text-status-danger text-md">{error}</p>
          <p className="text-text-secondary text-sm">
            로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-primary">
      <div className="flex flex-col items-center gap-16">
        <div className="animate-spin">
          <SVGIcon icon="loading" size="xl" />
        </div>
        <p className="text-text-secondary text-md">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
}
