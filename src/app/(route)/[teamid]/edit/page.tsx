import { notFound } from "next/navigation";
import { Metadata } from "next";
import EditTeamContainer from "@/containers/editteam/EditTeamContainer";
import { getGroup } from "@/lib/api/group";

interface PageProps {
  params: Promise<{ teamid: string }>;
}

interface TeamData {
  teamName: string;
  profileImage?: string;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { teamid } = await params;

  try {
    const teamData = await getTeamData(teamid);

    return {
      title: `${teamData.teamName} 팀 수정`,
      description: `${teamData.teamName} 팀의 정보를 수정합니다.`,
    };
  } catch {
    return {
      title: "팀 수정",
      description: "팀 정보를 수정합니다.",
    };
  }
}

async function getTeamData(teamId: string): Promise<TeamData> {
  // teamId 유효성 검증
  if (!teamId || teamId.trim() === "") {
    notFound();
  }

  try {
    const result = await getGroup(teamId);

    if (!result.success) {
      console.error("Failed to fetch team data:", result.error);
      // API 에러 - 팀을 찾을 수 없음
      notFound();
    }

    // 데이터 검증
    if (!result.data || typeof result.data.name !== "string") {
      console.error("Invalid team data structure");
      notFound();
    }

    // 이미지가 없거나 example.com인 경우 undefined 처리 (기본 이미지 사용)
    const image = result.data.image;
    const isValidImage =
      image && image.trim() !== "" && !image.startsWith("https://example.com");

    return {
      teamName: result.data.name,
      profileImage: isValidImage ? image : undefined,
    };
  } catch (error) {
    // 예상치 못한 에러 (네트워크 에러 등)
    console.error("Unexpected error while fetching team data:", error);
    notFound();
  }
}

export default async function EditTeamPage({ params }: PageProps) {
  const { teamid } = await params;
  const teamData = await getTeamData(teamid);

  return <EditTeamContainer teamId={teamid} initialData={teamData} />;
}
