"use client";

import Form from "@/components/Common/Form/Form";
import Link from "next/link";
import FormFooter from "@/components/Common/Form/FormFooter";
import SocialForm from "@/components/Common/Form/SocialForm";
import Modal from "@/components/Common/Modal/Modal";
import Input from "@/components/Common/Input/Input";
import Button from "@/components/Common/Button/Button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/store/headerStore";
import { useApiMutation } from "@/hooks/useApiMutation";
import { postSignin } from "@/lib/api/auth";
import { postUserResetPassword } from "@/lib/api/user";
import { SignInRequestBody } from "@/lib/types/auth";
import { SendResetPasswordEmailRequest } from "@/lib/types/user";
import { showErrorToast, showSuccessToast } from "@/utils/error";
// login, signup은 API route가 아니라 서버 액션으로 구현
interface LoginFormData {
  email: string;
  password: string;
}

interface ResetPasswordFormData {
  email: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function LoginContainer() {
  const router = useRouter();
  const fetchUser = useHeaderStore((s) => s.fetchUser);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string>("");
  const [resetError, setResetError] = useState<string>("");
  const { mutate: mutateLogin, isLoading: isSubmittingLogin } =
    useApiMutation();
  const { mutate: mutateReset, isLoading: isSubmittingReset } =
    useApiMutation();
  const isSubmitting = isSubmittingLogin || isSubmittingReset;

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
    setError: setResetErrorField,
  } = useForm<ResetPasswordFormData>({
    mode: "onBlur",
  });

  const handleClose = () => {
    setOpenModal(null);
    setLoginError("");
    setResetError("");
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoginError("");
    const requestData: SignInRequestBody = {
      email: data.email,
      password: data.password,
    };

    await mutateLogin(async () => {
      const response = await postSignin(requestData);
      if (!response.success) {
        const errorMessage = "이메일 혹은 비밀번호를 확인해주세요.";
        setLoginError(errorMessage);
        showErrorToast(errorMessage);
        setError("email", { type: "manual", message: "" });
        setError("password", { type: "manual", message: "" });
        throw new Error(errorMessage);
      }
      await fetchUser();
      showSuccessToast("로그인에 성공했습니다.");
      router.push("/");
      return response;
    });
  };

  const onResetSubmit = async (data: ResetPasswordFormData) => {
    const requestData: SendResetPasswordEmailRequest = {
      email: data.email,
      redirectUrl: APP_URL,
    };
    setResetError("");

    await mutateReset(async () => {
      const response = await postUserResetPassword(requestData);
      if (!response.success) {
        // "User not found" 에러 메시지를 "회원가입되지 않은 이메일입니다."로 변경
        let errorMessage =
          response.error || "비밀번호 재설정 이메일 전송에 실패했습니다.";
        if (errorMessage.toLowerCase().includes("user not found")) {
          errorMessage = "회원가입되지 않은 이메일입니다.";
        }

        setResetError(errorMessage);
        showErrorToast(errorMessage);
        // 인풋에도 에러 표시
        setResetErrorField("email", {
          type: "manual",
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }
      showSuccessToast("비밀번호 재설정 링크를 이메일로 보냈습니다.");
      handleClose();
      return response;
    }).catch(() => {
      if (!resetError) {
        const errorMessage = "링크를 보내는데 실패했습니다. 다시 시도해주세요.";
        setResetError(errorMessage);
        showErrorToast(errorMessage);
        setResetErrorField("email", {
          type: "manual",
          message: errorMessage,
        });
      }
    });
  };

  const handleKakaoLogin = async () => {
    // 카카오 OAuth 인증 URL로 리다이렉트
    const redirectUri = `${APP_URL}/oauth/kakao`;
    const state = Math.random().toString(36).substring(2, 15); // CSRF 방지를 위한 state

    const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    if (!kakaoClientId) {
      console.error("카카오 REST API 키가 설정되지 않았습니다.");
      alert("카카오 로그인 설정이 필요합니다.");
      return;
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;

    // 카카오 인증 페이지로 리다이렉트
    window.location.href = kakaoAuthUrl;
  };

  return (
    <>
      <div className="w-full flex flex-col items-center pb-24 sm:pb-32 px-16 sm:px-0">
        <Form
          centered={false}
          topOffsetClassName="pt-40 sm:pt-56 lg:pt-64"
          onSubmit={handleSubmit(onSubmit)}
          title="로그인"
        >
          <div className="w-full flex flex-col items-center gap-24 mt-24">
            <div className="w-full">
              <Input
                full
                label="이메일"
                placeholder="이메일을 입력해주세요."
                variant={errors.email || loginError ? "error" : "default"}
                size="large"
                type="email"
                message={errors.email?.message || (loginError ? "" : undefined)}
                showError={!!errors.email || !!loginError}
                {...register("email", {
                  required: "이메일은 필수 입력입니다.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "이메일 형식으로 작성해 주세요.",
                  },
                })}
              />
            </div>
            <div className="w-full">
              <Input
                full
                label="비밀번호"
                placeholder="비밀번호 (영문, 숫자, 특수문자 포함, 8-50자)를 입력해주세요."
                variant={errors.password || loginError ? "error" : "default"}
                size="large"
                type="password"
                allowPasswordToggle={true}
                message={
                  errors.password?.message || (loginError ? "" : undefined)
                }
                showError={!!errors.password || !!loginError}
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
          </div>
          <div className="mt-12 w-full flex justify-start">
            <div className="flex flex-col gap-4 w-full">
              {loginError && (
                <p className="text-xs text-status-danger">{loginError}</p>
              )}
              <div
                onClick={() => setOpenModal("password-reset")}
                className="text-sm text-emerald-500 underline cursor-pointer self-end"
              >
                비밀번호를 잊으셨나요?
              </div>
            </div>
          </div>
          <div className="mt-40 w-full flex justify-center">
            <Button
              full
              label="로그인"
              variant="solid"
              size="large"
              type="submit"
              disabled={isSubmittingLogin}
              loading={isSubmittingLogin}
            />
          </div>
        </Form>
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
        <SocialForm text="간편 로그인하기" onKakao={handleKakaoLogin} />
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
          variant: resetErrors.email || resetError ? "error" : "default",
          ...registerReset("email", {
            required: "이메일은 필수 입력입니다.",
            minLength: {
              value: 1,
              message: "이메일은 필수 입력입니다.",
            },
            maxLength: {
              value: 150,
              message: "이메일은 최대 150자까지 가능합니다.",
            },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "이메일 형식으로 작성해 주세요.",
            },
          }),
          showError: !!resetErrors.email || !!resetError,
        }}
        primaryButton={{
          label: "링크 보내기",
          onClick: handleSubmitReset(onResetSubmit),
          disabled: isSubmittingReset,
          loading: isSubmittingReset,
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      >
        {resetError && (
          <p className="text-xs text-status-danger">{resetError}</p>
        )}
      </Modal>
    </>
  );
}
