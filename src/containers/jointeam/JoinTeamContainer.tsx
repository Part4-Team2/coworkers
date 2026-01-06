"use client";

import Form from "@/components/Common/Form/Form";
import FormFooter from "@/components/Common/Form/FormFooter";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputConfig } from "@/components/Common/Form/types";

interface JoinTeamFormData {
  teamLink: string;
}

export default function JoinTeamContainer() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
  } = useForm<JoinTeamFormData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: JoinTeamFormData) => {
    try {
      // TODO: 실제 팀 참여 API 호출
      // const response = await joinTeamAPI(data.teamLink);
      // if (response.success) {
      //   router.push(`/addteam/${response.teamId}`);
      // } else if (response.error === "not_found") {
      //   setError("teamLink", {
      //     type: "manual",
      //     message: "존재하지 않는 팀 링크입니다.",
      //   });
      // }
      // 임시: 성공 시 팀 페이지로 이동
      // console.log("팀 참여 시도:", data);
      // router.push(`/addteam/${teamId}`);
    } catch (error) {
      // console.error("팀 참여 실패:", error);
    }
  };

  return (
    <div className="w-full flex flex-col lg:items-center">
      <Form
        centered={false}
        topOffsetClassName="pt-80 sm:pt-120 lg:pt-140"
        onSubmit={handleSubmit(onSubmit)}
        title="팀 참여하기"
        register={register}
        errors={errors}
        trigger={trigger}
        input={[
          {
            name: "teamLink",
            label: "팀 링크",
            placeholder: "팀 링크를 입력해주세요.",
            variant: errors.teamLink ? "error" : "default",
            size: "large",
            type: "text",
            full: true,
            registerOptions: {
              required: "팀 링크는 필수 입력입니다.",
              maxLength: {
                // 임의로 200자로 설정
                value: 200,
                message: "팀 링크는 200자 이하로 입력해주세요.",
              },
              pattern: {
                value: /^https?:\/\/.+/,
                message:
                  "올바른 URL 형식으로 입력해주세요. (http:// 또는 https://로 시작해야 합니다.)",
              },
            },
            message: errors.teamLink?.message,
            showError: !!errors.teamLink,
          } as InputConfig,
        ]}
        button={{
          label: "참여하기",
          variant: "solid",
          size: "large",
          full: true,
        }}
      />
      <FormFooter>공유받은 팀 링크를 입력해 참여할 수 있어요.</FormFooter>
    </div>
  );
}
