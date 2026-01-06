import { BASE_URL } from "@/constants/api";
import { Role } from "@/types/schemas";
import {
  UpdateUserRequestBody,
  SendResetPasswordEmailRequest,
  ResetPasswordBody,
  UpdatePasswordBody,
} from "@/types/api/user";

export async function getUser() {
  const response = await fetch("/api/proxy/user");

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "사용자 정보를 가져오는데 실패했습니다.",
    }));
    return {
      error: true,
      message: error.message || "사용자 정보를 가져오는데 실패했습니다.",
    };
  }

  return (await response.json()) as {
    teamId: string;
    image: string | null;
    nickname: string;
    updatedAt: string;
    createdAt: string;
    id: number;
    memberships: Array<{
      group: {
        teamId: string;
        updatedAt: string;
        createdAt: string;
        image: string | null;
        name: string;
        id: number;
      };
      role: Role;
      userImage: string | null;
      userEmail: string;
      userName: string;
      groupId: number;
      userId: number;
    }>;
  };
}

export async function patchUser(data: UpdateUserRequestBody) {
  const response = await fetch("/api/proxy/user", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (await response.json()) as { message: string };
}

export async function deleteUser() {
  const response = await fetch("/api/proxy/user", {
    method: "DELETE",
  });
  return await response.json(); // no content
}

/*
GET /{teamId}/user/groups
GET /{teamId}/user/memberships
GET /{teamId}/user/history
추가해 주시면 됩니다!
*/

/*
비밀번호 재설정 이메일 전송

{redirectUrl}/reset-password?token=${token}로 이동할 수 있는 링크를 이메일로 전송합니다. 
e.g. "https://coworkers.vercel.app/reset-password?token=1234567890"
*/
export async function postUserResetPassword(
  data: SendResetPasswordEmailRequest
) {
  const response = await fetch("/api/proxy/user/send-reset-password-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (await response.json()) as { message: string };
}

/*
이메일로 전달받은 링크에서 비밀번호 초기화

POST user/send-reset-password-email 요청으로 발송한 메일의 링크에 담긴 토큰을 사용해야 합니다.
*/
export async function patchUserResetPassword(data: ResetPasswordBody) {
  const response = await fetch("/api/proxy/user/reset-password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (await response.json()) as { message: string };
}

export async function patchUserPassword(data: UpdatePasswordBody) {
  const response = await fetch("/api/proxy/user/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (await response.json()) as { message: string };
}
