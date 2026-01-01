import ProgressCircle from "@/app/components/Team/ProgressCircle";
import StatCard from "@/app/components/Team/StatCard";

interface ReportProps {
  progressPercentage: number;
  todayTaskCount: number;
  completedTaskCount: number;
}

const validateCount = (count: number): number => Math.max(0, Math.floor(count));

export default function Report({
  progressPercentage,
  todayTaskCount,
  completedTaskCount,
}: ReportProps) {
  const validatedTodayCount = validateCount(todayTaskCount);
  const validatedCompletedCount = validateCount(completedTaskCount);
  return (
    <section className="mb-65">
      <h2 className="text-lg font-medium leading-lg text-text-primary mb-24">
        리포트
      </h2>
      <div className="flex flex-row justify-between items-center gap-19 sm:gap-24 lg:gap-58 p-24 bg-background-secondary rounded-xl">
        {/* 왼쪽: 진행률 차트 */}
        <div className="shrink-0 max-[375px]:-ml-10">
          <ProgressCircle percentage={progressPercentage} />
        </div>

        {/* 오른쪽: 통계 카드 */}
        <div className="flex flex-col gap-16 flex-1 min-w-0 max-w-400">
          <StatCard
            title="오늘의 할 일"
            count={validatedTodayCount}
            icon="imgTodo"
            unit="개"
          />
          <StatCard
            title="한 일"
            count={validatedCompletedCount}
            icon="imgDone"
            unit="개"
          />
        </div>
      </div>
    </section>
  );
}
