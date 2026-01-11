import { Metadata } from "next";
import { notFound } from "next/navigation";
import TeamIdContainer from "@/containers/teamid/TeamIdContainer";
import { measureSSR } from "@/utils/measure";
import { getUserMemberships } from "@/api/user";
import { getGroup } from "@/api/group";

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

export default async function TeamPage({ params }: Props) {
  return await measureSSR({
    name: "render-team-page",
    fn: async () => {
      const { teamid: teamId } = await params;

      // teamId 유효성 검사
      if (!teamId) {
        notFound();
      }

      // 그룹 정보 조회
      const groupData = await getGroup(teamId);

      if ("error" in groupData) {
        console.error("Failed to fetch group:", groupData.message);
        notFound();
      }

      // 사용자 멤버십 정보 조회하여 role 확인
      const memberships = await getUserMemberships();
      let userRole: "ADMIN" | "MEMBER" = "MEMBER";

      if ("error" in memberships) {
        console.error("Failed to fetch memberships:", memberships.message);
        // 에러 시 기본값 MEMBER 유지
      } else {
        // 현재 groupId에 해당하는 멤버십 찾기
        const currentMembership = memberships.find(
          (membership) => membership.groupId === Number(teamId)
        );
        userRole = currentMembership?.role || "MEMBER";
      }

      return (
        <TeamIdContainer
          teamId={teamId}
          userRole={userRole}
          teamName={groupData.name}
          members={groupData.members}
          taskLists={groupData.taskLists}
        />
      );
    },
    attr: { "page.route": "/[teamid]" },
  });
}
