"use client";

import Input from "@/app/components/Input/Input";
import { BaseModal } from "@/app/components/Modal";
import ModalFooter from "@/app/components/Modal/ModalFooter";
import ModalHeader from "@/app/components/Modal/ModalHeader";
import { useState } from "react";

interface HandleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ListCreateModal({ isOpen, onClose }: HandleModalProps) {
  const [listName, setListName] = useState<string>("");

  const handleCreateButton = () => {
    // 목록 생성 로직(api 연동) 추후 추가
    onClose();
  };
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="px-52 pt-48 pb-32"
    >
      <ModalHeader title="새로운 목록 추가" />
      <div className="text-center text-text-secondary text-md font-medium pt-16 pb-24">
        할 일에 대한 목록을 추가하고
        <br />
        목록별 할 일을 만들 수 있습니다.
      </div>
      <form className="flex felx-col mb-24">
        <Input
          label="목록 이름"
          labelClassName="mb-0 pb-8 text-lg font-medium text-text-primary"
          placeholder="목록 이름을 입력해주세요."
          value={listName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setListName(e.target.value);
          }}
        />
      </form>
      <ModalFooter
        primaryButton={{ label: "만들기", onClick: handleCreateButton }}
      />
    </BaseModal>
  );
}
