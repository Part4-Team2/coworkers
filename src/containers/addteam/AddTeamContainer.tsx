"use client";

import Form from "@/components/Common/Form/Form";
import FormFooter from "@/components/Common/Form/FormFooter";
import Avatar from "@/components/Common/Avatar/Avatar";
import Input from "@/components/Common/Input/Input";
import Button from "@/components/Common/Button/Button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useImageUpload } from "@/hooks/useImageUpload";
import { postGroup } from "@/lib/api/group";
import { postImage } from "@/lib/api/image";
import { CreateGroupBody } from "@/lib/types/group";
import { showErrorToast, showSuccessToast } from "@/utils/error";

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
            const errorMessage =
              imageResponse.message || "이미지 업로드에 실패했습니다.";
            setAddTeamError(errorMessage);
            showErrorToast(errorMessage);
            return;
          }
          uploadedImageUrl = imageResponse.url;
        } catch (error) {
          const errorMessage = "이미지 업로드에 실패했습니다.";
          setAddTeamError(errorMessage);
          showErrorToast(errorMessage);
          return;
        }
      }

      const requestData: CreateGroupBody = {
        name: data.teamName,
        ...(uploadedImageUrl && { image: uploadedImageUrl }),
      };

      const response = await postGroup(requestData);
      if ("error" in response) {
        const errorMessage = response.message || "팀 생성에 실패했습니다.";
        setAddTeamError(errorMessage);
        showErrorToast(errorMessage);
        return;
      }

      // response 값으로 zustand에 email, teamId, nickname, image 정보 추가
      showSuccessToast("팀 생성에 성공했습니다.");
      router.push(`/${response.id}`);
    } catch (error) {
      const errorMessage = "팀 생성에 실패했습니다. 다시 시도해주세요.";
      setAddTeamError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-16 sm:px-24 lg:px-0">
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
          title="팀 생성하기"
        >
          <div className="w-full">
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
          </div>
          <div className="w-full flex flex-col items-center gap-24 mt-24">
            <div className="w-full">
              <Input
                full
                label="팀 이름"
                placeholder="팀 이름을 입력해주세요."
                variant={errors.teamName || addTeamError ? "error" : "default"}
                size="large"
                type="text"
                message={
                  errors.teamName?.message || (addTeamError ? "" : undefined)
                }
                showError={!!errors.teamName || !!addTeamError}
                {...register("teamName", {
                  required: "팀 이름은 필수 입력입니다.",
                  maxLength: {
                    value: 30,
                    message: "팀 이름은 30자 이하로 입력해주세요.",
                  },
                })}
              />
            </div>
          </div>
          {addTeamError && (
            <div className="mt-12 w-full flex justify-start">
              <p className="text-xs text-status-danger">{addTeamError}</p>
            </div>
          )}
          <div className="mt-40 w-full flex justify-center">
            <Button
              full
              label="생성하기"
              variant="solid"
              size="large"
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </div>
        </Form>
        <FormFooter>
          <span className="text-sm sm:text-md">
            팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
          </span>
        </FormFooter>
      </div>
    </div>
  );
}
