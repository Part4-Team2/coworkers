"use client";

import TaskCreateModal from "@/app/addteam/[teamid]/tasklist/components/TaskCreateModal";
import ButtonFloating from "@/app/components/Button/ButtonFloating";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";
import { useState } from "react";

const TaskListContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddTaskButton = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
      <TaskCreateModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
};

export default TaskListContainer;
