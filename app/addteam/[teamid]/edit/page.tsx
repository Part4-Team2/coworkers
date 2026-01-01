import { notFound } from "next/navigation";
import EditTeamContainer from "@/containers/teamid-edit/EditTeamContainer";

interface PageProps {
  params: Promise<{ teamid: string }>;
}

interface TeamData {
  teamName: string;
  profileImage?: string;
}

async function getTeamData(teamId: string): Promise<TeamData> {
  // teamId 유효성 검증
  if (!teamId || typeof teamId !== "string" || teamId.trim() === "") {
    notFound();
  }

  try {
    // TODO: 실제 API 호출로 팀 데이터 가져오기
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}`,
    //   {
    //     cache: "no-store", // 항상 최신 데이터
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    //
    // if (!response.ok) {
    //   if (response.status === 404) {
    //     notFound();
    //   }
    //   throw new Error(`Failed to fetch team data: ${response.status}`);
    // }
    //
    // const data = await response.json();
    //
    // // 데이터 검증
    // if (!data || typeof data.teamName !== "string") {
    //   throw new Error("Invalid team data");
    // }
    //
    // return data;

    // 임시 데이터 반환 (개발용)
    return {
      teamName: "기존 팀 이름",
      profileImage: undefined,
    };
  } catch (error) {
    console.error("Failed to fetch team data:", error);
    throw error;
  }
}

export default async function EditTeamPage({ params }: PageProps) {
  const { teamid } = await params;
  const teamData = await getTeamData(teamid);

  return <EditTeamContainer teamId={teamid} initialData={teamData} />;
}
