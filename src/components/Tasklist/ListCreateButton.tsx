"use client";

import ListCreateModal from "@/components/Tasklist/ListCreateModal";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useState } from "react";

export default function ListCreateButton({
  onCreate,
}: {
  onCreate: (name: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAdd = (name: string) => {
    onCreate(name); // 상위에게 새 목록 추가 요청
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdd} // 모달에서 이름 전달
      />
    </div>
  );
}
