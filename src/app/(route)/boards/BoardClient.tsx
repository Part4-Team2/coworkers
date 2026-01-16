"use client";

import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ButtonFloating from "../../../components/Common/Button/ButtonFloating";
import BoardInput from "../../../components/Boards/BoardInput";
import BestArticleSection from "@/components/Boards/BestArticleSection";
import ArticleSection from "@/components/Boards/ArticleSection";

function BoardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const keyword = searchParams.get("keyword") ?? "";
  const orderBy = searchParams.get("orderBy") ?? "recent";

  const [inputVal, setInputVal] = useState("");

  // 글쓰기 버튼 누를시 글쓰기 페이지로 이동하는 함수입니다.
  const handleWriteClick = () => {
    router.push("/boards/writeArticle");
  };

  // 상단 키워드 검색 버튼입니다.
  const handleSearchClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    const val = inputVal.trim();

    if (val) {
      params.set("keyword", val);
    } else {
      params.delete("keyword");
    }

    params.set("page", "1");
    params.set("orderBy", "recent");
    router.push(`/boards?${params.toString()}`);
  };

  return (
    // Page Wrapper
    <div
      className={clsx("min-h-screen bg-background-primary", "px-16 sm:px-24")}
    >
      {/* content wrapper */}
      <main className="max-w-1200 mx-auto py-40">
        <section className="flex flex-col gap-24 sm:gap-32 lg:gap-40">
          <div className="text-text-primary text-2xl">자유게시판</div>
          {/* 검색 영역 */}
          <div className="flex max-w-1200 gap-8 lg:justify-between">
            <BoardInput
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button
              className={clsx(
                "w-full min-w-0 max-w-100",
                "hover:bg-background-tertiary bg-background-secondary",
                "rounded-xl border border-text-primary/10",
                "text-text-primary text-base cursor-pointer"
              )}
              onClick={handleSearchClick}
            >
              검색
            </button>
          </div>
          {/* 베스트 게시글 */}
          <BestArticleSection />
          <div className="border-b border-b-border-primary/10"></div>
          {/* 게시글 */}
          <ArticleSection keyword={keyword} page={page} orderBy={orderBy} />
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

export default BoardClient;
