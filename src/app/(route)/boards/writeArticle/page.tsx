"use client";

import clsx from "clsx";
import Button from "@/components/Common/Button/Button";
import Input from "@/components/Common/Input/Input";
import InputBox from "@/components/Common/Input/InputBox";
import ArticleImageUpload from "@/components/Boards/ArticleImageUpload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postArticle } from "@/lib/api/boards";
import { postImage } from "@/lib/api/image";
import { CreateArticle } from "@/types/article";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createMetadata } from "@/components/Common/Metadata/Metadata";

export const metadata = createMetadata({
  title: "자유게시판 - 글 쓰기",
  description: "동료들과 자유롭게 이야기를 나눠보세요.",
  url: "/boards/writeArticle",
  alt: "Coworkers - 자유게시판 글 쓰기",
});

interface ArticleFormData {
  title: string;
  content: string;
}

// 게시글을 작성할 수 있는 페이지입니다. (이미 작성된 페이지의 경우 수정할 수 있습니다...)
function WriteArticle() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleFormData>({
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [articleImagePreview, setArticleImagePreview] = useState<string | null>(
    null
  );
  const [articleImageFile, setArticleImageFile] = useState<File | null>(null);

  // 사용자가 이미지 파일을 올리면 url형식으로 변환합니다.
  const uploadImage = async (file: File) => {
    const res = await postImage(file);

    if (!res) throw new Error("이미지 업로드 실패");

    return res;
  };

  // 게시글 작성하고 등록하면 작동하는 함수입니다.
  const onSubmit = async (data: ArticleFormData) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let imageUrl: string | undefined = undefined;

      if (articleImageFile) {
        const res = await uploadImage(articleImageFile);
        if (res.success) {
          imageUrl = res.data.url;
        } else {
          console.error("이미지 업로드 오류", res.error);
          toast.error(res.error);
          return;
        }
      }

      const articleData: CreateArticle = {
        content: data.content,
        title: data.title,
        image: imageUrl,
      };

      const result = await postArticle(articleData);

      if (result.success) {
        toast.success("게시글이 등록되었습니다!");
        router.push("/boards");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log("게시글 작성 오류", error);
      toast.error("게시글 등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Page Wrapper
    <div className="min-h-screen bg-background-primary">
      {/* Content Wrapper */}
      <div
        className={clsx(
          "max-w-1200 mx-auto pt-56 text-text-primary",
          "px-16 sm:px-24"
        )}
      >
        <main className="flex flex-col gap-40">
          <section className="flex justify-between items-center">
            <span className="text-xl">게시글 쓰기</span>
            <div className="hidden sm:block">
              <Button
                label="등록"
                width="184px"
                onClick={handleSubmit(onSubmit)}
                loading={isLoading}
              />
            </div>
          </section>
          <div className="border-b border-b-text-primary/10"></div>
          {/* 제목 영역 */}
          <section className="flex flex-col gap-16">
            <div id="title" className="flex gap-6">
              <span className="text-brand-tertiary">*</span>제목
            </div>
            <Input
              placeholder="제목을 입력해주세요."
              width="1200"
              {...register("title", {
                required: "제목을 입력해주세요.",
                minLength: {
                  value: 1,
                  message: "제목은 최소 1글자 이상이어야 합니다.",
                },
                maxLength: {
                  value: 50,
                  message: "제목은 최대 50글자까지 입력 가능합니다.",
                },
              })}
            />
            {errors.title && (
              <p className="text-status-danger text-sm">
                {errors.title.message}
              </p>
            )}
          </section>
          {/* 내용 영역 */}
          <section className="flex flex-col gap-16">
            <div className="flex gap-6">
              <span className="text-brand-tertiary">*</span>내용
            </div>
            <InputBox
              placeholder="내용을 입력해주세요."
              maxHeight="240px"
              {...register("content", {
                required: "내용을 입력해주세요.",
                minLength: {
                  value: 1,
                  message: "내용은 최소 1글자 이상이어야 합니다.",
                },
                maxLength: {
                  value: 1000,
                  message: "내용은 최대 1000글자까지 입력 가능합니다.",
                },
              })}
              full
            />
            {errors.content && (
              <p className="text-status-danger text-sm">
                {errors.content.message}
              </p>
            )}
          </section>
          {/* 이미지 영역 */}
          <section className="flex flex-col gap-16">
            <div>이미지</div>
            <ArticleImageUpload
              image={
                typeof articleImagePreview === "string"
                  ? articleImagePreview
                  : null
              }
              onChange={(file, previewUrl) => {
                setArticleImageFile(file);
                setArticleImagePreview(previewUrl);
              }}
            />
          </section>
          <div className="sm:hidden">
            <Button
              label="등록"
              onClick={handleSubmit(onSubmit)}
              full
              loading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default WriteArticle;
