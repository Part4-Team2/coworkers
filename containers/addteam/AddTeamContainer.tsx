"use client";

import Form from "@/app/components/Form/Form";
import FormFooter from "@/app/components/Form/FormFooter";
import Avatar from "@/app/components/Avatar/Avatar";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { InputConfig } from "@/app/components/Form/types";

interface AddTeamFormData {
  teamName: string;
}

export default function AddTeamContainer() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
  } = useForm<AddTeamFormData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: AddTeamFormData) => {
    try {
      // TODO: 실제 팀 생성 API 호출
      // const response = await createTeamAPI(data);
      // if (response.success) {
      //   router.push(`/addteam/${response.teamId}`);
      // } else if (response.error === "duplicate") {
      //   setError("teamName", {
      //     type: "manual",
      //     message: "이미 존재하는 이름입니다.",
      //   });
      // }
      // 임시: 성공 시 팀 페이지로 이동
      // console.log("팀 생성 시도:", data);
      // router.push(`/addteam/${teamId}`);
    } catch (error) {
      // console.error("팀 생성 실패:", error);
    }
  };

  return (
    <>
      <Form
        centered={false}
        topOffsetClassName="pt-80 sm:pt-120 lg:pt-140"
        onSubmit={handleSubmit(onSubmit)}
        title="팀 생성하기"
        profile={
          <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-8">
            <label className="text-sm sm:text-md text-text-primary">
              팀 프로필
            </label>
            <div className="relative inline-block w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
              <Avatar
                // imageUrl={teamProfileImage}
                altText="팀 프로필"
                size="xlarge"
                isEditable={true}
                // onEditClick={handleEditClick}
              />
            </div>
          </div>
        }
        register={register}
        errors={errors}
        trigger={trigger}
        input={[
          {
            name: "teamName",
            label: "팀 이름",
            placeholder: "팀 이름을 입력해주세요.",
            variant: errors.teamName ? "error" : "default",
            size: "large",
            type: "text",
            full: true,
            registerOptions: {
              required: "팀 이름은 필수 입력입니다.",
              maxLength: {
                value: 30,
                message: "팀 이름은 30자 이하로 입력해주세요.",
              },
            },
            message: errors.teamName?.message,
            showError: !!errors.teamName,
          } as InputConfig,
        ]}
        button={{
          label: "생성하기",
          variant: "solid",
          size: "large",
          full: true,
        }}
      />
      <FormFooter>
        <span className="text-sm sm:text-md">
          팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
        </span>
      </FormFooter>
    </>
  );
}
