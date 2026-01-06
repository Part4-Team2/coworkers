"use client";

import React, { useState } from "react";
import Form from "@/components/Common/Form/Form";
import FormFooter from "@/components/Common/Form/FormFooter";
import Avatar from "@/components/Common/Avatar/Avatar";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { trace } from "@opentelemetry/api";
import { InputConfig } from "@/components/Common/Form/types";
import { useImageUpload } from "@/hooks/useImageUpload";

interface EditTeamFormData {
  teamName: string;
}

interface EditTeamContainerProps {
  teamId: string;
  initialData?: {
    teamName: string;
    profileImage?: string;
  };
}

interface UploadResponse {
  url: string;
}

export default function EditTeamContainer({
  teamId,
  initialData,
}: EditTeamContainerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    previewUrl,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    selectedFile,
  } = useImageUpload(initialData?.profileImage);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
  } = useForm<EditTeamFormData>({
    mode: "onBlur",
    defaultValues: {
      teamName: initialData?.teamName || "",
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const tracer = trace.getTracer("coworkers-upload");

    return await tracer.startActiveSpan("upload-team-image", async (span) => {
      // 파일 메타데이터 추가
      const fileSizeKB = Math.round(file.size / 1024);
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);

      span.setAttribute("upload.file_type", file.type);
      span.setAttribute("upload.file_size_kb", fileSizeKB);
      span.setAttribute("upload.file_size_mb", fileSizeMB);
      span.setAttribute("upload.team_id", teamId);
      span.setAttribute("upload.file_name", file.name);

      console.log("🔍 [OpenTelemetry] 이미지 업로드 시작:", {
        fileName: file.name,
        fileType: file.type,
        sizeKB: fileSizeKB,
        sizeMB: fileSizeMB,
        teamId,
      });

      const formData = new FormData();
      formData.append("image", file);

      try {
        const startTime = performance.now();

        const response = await fetch(`/${teamId}/images/upload`, {
          method: "POST",
          body: formData,
        });

        const uploadTime = Math.round(performance.now() - startTime);
        span.setAttribute("upload.duration_ms", uploadTime);
        span.setAttribute("upload.http_status", response.status);

        if (!response.ok) {
          // 개발 환경: API 미구현 시 blob URL 사용
          if (response.status === 404) {
            console.warn("⚠️ [OpenTelemetry] API 미구현, 미리보기 URL 사용");
            span.setAttribute("upload.fallback_mode", "preview_url");
            span.setStatus({ code: 1, message: "Using preview URL fallback" });

            if (!previewUrl) {
              throw new Error("미리보기 이미지를 사용할 수 없습니다.");
            }
            span.end();
            return previewUrl;
          }
          span.setStatus({
            code: 2,
            message: `Upload failed with status ${response.status}`,
          });
          throw new Error(`이미지 업로드 실패: ${response.status}`);
        }

        const data: UploadResponse = await response.json();
        if (!data.url) {
          span.setStatus({ code: 2, message: "No URL in response" });
          throw new Error("업로드된 이미지 URL을 받지 못했습니다.");
        }

        // 성공 메타데이터
        const speedKbps = Math.round((fileSizeKB / uploadTime) * 1000);
        span.setAttribute("upload.success", true);
        span.setAttribute("upload.result_url", data.url);
        span.setAttribute("upload.speed_kbps", speedKbps);
        span.setStatus({ code: 0, message: "Upload successful" });

        console.log("✅ [OpenTelemetry] 이미지 업로드 성공:", {
          duration: `${uploadTime}ms`,
          speed: `${speedKbps} KB/s`,
          status: response.status,
          url: data.url,
        });

        return data.url;
      } catch (error) {
        // 네트워크 에러 (API 서버 없음) - 개발 환경
        if (
          error instanceof TypeError &&
          error.message.includes("Failed to fetch")
        ) {
          console.warn("⚠️ [OpenTelemetry] 네트워크 에러, 미리보기 URL 사용");
          span.setAttribute("upload.fallback_mode", "network_error");
          span.recordException(error);
          span.setStatus({ code: 1, message: "Network error, using fallback" });

          if (!previewUrl) {
            throw new Error("미리보기 이미지를 사용할 수 없습니다.");
          }
          span.end();
          return previewUrl;
        }

        // 기타 에러
        console.error("❌ [OpenTelemetry] 이미지 업로드 실패:", error);
        span.recordException(error as Error);
        span.setStatus({ code: 2, message: "Upload failed with exception" });
        throw error;
      } finally {
        span.end();
      }
    });
  };

  const onSubmit = async (data: EditTeamFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let uploadedImageUrl = initialData?.profileImage;

      // 새 이미지가 선택된 경우 업로드
      if (selectedFile) {
        uploadedImageUrl = await uploadImage(selectedFile);
      }

      const updateData = {
        ...data,
        profileImage: uploadedImageUrl,
      };

      // TODO: 실제 팀 수정 API 호출
      // const response = await updateTeamAPI(teamId, updateData);
      // if (response.success) {
      //   router.push(`/${teamId}`);
      // } else if (response.error === "duplicate") {
      //   setError("teamName", {
      //     type: "manual",
      //     message: "이미 존재하는 이름입니다.",
      //   });
      //   return;
      // }

      // 임시: 성공 시 팀 페이지로 이동
      console.log("팀 수정 시도:", { teamId, ...updateData });
      router.push(`/${teamId}`);
    } catch (error) {
      console.error("팀 수정 실패:", error);

      // 에러 메시지 개선
      const errorMessage =
        error instanceof Error ? error.message : "팀 수정에 실패했습니다.";

      setError("teamName", {
        type: "manual",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
        profile={
          <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-8">
            <label className="text-sm sm:text-md text-text-primary">
              팀 프로필
            </label>
            <div className="relative inline-block w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
              <Avatar
                imageUrl={previewUrl}
                altText="팀 프로필"
                size="xlarge"
                isEditable={true}
                onEditClick={handleImageClick}
              />
            </div>
          </div>
        }
        register={register}
        errors={errors}
        trigger={trigger}
        input={[
          {
            name: "teamName",
            label: "팀 이름",
            placeholder: "팀 이름을 입력해주세요.",
            variant: errors.teamName ? "error" : "default",
            size: "large",
            type: "text",
            full: true,
            registerOptions: {
              required: "팀 이름은 필수 입력입니다.",
              maxLength: {
                value: 30,
                message: "팀 이름은 30자 이하로 입력해주세요.",
              },
            },
            message: errors.teamName?.message,
            showError: !!errors.teamName,
          } as InputConfig,
        ]}
        button={{
          label: isSubmitting ? "수정 중..." : "수정하기",
          variant: "solid",
          size: "large",
          full: true,
          disabled: isSubmitting,
        }}
      />
      <FormFooter>
        <span className="text-sm sm:text-md">
          팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
        </span>
      </FormFooter>
    </>
  );
}
