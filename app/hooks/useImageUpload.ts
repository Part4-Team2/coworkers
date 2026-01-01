import { useRef, useState, ChangeEvent, useEffect } from "react";

interface UseImageUploadReturn {
  previewUrl: string | undefined;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageClick: () => void;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  resetImage: () => void;
}

export function useImageUpload(initialImageUrl?: string): UseImageUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousBlobUrlRef = useRef<string | null>(null);

  // initialImageUrl이 변경되면 자동으로 업데이트
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    () => initialImageUrl
  );

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 파일 타입 검증 (image/png, image/jpeg, image/jpg, image/gif 등 모든 이미지 타입)
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("이미지 크기는 10MB 이하여야 합니다.");
      return;
    }

    // 기존 생성한 blob URL 메모리 해제
    if (previousBlobUrlRef.current) {
      URL.revokeObjectURL(previousBlobUrlRef.current);
    }

    // 새 미리보기 URL 생성
    const objectUrl = URL.createObjectURL(file);
    previousBlobUrlRef.current = objectUrl;

    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  };

  const resetImage = () => {
    // 생성한 blob URL 메모리 해제
    if (previousBlobUrlRef.current) {
      URL.revokeObjectURL(previousBlobUrlRef.current);
      previousBlobUrlRef.current = null;
    }

    setPreviewUrl(initialImageUrl);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // cleanup: 컴포넌트 언마운트 시 메모리 해제
  useEffect(() => {
    return () => {
      if (previousBlobUrlRef.current) {
        URL.revokeObjectURL(previousBlobUrlRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    selectedFile,
    resetImage,
  };
}
