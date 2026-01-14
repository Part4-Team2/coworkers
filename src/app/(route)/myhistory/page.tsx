import { measureSSR } from "@/utils/measure";
import { getUserHistory } from "@/lib/api/user";
import DoneListContainer from "@/containers/myhistory/DoneListContainer";

export default async function MyHistoryPage() {
  // getUserHistory가 이미 캐싱되므로 중복 측정 불필요
  const getUserHistoryWithMeasure = measureSSR({
    name: "getUserHistory",
    fn: () => getUserHistory(),
  });

  const historyData = await getUserHistoryWithMeasure();

  return (
    <div className="w-full min-h-screen bg-background-primary">
      <div className="pt-24 lg:pt-40">
        <div className="max-w-1200 mx-auto px-16 sm:px-24 lg:px-24">
          <h1 className="text-xl font-bold leading-xl text-text-primary mb-24">
            마이 히스토리
          </h1>

          <DoneListContainer initialData={historyData} />
        </div>
      </div>
    </div>
  );
}
