import { Metadata } from "next";
import JoinTeamContainer from "@/containers/jointeam/JoinTeamContainer";

export const metadata: Metadata = {
  title: "Coworkers - 팀 참여",
  description: "팀 참여 페이지",
};

export default function JoinTeamPage() {
  return <JoinTeamContainer />;
}
