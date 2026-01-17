"use client";

import Form from "@/components/Common/Form/Form";
import Input from "@/components/Common/Input/Input";
import Button from "@/components/Common/Button/Button";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { patchUserResetPassword } from "@/lib/api/user";
import { ResetPasswordBody } from "@/lib/types/user";
import { showErrorToast, showSuccessToast } from "@/utils/error";

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
    getValues,
    trigger,
  } = useForm<ResetPasswordFormData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (isSubmitting) return;
    setResetError("");
    setIsSubmitting(true);
    const token = searchParams.get("token");
    if (!token) {
      const errorMessage =
        "링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요.";
      setResetError(errorMessage);
      showErrorToast(errorMessage);
      setIsSubmitting(false);
      return;
    }
    const requestData: ResetPasswordBody = {
      passwordConfirmation: data.confirmPassword,
      password: data.password,
      token: token,
    };
    try {
      const response = await patchUserResetPassword(requestData);
      if (!response.success) {
        const errorMessage =
          "링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요.";
        setResetError(errorMessage);
        showErrorToast(errorMessage);
        setIsSubmitting(false);
        return;
      }
      showSuccessToast("비밀번호 재설정에 성공했습니다.");
      router.push("/login");
    } catch (error) {
      const errorMessage = "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.";
      setResetError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-16 sm:px-24 lg:px-0">
      <div className="w-full max-w-600 flex flex-col items-center">
        <Form
          centered={false}
          topOffsetClassName="pt-80 sm:pt-120 lg:pt-140"
          onSubmit={handleSubmit(onSubmit)}
          title="비밀번호 재설정"
        >
          <div className="w-full flex flex-col items-center gap-24 mt-24">
            <div className="w-full">
              <Input
                full
                label="새 비밀번호"
                placeholder="비밀번호 (영문, 숫자, 특수문자 포함, 8-50자)를 입력해주세요."
                variant={errors.password ? "error" : "default"}
                size="large"
                type="password"
                allowPasswordToggle={true}
                message={errors.password?.message}
                showError={!!errors.password}
                {...register("password", {
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
                })}
              />
            </div>
            <div className="w-full">
              <Input
                full
                label="비밀번호 확인"
                placeholder="새 비밀번호를 다시 한번 입력해주세요."
                variant={errors.confirmPassword ? "error" : "default"}
                size="large"
                type="password"
                allowPasswordToggle={true}
                message={errors.confirmPassword?.message}
                showError={!!errors.confirmPassword}
                {...register("confirmPassword", {
                  required: "비밀번호 확인을 입력해주세요.",
                  validate: (value: string) =>
                    value === getValues("password") ||
                    "비밀번호가 일치하지 않습니다.",
                })}
              />
            </div>
          </div>
          {resetError && (
            <div className="mt-12 w-full flex justify-center">
              <p className="w-full text-xs text-status-danger">{resetError}</p>
            </div>
          )}
          <div className="mt-40 w-full flex justify-center">
            <Button
              full
              label="재설정"
              variant="solid"
              size="large"
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
