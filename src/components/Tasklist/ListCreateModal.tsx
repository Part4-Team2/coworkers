"use client";

import Input from "@/components/Common/Input/Input";
import { BaseModal } from "@/components/Common/Modal";
import ModalFooter from "@/components/Common/Modal/ModalFooter";
import ModalHeader from "@/components/Common/Modal/ModalHeader";

import { useState } from "react";

interface ListCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function ListCreateModal({
  isOpen,
  onClose,
  onSubmit,
}: ListCreateModalProps) {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);

    try {
      onSubmit(name);
      onClose();
      setName("");
    } finally {
      setLoading(false);
    }
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
      <form className="flex flex-col mb-24">
        <Input
          label="목록 이름"
          labelClassName="mb-0 pb-8 text-lg font-medium text-text-primary"
          placeholder="목록 이름을 입력해주세요."
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
          }}
        />
      </form>
      <ModalFooter
        primaryButton={{
          label: loading ? "생성 중..." : "만들기",
          onClick: handleSubmit,
          disabled: loading,
        }}
      />
    </BaseModal>
  );
}
