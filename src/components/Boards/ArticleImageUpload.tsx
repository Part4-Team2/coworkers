"use client";

import clsx from "clsx";
import Image from "next/image";
import SVGIcon from "../Common/SVGIcon/SVGIcon";
import { useState, useRef } from "react";

interface ArticleImageProps {
  image?: string | null;
  onChange: (file: File | null) => void;
}

// 게시글 이미지 입로드 할 수 있는 컴포넌트입니다.
function ArticleImageUpload({ image = null, onChange }: ArticleImageProps) {
  const [preview, setPreview] = useState<string | null>(image);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    if (!preview) {
      inputRef.current?.click();
    }
  };

  // 이미지를 선택을 반영하는 함수입니다.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  // 선택한 이미지를 삭제하는 함수입니다.
  const deleteImage = () => {
    onChange(null);
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={handleImageClick}
      className={clsx(
        "w-160 h-160 sm:w-282 sm:h-282 bg-background-secondary",
        "border border-border-primary hover:border-brand-primary",
        "rounded-xl cursor-pointer relative",
        "overflow-hidden",
        "flex items-center justify-center"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {preview ? (
        <>
          <Image src={preview} alt="preview image" fill />
          <div
            className={clsx(
              "flex flex-col gap-12 items-center",
              "absolute top-60 right-40 sm:top-110 sm:right-100"
            )}
            onClick={deleteImage}
          >
            <SVGIcon icon="x" size="md" />
            <div className="text-gray-400 text-base">이미지 삭제</div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-12 items-center">
          <SVGIcon icon="plus" size="md" />
          <div className="text-gray-400 text-base">이미지 등록</div>
        </div>
      )}
    </div>
  );
}

export default ArticleImageUpload;
