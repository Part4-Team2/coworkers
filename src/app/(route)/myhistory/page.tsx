import { createMetadata } from "@/components/Common/Metadata/Metadata";
import { measureSSR } from "@/utils/measure";
import { getUserHistory } from "@/lib/api/user";
import DoneListContainer from "@/containers/myhistory/DoneListContainer";

export const metadata = createMetadata({
  title: "마이 히스토리",
  description:
    "완료한 할 일 목록을 날짜별로 확인하세요. 나의 작업 히스토리를 한눈에 볼 수 있습니다.",
  url: "/myhistory",
  alt: "Coworkers - 마이 히스토리",
});

export default async function MyHistoryPage() {
  // getUserHistory가 이미 캐싱되므로 중복 측정 불필요
  const getUserHistoryWithMeasure = measureSSR({
    name: "getUserHistory",
    fn: () => getUserHistory(),
  });

  const historyData = await getUserHistoryWithMeasure();

  return (
    <div className="w-full bg-background-primary min-h-[calc(100vh-var(--app-header-height))]">
      <div className="pt-24 lg:pt-40 pb-40">
        <div className="max-w-1200 mx-auto px-16 sm:px-24 lg:px-24">
          <h1 className="text-xl font-bold leading-xl text-text-primary mb-24">
            마이 히스토리
          </h1>

          <DoneListContainer
            initialData={historyData.data ?? { tasksDone: [] }}
          />
        </div>
      </div>
    </div>
  );
}
