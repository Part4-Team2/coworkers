"use client";

import TaskCreateModal from "@/components/Tasklist/TaskCreateModal";
import ButtonFloating from "@/components/Common/Button/ButtonFloating";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TaskAddButtonContainer({
  groupId,
  taskListId,
}: {
  groupId: string;
  taskListId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleAddTaskButton = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTaskCreated = () => {
    setTimeout(() => router.refresh(), 150);
  };

  return (
    <>
      <ButtonFloating
        label="할일 추가"
        icon={<SVGIcon icon="plus" size="xxs" />}
        variant="solid"
        size="large"
        onClick={handleAddTaskButton}
      />
      <TaskCreateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        groupId={groupId}
        taskListId={taskListId}
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
}
