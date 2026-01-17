import { createMetadata } from "@/components/Common/Metadata/Metadata";
import { cookies } from "next/headers";
import TeamListContainer from "@/containers/teamlist/TeamListContainer";
import { getUserGroups } from "@/lib/api/user-queries";
import { getUser } from "@/lib/api/user";
import { measureSSR } from "@/utils/measure";

export const metadata = createMetadata({
  title: "팀 목록",
  description:
    "소속된 팀 목록을 확인하고 새로운 팀을 생성하거나 참여할 수 있습니다.",
  url: "/teamlist",
  alt: "Coworkers - 팀 목록",
});

export default async function TeamListPage() {
  // 1. 인증 체크 (매번 실행, 캐싱 안됨)
  const user = await getUser();
  if ("error" in user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary">
        <p className="text-text-primary text-lg font-medium mb-16">
          로그인이 필요합니다.
        </p>
      </div>
    );
  }

  // 2. accessToken 읽기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  // 3. 캐싱된 데이터 조회 (userId 포함)
  const getUserGroupsWithMeasure = measureSSR({
    name: "getUserGroups",
    fn: () => getUserGroups(user.id.toString(), accessToken),
    attr: { "user.id": user.id.toString() },
  });

  const { result: groupsData } = await getUserGroupsWithMeasure();

  // 에러 처리
  if ("error" in groupsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary">
        <p className="text-text-primary text-lg font-medium mb-16">
          팀 목록을 불러올 수 없습니다.
        </p>
        <p className="text-text-secondary text-md">
          잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  // 데이터 가공
  const teams = groupsData.map((group) => ({
    id: group.id,
    name: group.name,
    image: group.image,
  }));

  return <TeamListContainer teams={teams} />;
}
