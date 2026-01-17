"use client";

import Input from "@/components/Common/Input/Input";
import { BaseModal } from "@/components/Common/Modal";
import ModalFooter from "@/components/Common/Modal/ModalFooter";
import ModalHeader from "@/components/Common/Modal/ModalHeader";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<{ name: string }>({
    defaultValues: { name: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const [loading, setLoading] = useState(false);

  const onValid = async ({ name }: { name: string }) => {
    setLoading(true);
    try {
      onSubmit(name.trim());
      onClose();
      reset();
    } catch (error) {
      toast.error("할일 목록 생성에 실패했습니다.");
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
          {...register("name", {
            required: "목록 이름을 입력해주세요.",
            validate: (value) =>
              value.trim().length > 0 || "공백만 입력할 수 없습니다.",
            minLength: {
              value: 1,
              message: "최소 1글자 이상 입력해주세요.",
            },
            maxLength: {
              value: 20,
              message: "최대 20글자까지 입력 가능합니다.",
            },
          })}
        />
        {errors.name && (
          <p className="text-status-danger text-sm">{errors.name.message}</p>
        )}
      </form>
      <ModalFooter
        primaryButton={{
          label: loading ? "생성 중..." : "만들기",
          onClick: handleSubmit(onValid),
          disabled: loading || !isValid,
        }}
      />
    </BaseModal>
  );
}
