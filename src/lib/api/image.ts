"use server";

import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";
import { ApiResult } from "@/lib/types/api";

interface ImageUploadResponse {
  url: string;
}

export async function postImage(
  image: File
): Promise<ApiResult<ImageUploadResponse>> {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetchApi(`${BASE_URL}/images/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "이미지 업로드에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "이미지 업로드에 실패했습니다.",
      };
    }

    const data = (await response.json()) as ImageUploadResponse;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}
