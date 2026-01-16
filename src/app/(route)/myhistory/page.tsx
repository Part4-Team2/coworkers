import { createMetadata } from "@/components/Common/Metadata/Metadata";
import { cookies } from "next/headers";
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
  // "캐싱 함수" 외부에서 accessToken 읽기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  // getUserHistory가 이미 캐싱되므로 중복 측정 불필요
  const getUserHistoryWithMeasure = measureSSR({
    name: "getUserHistory",
    fn: () => getUserHistory(accessToken),
  });

  const {
    result: historyData,
    duration,
    isCacheHit,
  } = await getUserHistoryWithMeasure();

  // 캐시 상태 로깅
  console.log(
    `[getUserHistory] ${isCacheHit ? "CACHE HIT" : "CACHE MISS"} (${duration.toFixed(2)}ms)`
  );

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
