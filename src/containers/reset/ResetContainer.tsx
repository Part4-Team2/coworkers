"use client";

import Form from "@/components/Common/Form/Form";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { InputConfig } from "@/components/Common/Form/types";
import { patchUserResetPassword } from "@/api/user";
import { ResetPasswordBody } from "@/types/api/user";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetError, setResetError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting) return;
    setResetError("");
    setIsSubmitting(true);
    const token = searchParams.get("token");
    const requestData: ResetPasswordBody = {
      passwordConfirmation: data.confirmPassword,
      password: data.password,
      token: token || "",
    };
    // console.log(requestData);
    try {
      const response = await patchUserResetPassword(requestData);
      if ("error" in response) {
        setResetError(
          "링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요."
        );
        setIsSubmitting(false);
        return;
      }
      router.push("/");
    } catch (error) {
      setResetError("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.");
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
          disabled: isSubmitting,
          loading: isSubmitting,
        }}
      />
    </div>
  );
}
