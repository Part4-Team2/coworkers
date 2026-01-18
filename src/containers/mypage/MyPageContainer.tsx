"use client";

import { useState } from "react";
import Form from "@/components/Common/Form/Form";
import Avatar from "@/components/Common/Avatar/Avatar";
import Button from "@/components/Common/Button/Button";
import Input from "@/components/Common/Input/Input";
import Modal from "@/components/Common/Modal/Modal";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useForm } from "react-hook-form";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useApiMutation } from "@/hooks/useApiMutation";
import { postImage } from "@/lib/api/image";
import { patchUser, deleteUser, patchUserPassword } from "@/lib/api/user";
import { useRouter } from "next/navigation";
import { UpdatePasswordBody } from "@/lib/types/user";
import { showErrorToast, showSuccessToast } from "@/utils/error";
import { useHeaderStore } from "@/store/headerStore";

interface NameFormData {
  name: string;
}

interface PasswordChangeFormData {
  newPassword: string;
  newPasswordConfirmation: string;
}

interface MyPageContainerProps {
  initialImage: string | null;
  initialNickname: string;
  initialEmail: string;
}

export default function MyPageContainer({
  initialImage,
  initialNickname,
  initialEmail,
}: MyPageContainerProps) {
  const router = useRouter();
  const fetchUser = useHeaderStore((s) => s.fetchUser);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string>("");
  const [passwordChangeError, setPasswordChangeError] = useState<string>("");
  const { mutate: mutateName, isLoading: isSubmittingName } = useApiMutation();
  const { mutate: mutatePassword, isLoading: isSubmittingPassword } =
    useApiMutation();
  const { mutate: mutateWithdraw, isLoading: isSubmittingWithdraw } =
    useApiMutation();
  const isSubmitting =
    isSubmittingName || isSubmittingPassword || isSubmittingWithdraw;

  const {
    previewUrl,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    selectedFile,
    resetImage,
  } = useImageUpload(initialImage ?? undefined);

  const {
    register: registerName,
    handleSubmit: handleSubmitName,
    formState: { errors: nameErrors, isDirty: isNameDirty },
    trigger: triggerName,
    getValues: getNameValues,
  } = useForm<NameFormData>({
    mode: "onBlur",
    defaultValues: {
      name: initialNickname,
    },
  });

  // 변경사항이 있는지 확인
  const hasNameChanged =
    isNameDirty && getNameValues("name") !== initialNickname;
  const hasImageChanged =
    selectedFile !== null ||
    (previewUrl && previewUrl !== (initialImage || undefined));
  const hasChanges = hasNameChanged || hasImageChanged;

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    getValues: getPasswordValues,
    watch: watchPassword,
    trigger: triggerPassword,
    reset: resetPassword,
  } = useForm<PasswordChangeFormData>({
    mode: "onBlur",
  });

  // 비밀번호 변경 모달에서 에러가 있는지 확인
  const hasPasswordErrors =
    !!passwordErrors.newPassword || !!passwordErrors.newPasswordConfirmation;

  // 비밀번호 필드가 비어있는지 확인
  const isPasswordEmpty =
    !watchPassword("newPassword") || !watchPassword("newPasswordConfirmation");

  const handleClose = () => {
    setOpenModal(null);
    setPasswordChangeError("");
    resetPassword();
  };

  const onNameSubmit = async (data: NameFormData) => {
    setNameError("");

    await mutateName(async () => {
      let uploadedImageUrl: string | null = null;

      // 새 이미지가 선택된 경우 업로드
      if (selectedFile) {
        const imageResponse = await postImage(selectedFile);
        if (!imageResponse.success) {
          const errorMessage =
            imageResponse.error || "이미지 업로드에 실패했습니다.";
          setNameError(errorMessage);
          showErrorToast(errorMessage);
          throw new Error(errorMessage);
        }
        uploadedImageUrl = imageResponse.data.url;
      }

      // 이름이 변경되었거나 이미지가 업로드된 경우 업데이트
      const shouldUpdateName = data.name !== initialNickname;
      const shouldUpdateImage = selectedFile && uploadedImageUrl;

      if (shouldUpdateName || shouldUpdateImage) {
        const updateData: { nickname?: string; image?: string | null } = {};
        if (shouldUpdateName) {
          updateData.nickname = data.name;
        }
        if (shouldUpdateImage) {
          updateData.image = uploadedImageUrl;
        }

        const response = await patchUser(updateData);
        if (!response.success) {
          const errorMessage = response.error || "업데이트에 실패했습니다.";
          setNameError(errorMessage);
          showErrorToast(errorMessage);
          throw new Error(errorMessage);
        }

        // 성공 시 이미지 상태 초기화
        if (shouldUpdateImage) {
          resetImage();
        }

        // 성공 피드백 및 데이터 갱신
        showSuccessToast("프로필이 업데이트되었습니다.");
        // 헤더 스토어 업데이트
        await fetchUser();
        router.refresh(); // 서버에서 최신 데이터 가져오기
        return response;
      }
    });
  };

  // 엔터 키 핸들러
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitName(onNameSubmit)();
    }
  };

  const onPasswordChangeSubmit = async (data: PasswordChangeFormData) => {
    setPasswordChangeError("");
    const requestData: UpdatePasswordBody = {
      passwordConfirmation: data.newPasswordConfirmation,
      password: data.newPassword,
    };

    await mutatePassword(async () => {
      const response = await patchUserPassword(requestData);

      if (!response.success) {
        const errorMessage = response.error || "비밀번호 변경에 실패했습니다.";
        setPasswordChangeError(errorMessage);
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // 성공 시 모달 닫기
      showSuccessToast("비밀번호가 변경되었습니다.");
      handleClose();
      return response;
    });
  };

  const handleWithdraw = async () => {
    await mutateWithdraw(async () => {
      const response = await deleteUser();

      if (!response.success) {
        const errorMessage = response.error || "회원 탈퇴에 실패했습니다.";
        setNameError(errorMessage);
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      // 성공 시 로그인 페이지로 리다이렉트 (쿠키 삭제 후)
      showSuccessToast("회원 탈퇴가 완료되었습니다.");
      router.replace("/login");
      return response;
    });
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
          aria-label="프로필 이미지 선택"
        />
        <Form
          centered={false}
          topOffsetClassName="pt-80 sm:pt-120 lg:pt-140"
          onSubmit={handleSubmitName(onNameSubmit)}
        >
          <div className="w-full">
            <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-8">
              <label className="text-lg sm:text-xl font-bold">계정 설정</label>
              <div className="relative inline-block w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
                <Avatar
                  imageUrl={previewUrl}
                  altText="사용자 프로필"
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
                label="이름"
                placeholder="이름을 입력해주세요."
                variant={nameErrors.name ? "error" : "default"}
                size="large"
                type="text"
                message={nameErrors.name?.message}
                showError={!!nameErrors.name}
                onKeyDown={handleNameKeyDown}
                {...registerName("name", {
                  required: "이름은 필수 입력입니다.",
                  maxLength: {
                    value: 20,
                    message: "이름은 최대 20자까지 가능합니다.",
                  },
                })}
              />
            </div>
            <div className="w-full">
              <Input
                full
                label="이메일"
                placeholder="이메일을 입력해주세요."
                variant="default"
                size="large"
                type="email"
                value={initialEmail || ""}
                disabled={true}
              />
            </div>
            <div className="w-full">
              <Input
                full
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요."
                variant="default"
                size="large"
                type="password"
                rightElement={
                  <Button
                    label="변경하기"
                    variant="solid"
                    size="xSmall"
                    onClick={() => setOpenModal("password-change")}
                  />
                }
                disabled={true}
              />
            </div>
          </div>
          <div className="mt-12 w-full flex justify-start">
            <div className="flex flex-col gap-4">
              {nameError && (
                <p className="w-full text-xs text-status-danger">{nameError}</p>
              )}
              <div
                className="text-status-danger text-base sm:text-lg cursor-pointer hover:opacity-80 flex items-center gap-6 sm:gap-8 py-6 sm:py-8"
                onClick={() => setOpenModal("withdraw")}
              >
                <SVGIcon icon="secession" />
                <span>회원 탈퇴하기</span>
              </div>
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
      </div>

      {/* 비밀번호 변경 모달 */}
      <Modal
        isOpen={openModal === "password-change"}
        onClose={handleClose}
        title="비밀번호 변경하기"
        input={[
          {
            label: "새 비밀번호",
            type: "password",
            placeholder:
              "새 비밀번호 (영문, 숫자, 특수문자 포함, 8-50자)를 입력해주세요.",
            variant: passwordErrors.newPassword ? "error" : "default",
            allowPasswordToggle: true,
            ...registerPassword("newPassword", {
              required: "비밀번호는 필수 입력입니다.",
              minLength: {
                value: 8,
                message: "비밀번호는 최소 8자 이상입니다.",
              },
              maxLength: {
                value: 50,
                message: "비밀번호는 최대 50자까지 가능합니다.",
              },
              pattern: {
                value:
                  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/,
                message:
                  "비밀번호는 숫자, 영문, 특수문자를 각각 최소 1개 이상 포함해야 합니다.",
              },
              onBlur: () => triggerPassword("newPassword"),
            }),
            message: passwordErrors.newPassword?.message,
            showError: !!passwordErrors.newPassword,
          },
          {
            label: "새 비밀번호 확인",
            type: "password",
            placeholder: "새 비밀번호를 다시 한 번 입력해주세요.",
            variant: passwordErrors.newPasswordConfirmation
              ? "error"
              : "default",
            allowPasswordToggle: true,
            ...registerPassword("newPasswordConfirmation", {
              required: "비밀번호 확인을 입력해주세요.",
              validate: (value) =>
                value === getPasswordValues("newPassword") ||
                "비밀번호가 일치하지 않습니다.",
              onBlur: () => triggerPassword("newPasswordConfirmation"),
            }),
            message: passwordErrors.newPasswordConfirmation?.message,
            showError: !!passwordErrors.newPasswordConfirmation,
          },
        ]}
        primaryButton={{
          label: "변경하기",
          onClick: handleSubmitPassword(onPasswordChangeSubmit),
          disabled:
            isSubmittingPassword || hasPasswordErrors || isPasswordEmpty,
          loading: isSubmittingPassword,
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      >
        {passwordChangeError && (
          <p className="text-xs text-status-danger -mt-8">
            {passwordChangeError}
          </p>
        )}
      </Modal>

      {/* 회원 탈퇴 모달 */}
      <Modal
        isOpen={openModal === "withdraw"}
        onClose={handleClose}
        title="회원 탈퇴를 진행하시겠어요?"
        icon={{
          name: "alert",
          size: 20,
          className: "text-status-danger",
        }}
        description={[
          "그룹장으로 있는 그룹은 자동으로 삭제되고,",
          "모든 그룹에서 나가집니다.",
        ]}
        primaryButton={{
          label: "회원 탈퇴",
          onClick: handleWithdraw,
          variant: "danger",
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      />
    </div>
  );
}
