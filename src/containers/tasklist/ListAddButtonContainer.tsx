"use client";

import ListCreateModal from "@/components/Tasklist/ListCreateModal";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useState } from "react";

export default function ListAddButtonContainer({
  groupId,
}: {
  groupId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddListButton = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleAddListButton}
        className="text-brand-primary flex items-center gap-5"
      >
        <SVGIcon
          icon="plus"
          size="xxs"
          className="[--icon-stroke:theme(colors.brand.primary)]"
        />
        새로운 목록 추가하기
      </button>
      <ListCreateModal
        groupId={groupId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
