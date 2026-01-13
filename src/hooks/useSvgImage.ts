import { useState, useEffect, useRef } from "react";

interface UseSvgImageReturn {
  processedUrl: string | null;
  isLoading: boolean;
  error: boolean;
  isSvg: boolean;
}

export function useSvgImage(imageUrl?: string): UseSvgImageReturn {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const isSvg = imageUrl?.endsWith(".svg") ?? false;
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // imageUrl이 없거나 유효하지 않으면 null 반환
    if (
      !imageUrl ||
      imageUrl.trim() === "" ||
      imageUrl.startsWith("https://example.com")
    ) {
      setProcessedUrl(null);
      setIsLoading(false);
      return;
    }

    if (!imageUrl.endsWith(".svg")) {
      setProcessedUrl(imageUrl);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(false);

    const fetchSvg = async () => {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error("SVG 로드 실패");
        }

        const svgText = await response.text();
        const blob = new Blob([svgText], { type: "image/svg+xml" });

        // 이전 blob URL 정리
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
        }

        const blobUrl = URL.createObjectURL(blob);
        blobUrlRef.current = blobUrl;

        if (isMounted) {
          setProcessedUrl(blobUrl);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("SVG fetch 실패:", err);
        if (isMounted) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    fetchSvg();

    return () => {
      isMounted = false;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [imageUrl]);

  return { processedUrl, isLoading, error, isSvg };
}
