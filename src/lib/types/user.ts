export interface UpdateUserRequestBody {
  nickname?: string;
  image?: string | null;
}

export interface SendResetPasswordEmailRequest {
  email: string;
  redirectUrl: string;
  // "email": "example@email.com", "redirectUrl": "http://localhost:3000" }
}

export interface ResetPasswordBody {
  passwordConfirmation: string;
  password: string;
  token: string;
}

export interface UpdatePasswordBody {
  passwordConfirmation: string;
  password: string;
}
