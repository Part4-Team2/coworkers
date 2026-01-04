import { Metadata } from "next";
import TeamIdContainer from "@/containers/teamid/TeamIdContainer";

type Props = {
  params: Promise<{ teamid: string }>;
};

// 동적 메타데이터는 generateMetadata 함수로 생성
// params를 통해 동적 경로 매개변수 접근 가능
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamid: teamId } = await params;

  // TODO: 실제로는 API에서 팀 정보를 가져와야 함
  const teamName = "경영관리팀";

  return {
    title: teamName, // "경영관리팀 | Coworkers"
    description: `${teamName}의 할 일 목록, 멤버 관리, 프로젝트 진행 상황을 확인하세요.`,
    openGraph: {
      title: `${teamName}`, // siteName이 자동으로 추가됨
      description: `${teamName}의 할 일 목록, 멤버 관리, 프로젝트 진행 상황을 확인하세요.`,
      url: `/${teamId}`, // 폴더 구조 변경시 수정 필요
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: teamName,
        },
      ],
    },
  };
}

export default function TeamPage() {
  return <TeamIdContainer />;
}
