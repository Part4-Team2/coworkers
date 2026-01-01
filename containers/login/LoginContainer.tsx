"use client";

import Form from "@/app/components/Form/Form";
import Link from "next/link";
import FormFooter from "@/app/components/Form/FormFooter";
import SocialForm from "@/app/components/Form/SocialForm";
import Modal from "@/app/components/Modal/Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { InputConfig } from "@/app/components/Form/types";

interface LoginFormData {
  email: string;
  password: string;
}

interface ResetPasswordFormData {
  email: string;
}

export default function LoginContainer() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
  } = useForm<LoginFormData>({
    mode: "onBlur",
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordFormData>({
    mode: "onBlur",
  });

  const handleClose = () => {
    setOpenModal(null);
    setLoginError("");
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoginError("");
    try {
      // TODO: 실제 로그인 API 호출
      // const response = await loginAPI(data);
      // if (response.success) {
      //   router.push("/");
      // } else {
      //   setError("email", { type: "manual", message: "" });
      //   setError("password", { type: "manual", message: "" });
      //   setLoginError("이메일 혹은 비밀번호를 확인해주세요.");
      // }

      // 임시: 성공 시 홈으로 이동
      // console.log("로그인 시도:", data);
      router.push("/");
    } catch (error) {
      setError("email", { type: "manual", message: "" });
      setError("password", { type: "manual", message: "" });
      setLoginError("이메일 혹은 비밀번호를 확인해주세요.");
    }
  };

  const onResetSubmit = async (data: ResetPasswordFormData) => {
    try {
      // TODO: 실제 비밀번호 재설정 API 호출
      // console.log("비밀번호 재설정 링크 보내기:", data.email);
      handleClose();
    } catch (error) {
      // console.error("비밀번호 재설정 실패:", error);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: 구글 로그인 구현
    // console.log("구글 로그인");
    // router.push("/oauth/login/google");
  };

  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 구현
    // console.log("카카오 로그인");
    // router.push("/oauth/login/kakao");
  };

  return (
    <>
      <div className="w-full flex flex-col items-center pb-24 sm:pb-32 px-16 sm:px-0">
        <Form
          centered={false}
          topOffsetClassName="pt-40 sm:pt-56 lg:pt-64"
          onSubmit={handleSubmit(onSubmit)}
          title="로그인"
          register={register}
          errors={errors}
          trigger={trigger}
          input={[
            {
              name: "email",
              label: "이메일",
              placeholder: "이메일을 입력해주세요.",
              variant: errors.email || loginError ? "error" : "default",
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
              message: errors.email?.message || (loginError ? "" : undefined),
              showError: !!errors.email || !!loginError,
            } as InputConfig,
            {
              name: "password",
              label: "비밀번호",
              placeholder:
                "비밀번호 (영문, 숫자, 특수문자 포함, 8-50자)를 입력해주세요.",
              variant: errors.password || loginError ? "error" : "default",
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
              message:
                errors.password?.message || (loginError ? "" : undefined),
              showError: !!errors.password || !!loginError,
            } as InputConfig,
          ]}
          optionAlign="end"
          option={
            <>
              {loginError && (
                <p className="text-xs text-status-danger">{loginError}</p>
              )}
              <div
                onClick={() => setOpenModal("password-reset")}
                className="text-sm text-emerald-500 underline cursor-pointer"
              >
                비밀번호를 잊으셨나요?
              </div>
            </>
          }
          button={{
            label: "로그인",
            variant: "solid",
            size: "large",
            full: true,
          }}
        />
        <FormFooter>
          <span className="text-xs sm:text-sm text-text-primary">
            아직 계정이 없으신가요?
            <Link
              href="/signup"
              className="text-emerald-500 underline cursor-pointer px-8 sm:px-12"
            >
              가입하기
            </Link>
          </span>
        </FormFooter>
        <SocialForm
          text="간편 로그인하기"
          onGoogle={handleGoogleLogin}
          onKakao={handleKakaoLogin}
        />
      </div>
      {/* 비밀번호 재설정 모달 */}
      <Modal
        isOpen={openModal === "password-reset"}
        onClose={handleClose}
        title="비밀번호 재설정"
        description="비밀번호 재설정 링크를 보내드립니다."
        input={{
          label: "이메일",
          placeholder: "이메일을 입력하세요.",
          type: "email",
          variant: resetErrors.email ? "error" : "default",
          ...registerReset("email", {
            required: "이메일은 필수 입력입니다.",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "이메일 형식으로 작성해 주세요.",
            },
          }),
          message: resetErrors.email?.message,
          showError: !!resetErrors.email,
        }}
        primaryButton={{
          label: "링크 보내기",
          onClick: handleSubmitReset(onResetSubmit),
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      />
    </>
  );
}
