"use client";

import Form from "@/app/components/Form/Form";
import FormFooter from "@/app/components/Form/FormFooter";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputConfig } from "@/app/components/Form/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coworkers - 팀 참여",
  description: "팀 참여 페이지",
};

interface JoinTeamFormData {
  teamLink: string;
}

export default function JoinTeamPage() {
  const router = useRouter();
  const [teamLinkError, setTeamLinkError] = useState<string>("");

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
    setTeamLinkError("");
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
    <>
      <Form
        centered={false}
        topOffsetClassName="pt-140"
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
    </>
  );
}
