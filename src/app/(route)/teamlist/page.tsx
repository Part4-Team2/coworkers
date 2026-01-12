import type { Metadata } from "next";
import TeamListContainer from "@/containers/teamlist/TeamListContainer";
import { getUserGroups } from "@/api/user";

export const metadata: Metadata = {
  title: "팀 목록",
  description:
    "소속된 팀 목록을 확인하고 새로운 팀을 생성하거나 참여할 수 있습니다.",
  openGraph: {
    title: "팀 목록 | Coworkers",
    description:
      "소속된 팀 목록을 확인하고 새로운 팀을 생성하거나 참여할 수 있습니다.",
  },
};

export default async function TeamListPage() {
  const groupsData = await getUserGroups();

  // 에러 처리: 에러 시 빈 배열로 처리
  const groups = "error" in groupsData ? [] : groupsData;

  return <TeamListContainer teams={groups} />;
}
