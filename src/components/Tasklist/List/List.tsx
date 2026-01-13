"use client";

import Dropdown from "@/components/Common/Dropdown/Dropdown";
import { Modal } from "@/components/Common/Modal";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import useKebabMenu from "@/hooks/useKebabMenu";
import { TaskListItem } from "@/lib/types/taskTest";
import { formatDate, formatTime } from "@/utils/date";
import { getFrequencyText } from "@/utils/frequency";
import clsx from "clsx";

export interface ListProps extends TaskListItem {
  onClick?: () => void;
  isToggle?: boolean;
  onToggle?: (id: number) => void;
  variant?: "simple" | "detailed";
  onUpdateTask?: (taskId: number, updates: Partial<TaskListItem>) => void;
  onDeleteTask?: (task: { id: number; recurringId: number }) => void;
}

export default function List({
  id,
  isToggle = false,
  onToggle,
  name,
  variant,
  commentCount,
  frequency,
  date,
  onClick,
  onUpdateTask,
  onDeleteTask,
  recurringId,
}: ListProps) {
  // useKebabMenu 훅은 여기서 각 task 별로 사용
  const kebab = useKebabMenu({
    initialContent: name,
    onSave: (newContent) => onUpdateTask?.(id, { name: newContent }),
    onDelete: () => onDeleteTask?.({ id, recurringId }),
    deleteModalTitle: (
      <>
        &apos;{name}&apos; <br />할 일을 정말 삭제하시겠어요?
      </>
    ),
  });

  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-10 bg-background-secondary px-14 py-12 rounded-[8px] cursor-pointer"
    >
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
            {name}
          </span>

          {variant === "detailed" && (
            <div className="flex items-center gap-2 text-text-default text-xs font-regular">
              <SVGIcon icon="comment" size="xxs" />
              <span>{commentCount ?? 0}</span>
            </div>
          )}
        </div>
        <div
          className="relative"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Dropdown
            options={kebab.dropdownOptions}
            size="md"
            trigger="icon"
            icon="kebabLarge"
            listPosition="absolute right-0 top-full mt-5"
            onSelect={kebab.handleDropdownSelect}
          />
        </div>
        <Modal
          isOpen={kebab.isModalOpen}
          onClose={kebab.handleModalClose}
          title={kebab.deleteModalTitle}
          description={kebab.deleteModalDescription}
          primaryButton={{
            label: "삭제하기",
            onClick: kebab.handleDeleteConfirm,
            variant: "danger",
          }}
          secondaryButton={{
            label: "닫기",
            onClick: kebab.handleModalClose,
          }}
        />
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
