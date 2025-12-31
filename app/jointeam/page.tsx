"use client";

import Form from "@/app/components/Form/Form";
import FormFooter from "@/app/components/Form/FormFooter";

export default function JoinTeamPage() {
  return (
    <>
      <Form
        centered={false}
        topOffsetClassName="pt-[140px]"
        onSubmit={() => {}}
        title="팀 참여하기"
        input={[
          {
            label: "팀 링크",
            placeholder: "팀 링크를 입력해주세요.",
            variant: "default",
            size: "large",
            type: "text",
            full: true,
          },
        ]}
        button={{
          label: "참여하기",
          variant: "solid",
          size: "large",
          full: true,
          onSubmit: () => {},
        }}
      />
      <FormFooter>공유받은 팀 링크를 입력해 참여할 수 있어요.</FormFooter>
    </>
  );
}
