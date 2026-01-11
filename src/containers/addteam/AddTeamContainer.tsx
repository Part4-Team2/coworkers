"use client";

import Form from "@/components/Common/Form/Form";
import FormFooter from "@/components/Common/Form/FormFooter";
import Avatar from "@/components/Common/Avatar/Avatar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { InputConfig } from "@/components/Common/Form/types";
import { useImageUpload } from "@/hooks/useImageUpload";
import { postGroup } from "@/api/group";
import { postImage } from "@/api/image";
import { CreateGroupBody } from "@/types/api/group";

interface AddTeamFormData {
  teamName: string;
  image: string | null;
}

export default function AddTeamContainer() {
  const router = useRouter();
  const [addTeamError, setAddTeamError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    previewUrl,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    selectedFile,
  } = useImageUpload();

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
    if (isSubmitting) return;

    setAddTeamError("");
    setIsSubmitting(true);

    try {
      let uploadedImageUrl: string | null = null;

      // 새 이미지가 선택된 경우 업로드
      if (selectedFile) {
        try {
          const imageResponse = await postImage(selectedFile);
          if ("error" in imageResponse) {
            setAddTeamError(
              imageResponse.message || "이미지 업로드에 실패했습니다."
            );
            return;
          }
          uploadedImageUrl = imageResponse.url;
        } catch (error) {
          setAddTeamError("이미지 업로드에 실패했습니다.");
          return;
        }
      }

      const requestData: CreateGroupBody = {
        name: data.teamName,
        image: uploadedImageUrl,
      };

      const response = await postGroup(requestData);
      if ("error" in response) {
        setAddTeamError(response.message);
        return;
      }

      // response 값으로 zustand에 email, teamId, nickname, image 정보 추가
      router.push(`/${response.id}`);
    } catch (error) {
      setAddTeamError("팀 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        aria-label="팀 프로필 이미지 선택"
      />
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
                imageUrl={previewUrl}
                altText="팀 프로필"
                variant="team"
                size="xlarge"
                isEditable={true}
                onEditClick={handleImageClick}
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
            variant: errors.teamName || addTeamError ? "error" : "default",
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
            message:
              errors.teamName?.message || (addTeamError ? "" : undefined),
            showError: !!errors.teamName || !!addTeamError,
          } as InputConfig,
        ]}
        optionAlign="end"
        option={
          addTeamError && (
            <p className="text-xs text-status-danger">{addTeamError}</p>
          )
        }
        button={{
          label: "생성하기",
          variant: "solid",
          size: "large",
          full: true,
          disabled: isSubmitting,
          loading: isSubmitting,
        }}
      />
      <FormFooter>
        <span className="text-sm sm:text-md">
          팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
        </span>
      </FormFooter>
    </div>
  );
}
