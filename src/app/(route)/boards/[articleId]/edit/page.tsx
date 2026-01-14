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

// 게시글을 수정할 수 있는 페이지입니다.
function EditArticle() {
  const router = useRouter();

  const params = useParams<{ articleId: string }>();
  const articleId = Number(params.articleId);

  // 로딩 state는 로딩페이지 같은거 있을 때 활용하면 좋을듯
  // const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
  const handleSubmitClick = async () => {
    console.log("게시글 올라갑니다");
    if (!title.trim() || !content.trim()) return;

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
        }
      }

      await patchArticle(articleId, { content, title, image: imageUrl });
      router.push("/boards");
    } catch (error) {
      console.log("게시글 작성 오류", error);
    }
  };

  // 수정의 경우 useEffect가 실행이됩니다.
  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const article = await getArticle({ articleId });
        setTitle(article.title);
        setContent(article.content);
        setArticleImagePreview(article.image ?? null);
      } catch (error) {
        console.error(error);
        alert("게시글 갖고오기 오류, 다시 자유게시판으로 돌아갑니다."); // 오류 처리는 나중에 toast로 대체 예정
        router.replace("/boards");
        return;
      }
    };

    fetchArticle();
  }, [articleId, router]);

  return (
    // Page Wrapper
    <div className="min-h-screen bg-background-primary">
      {/* Content Wrapper */}
      <div
        className={clsx(
          "max-w-1200 mx-auto py-56 text-text-primary",
          "px-20 lg:px-0"
        )}
      >
        <main className="flex flex-col gap-40">
          <section className="flex justify-between items-center">
            <span className="text-xl">게시글 수정하기</span>
            <div className="hidden sm:block">
              <Button label="등록" width="184px" onClick={handleSubmitClick} />
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </section>
          {/* 내용 영역 */}
          <section className="flex flex-col gap-16">
            <div className="flex gap-6">
              <span className="text-brand-tertiary">*</span>내용
            </div>
            <InputBox
              placeholder="내용을 입력해주세요."
              maxHeight="240px"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              full
            />
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
          <div className="flex justify-center sm:hidden">
            <Button label="등록" onClick={handleSubmitClick} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditArticle;
