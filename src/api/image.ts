import { BASE_URL } from "@/constants/api";

export async function postImage(image: File) {
  const formData = new FormData();
  formData.append("image", image);
  const response = await fetch("/api/proxy/image/upload", {
    method: "POST",
    body: formData,
  });
  return (await response.json()) as { url: string };
}
