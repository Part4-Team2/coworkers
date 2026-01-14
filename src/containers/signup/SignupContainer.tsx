"use client";

import SocialForm from "@/components/Common/Form/SocialForm";
import Form from "@/components/Common/Form/Form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHeaderStore } from "@/store/headerStore";
import { InputConfig } from "@/components/Common/Form/types";
import { postSignup } from "@/lib/api/auth";
import { SignUpRequestBody } from "@/lib/types/auth";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupContainer() {
  const router = useRouter();
  const fetchUser = useHeaderStore((s) => s.fetchUser);
  const [signupError, setSignupError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SignupFormData>({
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    if (isSubmitting) return;
    const requestData: SignUpRequestBody = {
      email: data.email,
      password: data.password,
      passwordConfirmation: data.confirmPassword,
      nickname: data.name,
    };
    setSignupError("");
    setIsSubmitting(true);
    try {
      const response = await postSignup(requestData);

      if ("error" in response) {
        setSignupError(response.message);
        setIsSubmitting(false);
        return;
      }

      await fetchUser();
      router.push("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "회원가입에 실패했습니다. 다시 시도해주세요.";
      setSignupError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoSignup = () => {
    // TODO: 카카오 회원가입 구현
    // console.log("카카오 회원가입");
    // router.push("/oauth/signup/kakao");
  };

  return (
    <div className="w-full flex flex-col items-center gap-16 sm:gap-20 lg:gap-24 pb-24 sm:pb-32 px-16 sm:px-0">
      <Form
        centered={false}
        topOffsetClassName="pt-40 sm:pt-56 lg:pt-64"
        onSubmit={handleSubmit(onSubmit)}
        title="회원가입"
        register={register}
        errors={errors}
        trigger={trigger}
        input={[
          {
            name: "name",
            label: "이름",
            placeholder: "이름을 입력해주세요.",
            variant: errors.name ? "error" : "default",
            size: "large",
            type: "text",
            full: true,
            registerOptions: {
              required: "이름은 필수 입력입니다.",
              maxLength: {
                value: 20,
                message: "이름은 최대 20자까지 가능합니다.",
              },
            },
            message: errors.name?.message,
            showError: !!errors.name,
          } as InputConfig,
          {
            name: "email",
            label: "이메일",
            placeholder: "이메일을 입력해주세요.",
            variant: errors.email ? "error" : "default",
            size: "large",
            type: "email",
            full: true,
            registerOptions: {
              required: "이메일은 필수 입력입니다.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "이메일 형식으로 작성해 주세요.",
              },
            },
            message: errors.email?.message,
            showError: !!errors.email,
          } as InputConfig,
          {
            name: "password",
            label: "비밀번호",
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
            placeholder: "비밀번호를 다시 한번 입력해주세요.",
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
          signupError ? (
            <p className="w-full text-xs text-status-danger">{signupError}</p>
          ) : undefined
        }
        button={{
          label: "회원가입",
          variant: "solid",
          size: "large",
          full: true,
          disabled: isSubmitting,
          loading: isSubmitting,
        }}
      />
      <SocialForm text="간편 회원가입하기" onKakao={handleKakaoSignup} />
    </div>
  );
}
