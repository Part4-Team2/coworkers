import { notFound } from "next/navigation";
import { Metadata } from "next";
import EditTeamContainer from "@/containers/editteam/EditTeamContainer";

interface PageProps {
  params: Promise<{ teamid: string }>;
}

export const metadata: Metadata = {
  title: "팀 수정",
  description: "팀 정보를 수정합니다.",
};

export default async function EditTeamPage({ params }: PageProps) {
  const { teamid } = await params;

  // teamId 유효성 검증
  if (!teamid || teamid.trim() === "") {
    notFound();
  }

  return <EditTeamContainer teamId={teamid} />;
}
