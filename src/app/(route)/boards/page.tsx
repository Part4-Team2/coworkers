"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import ButtonFloating from "../../../components/Common/Button/ButtonFloating";
import BoardInput from "../../../components/Boards/BoardInput";
import BestArticleSection from "@/components/Boards/BestArticleSection";
import ArticleSection from "@/components/Boards/ArticleSection";

function BoardPage() {
  const router = useRouter();
  const [inputVal, setInputVal] = useState("");

  // 글쓰기 버튼 누를시 글쓰기 페이지로 이동하는 함수입니다.
  const handleWriteClick = () => {
    router.push("/boards/writeArticle");
  };

  return (
    // Page Wrapper
    <div
      className={clsx(
        "min-h-screen bg-background-primary",
        "px-16 sm:px-24 lg:px-0"
      )}
    >
      {/* content wrapper */}
      <main className="max-w-1200 mx-auto py-40">
        <section className="flex flex-col gap-24 sm:gap-32 lg:gap-40">
          <div className="text-text-primary text-2xl">자유게시판</div>
          <BoardInput
            value={inputVal}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputVal(e.target.value)
            }
          />
          {/* 베스트 게시글 */}
          <BestArticleSection />
          <div className="border-b border-b-border-primary/10"></div>
          {/* 게시글 */}
          <ArticleSection />
        </section>
        <div className="fixed right-24 bottom-61 z-30">
          <ButtonFloating
            label="+ 글쓰기"
            size="large"
            onClick={handleWriteClick}
          />
        </div>
      </main>
    </div>
  );
}

export default BoardPage;
