import { memo } from "react";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";

interface TodoItemProps {
  name: string;
  completedCount: number;
  totalCount: number;
  color: string;
  onMenuClick?: () => void;
}

const PROGRESS_CIRCLE_SIZE = 14;
const PROGRESS_CIRCLE_STROKE_WIDTH = 2.5;
const FALLBACK_COLOR = "#6B7280";

const SmallProgressCircle = ({ percentage }: { percentage: number }) => {
  const size = PROGRESS_CIRCLE_SIZE;
  const strokeWidth = PROGRESS_CIRCLE_STROKE_WIDTH;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="stroke-slate-600"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="stroke-brand-primary"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
};

const TodoItem = memo(function TodoItem({
  name,
  completedCount,
  totalCount,
  color,
  onMenuClick,
}: TodoItemProps) {
  const isCompleted = completedCount === totalCount;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div
      className="flex items-center h-40 rounded-xl bg-background-secondary overflow-hidden"
      role="listitem"
    >
      <div
        className="w-12 h-full shrink-0"
        style={{ backgroundColor: color || FALLBACK_COLOR }}
      />

      <div className="flex items-center justify-between flex-1 pl-16 pr-8">
        <span className="text-md font-medium leading-md text-text-primary truncate">
          {name}
        </span>

        <div className="flex items-center gap-12 shrink-0">
          {/* 진행률 */}
          <div
            className="flex items-center gap-6 px-8 py-4 rounded-xl bg-background-primary"
            aria-label={`진행률 ${completedCount}/${totalCount}`}
          >
            {isCompleted ? (
              <SVGIcon
                icon="done"
                size={14}
                className="text-brand-primary transition-all duration-300"
              />
            ) : (
              <SmallProgressCircle percentage={percentage} />
            )}
            <span className="text-md font-regular leading-md text-brand-primary">
              {completedCount}/{totalCount}
            </span>
          </div>

          {/* 케밥 메뉴 */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex items-center justify-center cursor-pointer"
            aria-label="할 일 메뉴"
          >
            <SVGIcon icon="kebabSmall" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default TodoItem;
