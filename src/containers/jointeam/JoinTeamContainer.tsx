"use client";

import Form from "@/components/Common/Form/Form";
import FormFooter from "@/components/Common/Form/FormFooter";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputConfig } from "@/components/Common/Form/types";
import { postGroupAcceptInvitation } from "@/lib/api/group";

interface JoinTeamFormData {
  teamLink: string;
}

export default function JoinTeamContainer({ email }: { email: string }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinTeamError, setJoinTeamError] = useState<string>("");
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
    if (isSubmitting) return;
    setJoinTeamError("");
    setIsSubmitting(true);

    // URL에서 token 쿼리 파라미터 추출
    let token = "";
    try {
      const url = new URL(data.teamLink);
      token = url.searchParams.get("token") || "";
    } catch (error) {
      setJoinTeamError("올바른 URL 형식이 아닙니다.");
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      setJoinTeamError("토큰이 포함된 링크가 아닙니다.");
      setIsSubmitting(false);
      return;
    }

    const requestData: { userEmail: string; token: string } = {
      userEmail: email,
      token: token,
    };

    try {
      const response = await postGroupAcceptInvitation(requestData);
      if ("error" in response) {
        if (response.status === 404) {
          setJoinTeamError("존재하지 않는 팀 링크입니다.");
        } else {
          setJoinTeamError(
            "초대 링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요."
          );
        }
        return;
      }
      router.push(`/${response.groupId}`);
    } catch (error) {
      setJoinTeamError("팀 참여에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
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
                value: 500,
                message: "팀 링크는 500자 이하로 입력해주세요.",
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
          disabled: isSubmitting,
          loading: isSubmitting,
        }}
      />
      {joinTeamError && <div className="text-red-500">{joinTeamError}</div>}
      <FormFooter>공유받은 팀 링크를 입력해 참여할 수 있어요.</FormFooter>
    </div>
  );
}
