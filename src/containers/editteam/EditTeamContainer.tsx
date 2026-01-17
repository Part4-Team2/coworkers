"use client";

import React, { useState, useMemo, useEffect } from "react";
import Form from "@/components/Common/Form/Form";
import FormFooter from "@/components/Common/Form/FormFooter";
import Avatar from "@/components/Common/Avatar/Avatar";
import Input from "@/components/Common/Input/Input";
import Button from "@/components/Common/Button/Button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useImageUpload } from "@/hooks/useImageUpload";
import { postImage } from "@/lib/api/image";
import { patchGroup } from "@/lib/api/group";
import { useHeaderStore } from "@/store/headerStore";
import { setPendingToast } from "@/utils/pendingToast";
import { showErrorToast } from "@/utils/error";

interface EditTeamFormData {
  teamName: string;
}

interface EditTeamContainerProps {
  teamId: string;
}

export default function EditTeamContainer({ teamId }: EditTeamContainerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 전역 상태에서 현재 팀 정보 가져오기
  const teams = useHeaderStore((state) => state.teams);
  const isHydrated = useHeaderStore((state) => state.isHydrated);
  const isLogin = useHeaderStore((state) => state.isLogin);

  const currentTeam = useMemo(
    () => teams.find((team) => team.teamId === teamId),
    [teams, teamId]
  );

  // currentTeam 검증 및 리다이렉트 (hydration 완료 후에만)
  useEffect(() => {
    if (isHydrated && isLogin && !currentTeam) {
      showErrorToast(
        "팀 정보를 찾을 수 없습니다. 팀 목록에서 다시 선택해주세요."
      );
      router.push("/teamlist");
    }
  }, [isHydrated, isLogin, currentTeam, router]);

  const initialTeamName = currentTeam?.teamName || "";
  const initialTeamImage = currentTeam?.teamImage || undefined;

  const {
    previewUrl,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    selectedFile,
  } = useImageUpload(initialTeamImage);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    trigger,
    setError,
    reset,
    getValues,
  } = useForm<EditTeamFormData>({
    mode: "onBlur",
    defaultValues: {
      teamName: initialTeamName,
    },
  });

  // 변경사항이 있는지 확인
  const hasNameChanged = isDirty && getValues("teamName") !== initialTeamName;
  const hasImageChanged =
    selectedFile !== null ||
    (previewUrl && previewUrl !== (initialTeamImage || undefined));
  const hasChanges = hasNameChanged || hasImageChanged;

  // currentTeam이 업데이트되면 form 값 초기화
  useEffect(() => {
    if (currentTeam) {
      reset({
        teamName: currentTeam.teamName,
      });
    }
  }, [currentTeam, reset]);

  const onSubmit = async (data: EditTeamFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined = initialTeamImage;

      // 새 이미지가 선택된 경우 postImage API로 업로드
      if (selectedFile) {
        const uploadResult = await postImage(selectedFile);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }

        imageUrl = uploadResult.data.url;
      }

      // 팀 수정 API 호출
      const result = await patchGroup(teamId, {
        name: data.teamName,
        image: imageUrl,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // 성공 메시지를 저장하고 팀 페이지로 이동
      setPendingToast("success", "팀 정보가 수정되었습니다.");
      router.push(`/${teamId}`);
    } catch (error) {
      console.error("팀 수정 실패:", error);

      // 에러 메시지 설정
      const errorMessage =
        error instanceof Error ? error.message : "팀 수정에 실패했습니다.";

      showErrorToast(errorMessage);
      setError("teamName", {
        type: "manual",
        message: errorMessage,
      });
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
          title="팀 수정하기"
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
                variant={errors.teamName ? "error" : "default"}
                size="large"
                type="text"
                message={errors.teamName?.message}
                showError={!!errors.teamName}
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
          <div className="mt-40 w-full flex justify-center">
            <Button
              full
              label="수정하기"
              variant="solid"
              size="large"
              type="submit"
              disabled={isSubmitting || !hasChanges}
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
