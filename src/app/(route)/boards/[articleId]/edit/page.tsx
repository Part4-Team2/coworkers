"use client";

import clsx from "clsx";
import Button from "@/components/Common/Button/Button";
import Input from "@/components/Common/Input/Input";
import InputBox from "@/components/Common/Input/InputBox";
import ArticleImageUpload from "@/components/Boards/ArticleImageUpload";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { patchArticle, getArticle } from "@/lib/api/boards";
import { postImage } from "@/lib/api/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface ArticleFormData {
  title: string;
  content: string;
}

// 게시글을 수정할 수 있는 페이지입니다.
function EditArticle() {
  const router = useRouter();

  const params = useParams<{ articleId: string }>();
  const articleId = Number(params.articleId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
      // 이미 기존 사진이 있는 경우 그대로 갑니다.
      let imageUrl: string | null = articleImagePreview;

      // 만약 게시글 사진을 바꾸는 경우 해당 분기점을 거칩니다.
      if (articleImageFile) {
        const res = await uploadImage(articleImageFile);
        if ("url" in res) {
          imageUrl = res.url;
        } else {
          console.error("이미지 업로드 오류", res.message);
          toast.error("이미지 업로드에 실패했습니다.");
        }
      }

      await patchArticle(articleId, {
        content: data.content,
        title: data.title,
        image: imageUrl,
      });

      toast.success("게시글이 수정되었습니다!");
      router.push("/boards");
    } catch (error) {
      console.log("게시글 수정 오류", error);
      toast.error("게시글 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 수정의 경우 useEffect가 실행이됩니다.
  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const article = await getArticle({ articleId });
        setValue("title", article.title);
        setValue("content", article.content);
        setArticleImagePreview(article.image ?? null);
      } catch (error) {
        console.error(error);
        toast.error("게시글을 불러올 수 없습니다.");
        router.replace("/boards");
        return;
      }
    };

    fetchArticle();
  }, [articleId, router, setValue]);

  return (
    // Page Wrapper
    <div className="min-h-screen bg-background-primary">
      {/* Content Wrapper */}
      <div
        className={clsx(
          "max-w-1200 mx-auto py-56 text-text-primary",
          "px-16 sm:px-24"
        )}
      >
        <main className="flex flex-col gap-40">
          <section className="flex justify-between items-center">
            <span className="text-xl">게시글 수정하기</span>
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

export default EditArticle;
