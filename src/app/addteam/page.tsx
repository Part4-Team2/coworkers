import { Metadata } from "next";
import AddTeamContainer from "@/containers/addteam/AddTeamContainer";

export const metadata: Metadata = {
  title: "Coworkers - 팀 생성",
  description: "팀 생성 페이지",
};

export default function AddTeamPage() {
  return <AddTeamContainer />;
}
