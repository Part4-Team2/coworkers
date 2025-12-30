"use client";

import SVGIcon from "@/app/components/SVGIcon/SVGIcon";
import clsx from "clsx";

// api response 확인 이후 타입이 변경될 수 있습니다.
interface ListProps {
  id: string;
  isToggle?: boolean;
  onToggle: (id: string) => void;
  content: string;
  onClickKebab: (id: string) => void;
  variant: "simple" | "detailed";
  // Metadata (tasklist 페이지용)
  commentCount?: number;
  frequency?: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  date?: string; // 시간 포함
}

export default function List({
  id, // 부모에서 사용
  isToggle = false,
  onToggle,
  content,
  onClickKebab,
  variant,
  commentCount,
  frequency,
  date,
}: ListProps) {
  const formatDate = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Seoul",
    });
  };

  const formatTime = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Seoul",
    });
  };

  const getFrequencyText = (freq?: string) => {
    const frequencyMap = {
      ONCE: "한 번만",
      DAILY: "매일 반복",
      WEEKLY: "매주 반복",
      MONTHLY: "매월 반복",
    };
    return frequencyMap[freq as keyof typeof frequencyMap] ?? "-";
  };

  return (
    <div className="flex flex-col gap-10 bg-background-secondary px-14 py-12 rounded-[8px]">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-7">
          <button
            onClick={() => onToggle(id)}
            aria-label={isToggle ? "완료 취소" : "완료 표시"}
          >
            <SVGIcon icon={isToggle ? "checkboxActive" : "checkboxDefault"} />
          </button>
          <span
            className={clsx(
              "text-text-primary text-md font-regular",
              isToggle && "line-through"
            )}
          >
            {content}
          </span>

          {variant === "detailed" && (
            <div className="flex items-center gap-2 text-text-default text-xs font-regular">
              <SVGIcon icon="comment" size="xxs" />
              <span>{commentCount ?? 0}</span>
            </div>
          )}
        </div>
        <button onClick={() => onClickKebab(id)} aria-label="옵션 메뉴 열기">
          <SVGIcon icon="kebabSmall" />
        </button>
      </div>

      {variant === "detailed" && (
        <div className="flex items-center gap-10 text-text-default text-xs font-regular">
          <div className="flex items-center gap-6">
            <SVGIcon icon="calendar" size="xxs" />
            <span>{date ? formatDate(date) : "-"}</span>
          </div>
          <div className="w-px h-8 bg-background-tertiary" />
          <div className="flex items-center gap-6">
            <SVGIcon icon="iconTime" size="xxs" />
            <span>{date ? formatTime(date) : "-"}</span>
          </div>
          <div className="w-px h-8 bg-background-tertiary " />
          <div className="flex items-center gap-6">
            <SVGIcon icon="iconRepeat" size="xxs" />
            <span>{getFrequencyText(frequency)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
