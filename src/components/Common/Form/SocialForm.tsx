"use client";

import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";

export interface SocialFormProps {
  text?: string;
  onGoogle?: () => void;
  onKakao?: () => void;
}

export default function SocialForm({
  text,
  onGoogle,
  onKakao,
}: SocialFormProps) {
  return (
    <div className="w-full flex flex-col items-center gap-16 mt-24">
      {/* 구분선과 OR */}
      <div className="w-full max-w-800 sm:px-16 flex items-center gap-16">
        <div className="flex-1 h-[1px] bg-border-primary" />
        <span className="text-md">OR</span>
        <div className="flex-1 h-[1px] bg-border-primary" />
      </div>

      {/* 소셜 로그인 영역 */}
      <div className="w-full max-w-800 sm:px-16 flex items-center justify-between gap-16">
        <p className="text-md text-text-primary">{text}</p>
        <div className="flex items-center gap-16">
          <button
            type="button"
            onClick={onGoogle}
            className="w-48 h-48 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Google 로그인"
          >
            <SVGIcon icon="google" size={42} />
          </button>
          <button
            type="button"
            onClick={onKakao}
            className="w-48 h-48 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Kakao 로그인"
          >
            <SVGIcon icon="kakaotalk" size={42} />
          </button>
        </div>
      </div>
    </div>
  );
}
