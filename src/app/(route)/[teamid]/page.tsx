import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import TeamIdContainer from "@/containers/teamid/TeamIdContainer";
import { measureSSR } from "@/utils/measure";
import { getGroup } from "@/lib/api/group-queries";
import { getUser } from "@/lib/api/user";

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

  // 1. 인증 체크 (매번 실행, 캐싱 안됨)
  const user = await getUser();
  if ("error" in user) {
    notFound();
  }

  // 2. accessToken 읽기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  // 3. 캐싱된 데이터 조회 (userId 포함)
  const groupData = await getGroup(teamId, user.id.toString(), accessToken);
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

  // 1. 인증 체크 (매번 실행, 캐싱 안됨)
  const user = await getUser();
  if ("error" in user) {
    notFound();
  }

  // 2. accessToken 읽기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  // 3. 캐싱된 데이터 조회 (userId 포함)
  const getGroupWithMeasure = measureSSR({
    name: "getGroup",
    fn: () => getGroup(teamId, user.id.toString(), accessToken),
    attr: { "team.id": teamId, "user.id": user.id.toString() },
  });

  const { result: groupData } = await getGroupWithMeasure();

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
