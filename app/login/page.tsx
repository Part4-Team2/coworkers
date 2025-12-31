"use client";

import Form from "@/app/components/Form/Form";
import Link from "next/link";
import FormFooter from "@/app/components/Form/FormFooter";
import SocialForm from "../components/Form/SocialForm";
import Modal from "@/app/components/Modal/Modal";
import { useState } from "react";

export default function LoginPage() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const handleClose = () => setOpenModal(null);
  return (
    <>
      <div className="w-full flex flex-col items-center pb-32 px-16 sm:px-0">
        <Form
          centered={false}
          topOffsetClassName="pt-[64px]"
          onSubmit={() => {}}
          title="로그인"
          input={[
            {
              label: "이메일",
              placeholder: "이메일을 입력해주세요.",
              variant: "default",
              size: "large",
              type: "email",
              full: true,
            },
            {
              label: "비밀번호",
              placeholder: "비밀번호를 입력해주세요.",
              variant: "default",
              size: "large",
              type: "password",
              allowPasswordToggle: true,
              full: true,
            },
          ]}
          optionAlign="end"
          option={
            <div
              onClick={() => setOpenModal("password-reset")}
              className="text-sm text-emerald-500 underline cursor-pointer"
            >
              비밀번호를 잊으셨나요?
            </div>
          }
          button={{
            label: "로그인",
            variant: "solid",
            size: "large",
            full: true,
            onSubmit: () => {
              setOpenModal("password-reset");
            },
          }}
        />
        <FormFooter>
          <span className="text-sm text-text-primary">
            아직 계정이 없으신가요?
            <Link
              href="/signup"
              className="text-emerald-500 underline cursor-pointer px-12"
            >
              가입하기
            </Link>
          </span>
        </FormFooter>
        <SocialForm text="간편 로그인하기" />
      </div>
      {/* 비밀번호 재설정 모달 */}
      <Modal
        isOpen={openModal === "password-reset"}
        onClose={handleClose}
        title="비밀번호 재설정"
        description="비밀번호 재설정 링크를 보내드립니다."
        input={{
          placeholder: "이메일을 입력하세요.",
          type: "email",
          value: emailValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setEmailValue(e.target.value),
        }}
        primaryButton={{
          label: "링크 보내기",
          onClick: () => {
            console.log("링크 보내기:", emailValue);
            handleClose();
          },
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      />
    </>
  );
}
