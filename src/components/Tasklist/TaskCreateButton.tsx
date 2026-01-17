"use client";

import TaskCreateModal, {
  CreateTaskForm,
} from "@/components/Tasklist/TaskCreateModal";
import ButtonFloating from "@/components/Common/Button/ButtonFloating";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useState } from "react";
import { toast } from "react-toastify";

export default function TaskCreateButton({
  onCreateTask,
}: {
  onCreateTask: (form: CreateTaskForm) => Promise<void>;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleTaskCreated = async (form: CreateTaskForm) => {
    try {
      await onCreateTask(form); // 부모의 handleCreateTask 호출
      setIsModalOpen(false);
    } catch {
      toast.error("할일 생성에 실패했습니다.");
    }
  };

  return (
    <>
      <ButtonFloating
        label="할일 추가"
        icon={<SVGIcon icon="plus" size="xxs" />}
        variant="solid"
        size="large"
        onClick={() => setIsModalOpen(true)}
      />
      <TaskCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTaskCreated}
      />
    </>
  );
}
