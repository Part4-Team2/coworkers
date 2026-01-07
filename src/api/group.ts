import { BASE_URL } from "@/constants/api";
import { CreateGroupBody } from "@/types/api/group";

/*
GET /{teamId}/groups/{id}
PATCH /{teamId}/groups/{id}
DELETE /{teamId}/groups/{id}
추가해 주시면 됩니다!
*/

export async function postGroup(data: CreateGroupBody) {
  const response = await fetch("/api/proxy/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      error: true,
      message: error.message || "팀 생성에 실패했습니다.",
    };
  }

  return (await response.json()) as {
    name: string;
    image: string | null;
    updatedAt: string;
    createdAt: string;
    id: number;
  };
}

/*
GET /{teamId}/groups/{id}/member/{memberUserId}
DELETE /{teamId}/groups/{id}/member/{memberUserId}
GET /{teamId}/groups/{id}/invitation
추가해 주시면 됩니다!
*/

/* 
GET {id}/invitation으로 생성한 토큰으로, 초대를 수락하는 엔드포인트 
token은 초대 링크에 포함되어있는 토큰, userEmail은 초대를 수락하는 유저의 이메일
*/
export async function postGroupAcceptInvitation(data: {
  userEmail: string;
  token: string;
}) {
  const response = await fetch("/api/proxy/groups/accept-invitation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (await response.json()) as { groupId: number };
}

/* 초대 링크없이 그룹에 유저를 추가하는 엔드포인트 */
export async function postGroupMember(
  groupId: number,
  data: { userEmail: string }
) {
  const response = await fetch(`/api/proxy/groups/${groupId}/member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json(); // no content
}

/*
GET /{teamId}/groups/{id}/tasks
추가해 주시면 됩니다!
*/
