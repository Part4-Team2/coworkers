import { createMetadata } from "@/components/Common/Metadata/Metadata";
import JoinTeamContainer from "@/containers/jointeam/JoinTeamContainer";

export const metadata = createMetadata({
  title: "팀 참여하기",
  description: "팀 초대 링크를 입력하고 팀원들과 협업을 시작하세요.",
  url: "/jointeam",
  alt: "Coworkers - 팀 참여",
});

export default function JoinTeamPage() {
  return <JoinTeamContainer />;
}
