import { BASE_URL } from "@/constants/api";

export async function postImage(image: File) {
  const response = await fetch(`${BASE_URL}/image/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: image,
  });
  return (await response.json()) as { url: string };
}
