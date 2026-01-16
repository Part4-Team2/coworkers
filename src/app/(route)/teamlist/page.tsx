import { createMetadata } from "@/components/Common/Metadata/Metadata";
import { cookies } from "next/headers";
import TeamListContainer from "@/containers/teamlist/TeamListContainer";
import { getUserGroups } from "@/lib/api/user";
import { measureSSR } from "@/utils/measure";

export const metadata = createMetadata({
  title: "팀 목록",
  description:
    "소속된 팀 목록을 확인하고 새로운 팀을 생성하거나 참여할 수 있습니다.",
  url: "/teamlist",
  alt: "Coworkers - 팀 목록",
});

export default async function TeamListPage() {
  // "캐싱 함수" 외부에서 accessToken 읽기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  // getUserGroups API 호출 (캐싱 + 성능 모니터링)
  const getUserGroupsWithMeasure = measureSSR({
    name: "getUserGroups",
    fn: () => getUserGroups(accessToken),
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
