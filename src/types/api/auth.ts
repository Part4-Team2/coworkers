export interface SignUpRequestBody {
  image?: string | null;
  passwordConfirmation: string;
  password: string;
  nickname: string;
  email: string;
}

export interface SignUpResponse {
  refreshToken: string;
  accessToken: string;
  user: {
    teamId: string;
    image: string | null;
    updatedAt: string;
    createdAt: string;
    nickname: string;
    id: number;
    email: string;
  };
}

export interface SignInRequestBody {
  email: string;
  password: string;
}

export interface SignInResponse {
  refreshToken: string;
  accessToken: string;
  user: {
    teamId: string;
    image: string | null;
    updatedAt: string;
    createdAt: string;
    nickname: string;
    id: number;
    email: string;
  };
}

export interface SignInWithOauthRequestBody {
  state?: string;
  // code를 얻을 때 사용하였던 state 값을 그대로 사용합니다.
  redirectUri?: string;
  // example: http://localhost:3000/oauth/kakao
  // Kakao 의 경우에는 필수입니다.
  // 인가 코드를 얻을 때 사용하였던 redirect_uri 값을 그대로 사용합니다.
  token: string;
}
