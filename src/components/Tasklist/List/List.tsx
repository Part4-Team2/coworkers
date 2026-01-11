"use client";

import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { Task } from "@/types/task";
import { formatDate, formatTime } from "@/utils/date";
import { getFrequencyText } from "@/utils/frequency";
import clsx from "clsx";

export interface ListProps extends Task {
  onClick?: () => void;
  isToggle?: boolean;
  onToggle?: (id: number) => void;
  onClickKebab?: (id: number) => void;
  variant?: "simple" | "detailed";
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
}: Task) {
  return (
    <div className="flex flex-col gap-10 bg-background-secondary px-14 py-12 rounded-[8px]">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-7">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(id);
            }}
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClickKebab?.(id);
          }}
          aria-label="옵션 메뉴 열기"
        >
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
