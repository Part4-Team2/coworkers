import type { Metadata } from "next";
import TeamListContainer from "@/containers/teamlist/TeamListContainer";

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

export default function TeamListPage() {
  return <TeamListContainer />;
}
