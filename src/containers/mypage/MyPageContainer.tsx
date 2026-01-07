"use client";

import { useState, useEffect, useRef } from "react";
import Form from "@/components/Common/Form/Form";
import Avatar from "@/components/Common/Avatar/Avatar";
import Button from "@/components/Common/Button/Button";
import Modal from "@/components/Common/Modal/Modal";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useForm } from "react-hook-form";
import { InputConfig } from "@/components/Common/Form/types";
import { useImageUpload } from "@/hooks/useImageUpload";
import { postImage } from "@/api/image";
import { patchUser, deleteUser } from "@/api/user";
import { useRouter } from "next/navigation";

interface NameFormData {
  name: string;
}

interface PasswordChangeFormData {
  password: string;
  confirmPassword: string;
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
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string>("");
  const [passwordChangeError, setPasswordChangeError] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string | null>(initialImage);
  const [isUpdating, setIsUpdating] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const {
    previewUrl,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    selectedFile,
  } = useImageUpload(initialImage || undefined);

  const {
    register: registerName,
    handleSubmit: handleSubmitName,
    formState: { errors: nameErrors },
    trigger: triggerName,
    watch: watchName,
    setValue: setNameValue,
  } = useForm<NameFormData>({
    mode: "onBlur",
    defaultValues: {
      name: initialNickname,
    },
  });

  const currentName = watchName("name");

  // previewUrl이 변경되면 currentImage도 업데이트 (blob URL인 경우 - 미리보기용)
  useEffect(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      setCurrentImage(previewUrl);
    } else if (previewUrl && !previewUrl.startsWith("blob:")) {
      setCurrentImage(previewUrl);
    }
  }, [previewUrl]);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    trigger: triggerPassword,
    reset: resetPassword,
  } = useForm<PasswordChangeFormData>({
    mode: "onBlur",
  });

  const password = watchPassword("password");

  const handleClose = () => {
    setOpenModal(null);
    setPasswordChangeError("");
    resetPassword();
  };

  const onNameSubmit = async (data: NameFormData) => {
    setNameError("");

    try {
      setIsUpdating(true);

      // 이미지가 선택된 경우 먼저 업로드
      let imageUrl = currentImage;
      if (selectedFile) {
        const imageResponse = await postImage(selectedFile);
        if ("error" in imageResponse) {
          setNameError("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
          setIsUpdating(false);
          return;
        }
        imageUrl = imageResponse.url;
        setCurrentImage(imageUrl);
      }

      // 이름이 변경되었거나 이미지가 업로드된 경우 업데이트
      const shouldUpdateName = data.name !== initialNickname;
      const shouldUpdateImage = selectedFile && imageUrl !== initialImage;

      if (shouldUpdateName || shouldUpdateImage) {
        const updateData: { nickname?: string; image?: string | null } = {};
        if (shouldUpdateName) {
          updateData.nickname = data.name;
        }
        if (shouldUpdateImage) {
          updateData.image = imageUrl;
        }

        await patchUser(updateData);
      }

      // 성공 시 초기값 업데이트
      // initialNickname은 props이므로 업데이트할 수 없지만,
      // 다음에 페이지를 새로고침하면 새로운 값이 반영됨
    } catch (error) {
      setNameError("업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUpdating(false);
    }
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
    try {
      // TODO: 실제 비밀번호 변경 API 호출
      // const response = await changePasswordAPI(data);
      // if (response.success) {
      //   handleClose();
      // } else {
      //   setPasswordChangeError(
      //     response.message || "비밀번호 변경에 실패했습니다."
      //   );
      // }
      // console.log("비밀번호 변경 시도:", data);
      handleClose();
    } catch (error) {
      setPasswordChangeError(
        "비밀번호 변경에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsUpdating(true);
      const response = await deleteUser();

      if ("error" in response) {
        setNameError(response.message || "회원 탈퇴에 실패했습니다.");
        setIsUpdating(false);
        return;
      }

      // 성공 시 로그인 페이지로 리다이렉트
      router.push("/login");
    } catch (error) {
      setNameError("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
      setIsUpdating(false);
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
        aria-label="프로필 이미지 선택"
      />
      <Form
        centered={false}
        topOffsetClassName="pt-80 sm:pt-120 lg:pt-140"
        onSubmit={handleSubmitName(onNameSubmit)}
        profile={
          <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-8">
            <label className="text-lg sm:text-xl font-bold">계정 설정</label>
            <div className="relative inline-block w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
              <Avatar
                imageUrl={currentImage || undefined}
                altText="사용자 프로필"
                size="xlarge"
                isEditable={true}
                onEditClick={handleImageClick}
              />
            </div>
          </div>
        }
        register={registerName}
        errors={nameErrors}
        trigger={triggerName}
        input={[
          {
            name: "name",
            label: "이름",
            placeholder: "이름을 입력해주세요.",
            variant: nameErrors.name ? "error" : "default",
            size: "large",
            type: "text",
            full: true,
            onKeyDown: handleNameKeyDown,
            registerOptions: {
              required: "이름은 필수 입력입니다.",
              maxLength: {
                value: 20,
                message: "이름은 최대 20자까지 가능합니다.",
              },
            },
            message: nameErrors.name?.message,
            showError: !!nameErrors.name,
          } as InputConfig,
          {
            label: "이메일",
            placeholder: "이메일을 입력해주세요.",
            variant: "default",
            size: "large",
            type: "email",
            full: true,
            value: initialEmail || "",
            disabled: true,
          } as InputConfig,
          {
            label: "비밀번호",
            placeholder: "비밀번호를 입력해주세요.",
            variant: "default",
            size: "large",
            type: "password",
            rightElement: (
              <Button
                label="변경하기"
                variant="solid"
                size="xSmall"
                onClick={() => setOpenModal("password-change")}
              />
            ),
            full: true,
            disabled: true,
          } as InputConfig,
        ]}
        option={
          <>
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
          </>
        }
        optionAlign="start"
      />

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
            variant: passwordErrors.password ? "error" : "default",
            allowPasswordToggle: true,
            ...registerPassword("password", {
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
              onBlur: () => triggerPassword("password"),
            }),
            message: passwordErrors.password?.message,
            showError: !!passwordErrors.password,
          },
          {
            label: "새 비밀번호 확인",
            type: "password",
            placeholder: "새 비밀번호를 다시 한 번 입력해주세요.",
            variant: passwordErrors.confirmPassword ? "error" : "default",
            allowPasswordToggle: true,
            ...registerPassword("confirmPassword", {
              required: "비밀번호 확인을 입력해주세요.",
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않습니다.",
              onBlur: () => triggerPassword("confirmPassword"),
            }),
            message: passwordErrors.confirmPassword?.message,
            showError: !!passwordErrors.confirmPassword,
          },
        ]}
        primaryButton={{
          label: "변경하기",
          onClick: handleSubmitPassword(onPasswordChangeSubmit),
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      >
        {passwordChangeError && (
          <p className="text-xs text-status-danger mt-[-8px]">
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
