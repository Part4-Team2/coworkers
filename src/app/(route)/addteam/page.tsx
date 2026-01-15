import { createMetadata } from "@/components/Common/Metadata/Metadata";
import AddTeamContainer from "@/containers/addteam/AddTeamContainer";

export const metadata = createMetadata({
  title: "팀 생성하기",
  description: "새로운 팀을 생성하고 팀원들과 협업을 시작하세요.",
  url: "/addteam",
  alt: "Coworkers - 팀 생성",
});

export default async function AddTeamPage() {
  return <AddTeamContainer />;
}
