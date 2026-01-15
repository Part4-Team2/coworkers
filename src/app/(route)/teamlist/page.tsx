import { createMetadata } from "@/components/Common/Metadata/Metadata";
import TeamListContainer from "@/containers/teamlist/TeamListContainer";
import { getUserGroups } from "@/lib/api/user";

export const metadata = createMetadata({
  title: "팀 목록",
  description:
    "소속된 팀 목록을 확인하고 새로운 팀을 생성하거나 참여할 수 있습니다.",
  url: "/teamlist",
  alt: "Coworkers - 팀 목록",
});

export default async function TeamListPage() {
  const groupsData = await getUserGroups();

  // 에러 처리: 에러 시 빈 배열로 처리
  const groups = "error" in groupsData ? [] : groupsData;

  return <TeamListContainer teams={groups} />;
}
