"use server";

import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";

export async function postImage(image: File) {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetchApi(`${BASE_URL}/images/upload`, {
      method: "POST",
      body: formData,
      // POST 요청은 캐싱하지 않음 (이미지 업로드는 상태 변경 작업)
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.message || "이미지 업로드에 실패했습니다.",
      };
    }

    return (await response.json()) as { url: string };
  } catch (error) {
    return {
      error: true,
      message: "서버 오류가 발생했습니다.",
    };
  }
}
