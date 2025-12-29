"use client";

import Form from "@/app/components/Form/Form";
import SocialForm from "../components/Form/SocialForm";

export default function SignupPage() {
  return (
    <div className="w-full flex flex-col items-center gap-24 pb-32 px-16 sm:px-0">
      <Form
        centered={false}
        topOffsetClassName="pt-[64px]"
        onSubmit={() => {}}
        title="회원가입"
        input={[
          {
            label: "이름",
            placeholder: "이름을 입력해주세요.",
            variant: "default",
            size: "large",
            type: "text",
            full: true,
          },
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
            placeholder:
              "비밀번호 (영문, 숫자 포함, 12자 이내)를 입력해주세요.",
            variant: "default",
            size: "large",
            type: "password",
            allowPasswordToggle: true,
            full: true,
          },
          {
            label: "비밀번호 확인",
            placeholder: "비밀번호를 다시 한번 입력해주세요.",
            variant: "default",
            size: "large",
            type: "password",
            allowPasswordToggle: true,
            full: true,
          },
        ]}
        button={{
          label: "회원가입",
          variant: "solid",
          size: "large",
          full: true,
          onSubmit: () => {},
        }}
      />
      <SocialForm text="간편 회원가입하기" />
    </div>
  );
}
