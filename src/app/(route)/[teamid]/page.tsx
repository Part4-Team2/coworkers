import { trace } from "@opentelemetry/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import TeamIdContainer from "@/containers/teamid/TeamIdContainer";

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
  const tracer = trace.getTracer("coworkers-page");

  return await tracer.startActiveSpan("render-team-page", async (span) => {
    const startTime = performance.now();

    try {
      const { teamid: teamId } = await params;
      span.setAttribute("team.id", teamId);
      span.setAttribute("page.route", "/[teamid]");

      // teamId 유효성 검사
      if (!teamId) {
        span.setStatus({ code: 2, message: "Invalid team ID" });
        notFound();
      }

      // TODO: 실제 API 구현 시 데이터 fetching 추가
      // 예시:
      // const teamData = await tracer.startActiveSpan('fetch-team-data', async (fetchSpan) => {
      //   fetchSpan.setAttribute('fetch.url', `/api/teams/${teamId}`);
      //   const response = await fetch(`/api/teams/${teamId}`);
      //   const data = await response.json();
      //   fetchSpan.setAttribute('team.name', data.name);
      //   fetchSpan.setAttribute('team.member_count', data.members?.length || 0);
      //   fetchSpan.end();
      //   return data;
      // });

      span.setAttribute("page.rendered", true);
      span.setStatus({ code: 0 });

      const component = <TeamIdContainer teamId={teamId} />;

      // 개발 환경에서만 성능 로그 출력
      if (process.env.NODE_ENV === "development") {
        const duration = Math.round(performance.now() - startTime);
        console.log(`[OpenTelemetry] render-team-page:`, {
          teamId,
          route: "/[teamid]",
          duration: `${duration}ms`,
          status: "success",
        });
      }

      return component;
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);

      span.recordException(error as Error);
      span.setStatus({ code: 2, message: "Page render failed" });

      // 개발 환경에서만 에러 로그 출력
      if (process.env.NODE_ENV === "development") {
        console.error(`[OpenTelemetry] render-team-page failed:`, {
          duration: `${duration}ms`,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      throw error;
    } finally {
      span.end();
    }
  });
}
