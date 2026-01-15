"use client";

import React, { useState } from "react";
import Form from "@/components/Common/Form/Form";
import FormFooter from "@/components/Common/Form/FormFooter";
import Avatar from "@/components/Common/Avatar/Avatar";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { InputConfig } from "@/components/Common/Form/types";
import { useImageUpload } from "@/hooks/useImageUpload";
import { postImage } from "@/lib/api/image";
import { patchGroup } from "@/lib/api/group";

interface EditTeamFormData {
  teamName: string;
}

interface EditTeamContainerProps {
  teamId: string;
  initialData?: {
    teamName: string;
    profileImage?: string;
  };
}

export default function EditTeamContainer({
  teamId,
  initialData,
}: EditTeamContainerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    previewUrl,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    selectedFile,
  } = useImageUpload(initialData?.profileImage);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
  } = useForm<EditTeamFormData>({
    mode: "onBlur",
    defaultValues: {
      teamName: initialData?.teamName || "",
    },
  });

  const onSubmit = async (data: EditTeamFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined = initialData?.profileImage;

      // 새 이미지가 선택된 경우 postImage API로 업로드
      if (selectedFile) {
        const uploadResult = await postImage(selectedFile);

        if ("error" in uploadResult) {
          throw new Error(uploadResult.message);
        }

        imageUrl = uploadResult.url;
      }

      // 팀 수정 API 호출
      const result = await patchGroup(teamId, {
        name: data.teamName,
        image: imageUrl,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // 성공 메시지 (나중에 Toast로 교체 예정)
      alert("수정되었습니다!");

      // 성공 시 팀 페이지로 이동
      router.push(`/${teamId}`);
    } catch (error) {
      console.error("팀 수정 실패:", error);

      // 에러 메시지 설정
      const errorMessage =
        error instanceof Error ? error.message : "팀 수정에 실패했습니다.";

      setError("teamName", {
        type: "manual",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-16 sm:px-0">
      <div className="w-full max-w-600 flex flex-col items-center">
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
          title="팀 수정하기"
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
            label: "수정하기",
            variant: "solid",
            size: "large",
            full: true,
            loading: isSubmitting,
          }}
        />
        <FormFooter>
          <span className="text-sm sm:text-md">
            팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
          </span>
        </FormFooter>
      </div>
    </div>
  );
}
