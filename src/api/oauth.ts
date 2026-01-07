import { BASE_URL } from "@/constants/api";
import { UpsertOauthAppRequestBody, OauthApp } from "@/types/api/oauth";
/*
간편 로그인 App 등록/수정
Google, Kakao 간편 로그인을 위한 App 을 등록하거나 수정합니다.
이미 등록된 앱이 있을 경우 덮어씌워집니다.

Google
appKey: "클라이언트 id"
appSecret: 필요하지 않음
Kakao
appKey: "REST API 키"
appSecret: 필요하지 않음
실습을 위해 발급받은 키를 등록해주세요. 실제 서비스에서 사용 하는 키를 등록해서는 안됩니다.
*/
export async function postOauthApps(data: UpsertOauthAppRequestBody) {
  const response = await fetch("/api/proxy/oauth/apps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (await response.json()) as OauthApp;
}
