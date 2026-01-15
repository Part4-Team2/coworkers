import { Metadata } from "next";
import { notFound } from "next/navigation";
import TeamIdContainer from "@/containers/teamid/TeamIdContainer";
import { measureSSR } from "@/utils/measure";
import { getGroup } from "@/lib/api/group";

type Props = {
  params: Promise<{ teamid: string }>;
};

// 동적 메타데이터는 generateMetadata 함수로 생성
// params를 통해 동적 경로 매개변수 접근 가능
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamid: teamId } = await params;

  // teamId 유효성 검사
  if (!teamId) {
    notFound();
  }

  // API에서 팀 정보 가져오기
  const groupData = await getGroup(teamId);
  const teamName = groupData.success ? groupData.data.name : "팀";

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

export default async function TeamPage({ params }: Props) {
  const { teamid: teamId } = await params;

  // teamId 유효성 검사
  if (!teamId) {
    notFound();
  }

  // getGroup만 호출 (members, taskLists 필요)
  const getGroupWithMeasure = measureSSR({
    name: "getGroup",
    fn: () => getGroup(teamId),
    attr: { "team.id": teamId },
  });

  const groupData = await getGroupWithMeasure();

  // 에러 처리
  if (!groupData.success) {
    notFound();
  }

  return (
    <TeamIdContainer
      teamId={teamId}
      teamName={groupData.data.name}
      members={groupData.data.members}
      taskLists={groupData.data.taskLists}
    />
  );
}
