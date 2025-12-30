"use client";

import ButtonFloating from "@/app/components/Button/ButtonFloating";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";
import { useState } from "react";
import TaskCreateModal from "./components/TaskCreateModal";

export default function Tasklistpage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTaskButton = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <ButtonFloating
        label="할일 추가"
        icon={<SVGIcon icon="plus" size="xxs" />}
        variant="solid"
        size="large"
        onClick={handleAddTaskButton}
      />

      <TaskCreateModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
