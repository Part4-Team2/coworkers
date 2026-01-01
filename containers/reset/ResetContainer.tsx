"use client";

import Form from "@/app/components/Form/Form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputConfig } from "@/app/components/Form/types";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetContainer() {
  const router = useRouter();
  const [resetError, setResetError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<ResetPasswordFormData>({
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setResetError("");
    try {
      // TODO: 실제 비밀번호 재설정 API 호출
      // const response = await resetPasswordAPI(data);
      // if (response.success) {
      //   router.push("/login");
      // } else {
      //   setResetError(response.message || "비밀번호 재설정에 실패했습니다.");
      // }

      // 임시: 성공 시 로그인 페이지로 이동
      // console.log("비밀번호 재설정 시도:", data);
      router.push("/login");
    } catch (error) {
      setResetError("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <Form
        centered={false}
        topOffsetClassName="pt-80 sm:pt-120 lg:pt-140"
        onSubmit={handleSubmit(onSubmit)}
        title="비밀번호 재설정"
        register={register}
        errors={errors}
        trigger={trigger}
        input={[
          {
            name: "password",
            label: "새 비밀번호",
            placeholder:
              "비밀번호 (영문, 숫자, 특수문자 포함, 8-50자)를 입력해주세요.",
            variant: errors.password ? "error" : "default",
            size: "large",
            type: "password",
            allowPasswordToggle: true,
            full: true,
            registerOptions: {
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
            },
            message: errors.password?.message,
            showError: !!errors.password,
          } as InputConfig,
          {
            name: "confirmPassword",
            label: "비밀번호 확인",
            placeholder: "새 비밀번호를 다시 한번 입력해주세요.",
            variant: errors.confirmPassword ? "error" : "default",
            size: "large",
            type: "password",
            allowPasswordToggle: true,
            full: true,
            registerOptions: {
              required: "비밀번호 확인을 입력해주세요.",
              validate: (value: string) =>
                value === password || "비밀번호가 일치하지 않습니다.",
            },
            message: errors.confirmPassword?.message,
            showError: !!errors.confirmPassword,
          } as InputConfig,
        ]}
        option={
          resetError ? (
            <p className="w-full text-xs text-status-danger">{resetError}</p>
          ) : undefined
        }
        button={{
          label: "재설정",
          variant: "solid",
          size: "large",
          full: true,
        }}
      />
    </>
  );
}
