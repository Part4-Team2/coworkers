"use client";

import Avatar from "@/components/Common/Avatar/Avatar";
import Button from "@/components/Common/Button/Button";
import ButtonFloating from "@/components/Common/Button/ButtonFloating";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import { Modal } from "@/components/Common/Modal";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import Reply from "@/components/Tasklist/Comment/Reply";
import useKebabMenu from "@/hooks/useKebabMenu";
import { deleteTasks, patchTask } from "@/lib/api/task";
import { TaskDetail } from "@/types/task";
import { formatDate, formatTime } from "@/utils/date";
import { getFrequencyText } from "@/utils/frequency";
import clsx from "clsx";
import { useState } from "react";
export interface TaskWithToggle extends TaskDetail {
  isToggle: boolean; // doneAt나 doneBy 기반 UI 토글
}
type TaskDetailsContainerProps = {
  task: TaskWithToggle;
  groupId: number;
  taskListId: number;
  onClose?: () => void;
  onTaskUpdated?: (updatedTask: TaskDetail) => void;
  onTaskDeleted?: (taskId: number, rollback?: boolean) => void;
};

export default function TaskDetailsContainer({
  task,
  groupId,
  taskListId,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
}: TaskDetailsContainerProps) {
  const [isComplete, setIsComplete] = useState(task.isToggle ?? false);
  const [taskData, setTaskData] = useState(task);

  // 수정 모드 (제목 + 메모 함께)
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(taskData.name);
  const [editedDescription, setEditedDescription] = useState(
    taskData.description || ""
  );

  const kebab = useKebabMenu({
    initialContent: task.description || "",
    onSave: async () => {
      // 직접 사용 안함 (handleSaveEdit로 대체)
    },
    onDelete: async () => {
      if (!task.id || !task.recurringId) {
        console.error("삭제에 필요한 정보가 없습니다.");
        return;
      }

      try {
        onClose?.();
        onTaskDeleted?.(task.id);

        const result = await deleteTasks(
          groupId,
          taskListId,
          task.id,
          task.recurringId
        );

        if (result.error) {
          alert(result.message);
          // 실패 시 롤백을 위해 다시 fetchTasks 필요

          onTaskDeleted?.(task.id, true); // rollback flag

          return;
        }
      } catch (err) {
        console.error(err);
        alert("삭제 중 오류가 발생했습니다.");
        onTaskDeleted?.(task.id, true); // 실패 시 롤백
      }
    },
    deleteModalTitle: (
      <>
        &apos;{task.name}&apos; <br />할 일을 정말 삭제하시겠어요?
      </>
    ),
  });

  // 케밥 메뉴 선택
  const handleKebabSelect = (option: string) => {
    if (option === "수정하기") {
      setIsEditing(true);
      setEditedName(taskData.name);
      setEditedDescription(taskData.description || "");
    } else if (option === "삭제하기") {
      kebab.handleDropdownSelect("삭제하기");
    }
  };

  // 제목 + 메모 함께 저장
  const handleSaveEdit = async () => {
    if (editedName.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      const result = await patchTask(groupId, taskListId, task.id, {
        name: editedName,
        description: editedDescription,
      });

      if ("error" in result) {
        alert(result.message);
        return;
      }

      const updatedTask = {
        ...taskData,
        ...result,
        isToggle: !!result.doneAt || (taskData.doneBy?.length ?? 0) > 0,
      };

      setTaskData(updatedTask);
      setIsEditing(false);
      onTaskUpdated?.(updatedTask);
    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditedName(taskData.name);
    setEditedDescription(taskData.description || "");
    setIsEditing(false);
  };

  const handleCompleteTaskButton = async () => {
    const prevComplete = isComplete;
    const newDoneState = !isComplete;

    // 낙관적 업데이트
    setIsComplete(newDoneState);

    try {
      const result = await patchTask(groupId, taskListId, task.id, {
        done: newDoneState,
      });

      if ("error" in result) {
        // 실패 시 롤백
        setIsComplete(prevComplete);
        alert(result.message);
        return;
      }

      // 성공 시 전체 task 데이터 업데이트
      const updatedTask = {
        ...taskData,
        ...result,
        isToggle: !!result.doneAt || (taskData.doneBy?.length ?? 0) > 0,
      };

      setTaskData(updatedTask);
      setIsComplete(updatedTask.isToggle);

      // 부모 컴포넌트에도 알림 (TaskListContainer의 리스트 업데이트)
      onTaskUpdated?.(updatedTask);
    } catch (err) {
      // 네트워크 에러 시 롤백
      setIsComplete(isComplete);
      console.error(err);
      alert("할 일 상태 변경에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-16 p-40">
        <SVGIcon icon="x" onClick={onClose} className="cursor-pointer" />

        {isComplete && (
          <div className="flex items-center gap-6">
            <SVGIcon
              icon="check"
              size="xxs"
              className="[--icon-stroke:theme(colors.brand.tertiary)]"
            />
            <span className="text-xs font-medium text-brand-tertiary">
              완료
            </span>
          </div>
        )}
        <div className="flex items-center justify-between gap-12">
          {isEditing ? (
            <div className="flex-1 flex items-center gap-8">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
                className="flex-1 text-xl font-bold bg-transparent border-b border-brand-primary outline-none px-4 py-2"
                placeholder="할 일 제목을 입력하세요"
              />
            </div>
          ) : (
            <>
              <h3
                className={clsx(
                  "text-xl font-bold",
                  isComplete && "line-through"
                )}
              >
                {taskData.name}
              </h3>
              <div className="relative">
                <Dropdown
                  options={kebab.dropdownOptions}
                  size="md"
                  trigger="icon"
                  icon="kebabLarge"
                  listPosition="absolute right-0 top-full mt-5"
                  onSelect={handleKebabSelect}
                />
              </div>
            </>
          )}
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
          <Avatar
            imageUrl={taskData.writer?.image ?? undefined}
            altText={`${taskData.writer?.nickname} 프로필`}
            size="large"
          />
          <span className="ml-12 text-md font-medium">
            {taskData.writer?.nickname}
          </span>
          <span className="ml-auto text-text-secondary text-md font-regular">
            {taskData.updatedAt ? formatDate(taskData.updatedAt) : "-"}
          </span>
        </div>

        {!isComplete && (
          <div className="flex items-center gap-10 text-text-default text-xs font-regular">
            <div className="flex items-center gap-6">
              <SVGIcon icon="calendar" size="xxs" />
              <span>{taskData.date ? formatDate(taskData.date) : "-"}</span>
            </div>
            <div className="w-px h-8 bg-background-tertiary" />
            <div className="flex items-center gap-6">
              <SVGIcon icon="iconTime" size="xxs" />
              <span>{taskData.date ? formatTime(taskData.date) : "-"}</span>
            </div>
            <div className="w-px h-8 bg-background-tertiary " />
            <div className="flex items-center gap-6">
              <SVGIcon icon="iconRepeat" size="xxs" />
              <span>{getFrequencyText(taskData.frequency)}</span>
            </div>
          </div>
        )}

        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            autoFocus
            className="min-h-180 flex-1 resize-none placeholder-text-default text-text-primary text-md font-regular focus:outline-none focus:border-b focus:border-brand-primary"
          />
        ) : (
          <div className="min-h-200 text-text-primary text-md font-regular">
            {taskData.description || "메모가 없습니다."}
          </div>
        )}

        {isEditing && (
          <div className="flex items-center justify-end gap-20">
            <button
              onClick={handleCancelEdit}
              className="text-text-default text-md font-semibold"
            >
              취소
            </button>
            <Button
              variant="outlined"
              size="xSmall"
              label="수정하기"
              onClick={handleSaveEdit}
            />
          </div>
        )}

        <Reply taskId={task.id} />

        <div className="fixed bottom-50 z-50 right-50">
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
    </>
  );
}
