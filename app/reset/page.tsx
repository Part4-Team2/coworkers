"use client";

import Form from "@/app/components/Form/Form";

export default function ResetPage() {
  return (
    <>
      <Form
        centered={false}
        topOffsetClassName="pt-[140px]"
        onSubmit={() => {}}
        title="비밀번호 재설정"
        input={[
          {
            label: "새 비밀번호",
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
            placeholder: "새 비밀번호를 다시 한번 입력해주세요.",
            variant: "default",
            size: "large",
            type: "password",
            allowPasswordToggle: true,
            full: true,
          },
        ]}
        button={{
          label: "재설정",
          variant: "solid",
          size: "large",
          full: true,
          onClick: () => {},
        }}
      />
    </>
  );
}
