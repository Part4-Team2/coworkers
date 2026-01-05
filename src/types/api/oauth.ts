export enum OauthProvider {
  GOOGLE = "GOOGLE",
  KAKAO = "KAKAO",
}

export interface UpsertOauthAppRequestBody {
  appSecret?: string | null;
  /*
  간편 로그인을 위한 비밀 키 입니다.

Google 의 경우에는 필요하지 않습니다.
Kakao 의 경우에는 필요하지 않습니다.
*/
  appKey: string;
  /*
  간편 로그인을 위한 인증 키 입니다.

Google 의 경우에는 "클라이언트 id" 입니다.
Kakao 의 경우에는 "REST API 키" 입니다.
실습을 위해 발급받은 키를 등록해주세요. 실제 서비스에서 사용 하는 키는 등록하시면 안됩니다.
*/
  provider: OauthProvider;
}

export interface OauthApp {
  createdAt: string;
  updatedAt: string;
  appSecret: string | null;
  appKey: string;
  provider: OauthProvider;
  teamId: string;
  id: number;
}
