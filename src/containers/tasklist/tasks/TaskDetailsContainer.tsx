"use client";

import Avatar from "@/components/Common/Avatar/Avatar";
import Button from "@/components/Common/Button/Button";
import ButtonFloating from "@/components/Common/Button/ButtonFloating";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import { Modal } from "@/components/Common/Modal";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import InputReply from "@/components/Tasklist/InputReply";
import Reply from "@/components/Tasklist/Reply";
import useKebabMenu from "@/hooks/useKebabMenu";
import { Task } from "@/types/task";
import { formatDate, formatTime } from "@/utils/date";
import { getFrequencyText } from "@/utils/frequency";
import clsx from "clsx";
import { useState } from "react";

type TaskDetailsContainerProps = {
  task: Task;
};

export default function TaskDetailsContainer({
  task,
}: TaskDetailsContainerProps) {
  const [isComplete, setIsComplete] = useState(task.isToggle);

  const kebab = useKebabMenu({
    initialContent: task.description || "", // 실제 api 이후엔 || "" 제거
    onSave: (newContent) => {
      console.log("api PATCH 로직", newContent);
      // 실제 api 호출
    },
    onDelete: () => {
      console.log("api DELETE 로직");
      // 실제 api 호출
    },
    deleteModalTitle: (
      <>
        &apos;{task.content}&apos; <br />할 일을 정말 삭제하시겠어요?
      </>
    ),
  });

  const handleCompleteTaskButton = () => {
    setIsComplete((prev) => !prev);
  };

  const handleXButton = () => {
    // Parallel Routes 설정 후 추가예정
  };

  return (
    <div className="flex flex-col gap-16 p-40">
      <SVGIcon icon="x" onClick={handleXButton} />
      {isComplete && (
        <div className="flex items-center gap-6">
          <SVGIcon
            icon="check"
            size="xxs"
            className="[--icon-stroke:theme(colors.brand.tertiary)]"
          />
          <span className="text-xs font-medium text-brand-tertiary">완료</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h3 className={clsx("text-xl font-bold", isComplete && "line-through")}>
          {task.content}
        </h3>
        <div className="relative">
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
      <div className="flex items-center">
        <Avatar altText={`${task.writer?.nickname} 프로필`} size="large" />
        <span className="ml-12 text-md font-medium">
          {task.writer?.nickname}
        </span>
        <span className="ml-auto text-text-secondary text-md font-regular">
          {task.createdAt ? formatDate(task.createdAt) : "-"}
        </span>
      </div>

      {!isComplete && (
        <div className="flex items-center gap-10 text-text-default text-xs font-regular">
          <div className="flex items-center gap-6">
            <SVGIcon icon="calendar" size="xxs" />
            <span>{task.date ? formatDate(task.date) : "-"}</span>
          </div>
          <div className="w-px h-8 bg-background-tertiary" />
          <div className="flex items-center gap-6">
            <SVGIcon icon="iconTime" size="xxs" />
            <span>{task.date ? formatTime(task.date) : "-"}</span>
          </div>
          <div className="w-px h-8 bg-background-tertiary " />
          <div className="flex items-center gap-6">
            <SVGIcon icon="iconRepeat" size="xxs" />
            <span>{getFrequencyText(task.frequency)}</span>
          </div>
        </div>
      )}

      {kebab.isEditing ? (
        <textarea
          value={kebab.content}
          onChange={(e) => kebab.setContent(e.target.value)}
          autoFocus
          className="min-h-180 flex-1 resize-none placeholder-text-default text-text-primary text-md font-regular"
        />
      ) : (
        <div className="min-h-200">{kebab.content}</div>
      )}
      {kebab.isEditing && (
        <div className="flex items-center justify-end gap-20">
          <button
            onClick={kebab.handleCancelEdit}
            className="text-text-default text-md font-semibold"
          >
            취소
          </button>
          <Button
            variant="outlined"
            size="xSmall"
            label="수정하기"
            onClick={kebab.handleSaveEdit}
          />
        </div>
      )}

      <InputReply />
      <Reply />

      <div className="fixed bottom-50 z-50 right-[max(1.5rem,calc(50%-600px+1.5rem))]">
        {isComplete ? (
          <ButtonFloating
            label="완료 취소하기"
            icon={<SVGIcon icon="check" size="xxs" className="mr-4" />}
            variant="outlined"
            size="large"
            onClick={handleCompleteTaskButton}
          />
        ) : (
          <ButtonFloating
            label="완료 하기"
            icon={
              <SVGIcon
                icon="check"
                size="xxs"
                className="[--icon-stroke:theme(colors.icon.inverse)] mr-4"
              />
            }
            variant="solid"
            size="large"
            onClick={handleCompleteTaskButton}
          />
        )}
      </div>
    </div>
  );
}
