"use client";

import TaskCreateModal from "@/components/Tasklist/TaskCreateModal";
import ButtonFloating from "@/components/Common/Button/ButtonFloating";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useState } from "react";

const TaskAddButtonContainer = () => {
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

export default TaskAddButtonContainer;
