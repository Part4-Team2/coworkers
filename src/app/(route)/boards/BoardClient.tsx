"use client";

import clsx from "clsx";
import { Article } from "@/types/article";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getArticles } from "@/lib/api/boards";
import ButtonFloating from "../../../components/Common/Button/ButtonFloating";
import BoardInput from "../../../components/Boards/BoardInput";
import BestArticleSection from "@/components/Boards/BestArticleSection";
import ArticleSection from "@/components/Boards/ArticleSection";

const PAGE_SIZE = 6;

function BoardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawpage = Number(searchParams.get("page"));
  // 음수이거나 0보다 낮은 숫자일 때 1로 리턴합니다.
  const page = Number.isInteger(rawpage) && rawpage > 0 ? rawpage : 1;

  const keyword = searchParams.get("keyword") ?? "";
  const orderBy = searchParams.get("orderBy") ?? "recent";

  const [inputVal, setInputVal] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  // 게시글을 불러오는 함수입니다.
  useEffect(() => {
    if (totalPage > 0 && page > totalPage) return;

    const loadArticles = async () => {
      setIsLoading(true);
      setIsError(null);

      try {
        const res = await getArticles({
          page,
          pageSize: PAGE_SIZE,
          orderBy,
          keyword: keyword || undefined,
        });
        setArticles(res.list);
        setTotalPage(Math.ceil(res.totalCount / PAGE_SIZE));
      } catch (error) {
        setArticles([]);
        setTotalPage(0);
        console.error("게시글 목록 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, [page, orderBy, keyword]);

  // 페이지가 전체 페이지를 초과하는 경우 마지막 페이지로 대체됩니다.
  useEffect(() => {
    if (totalPage > 0 && page > totalPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(totalPage));
      params.set("orderBy", "recent");

      router.replace(`/boards?${params.toString()}`);
    }
  }, [page, totalPage]);

  // 페이지 바뀔 때 작동하는 함수입니다.
  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    params.set("orderBy", orderBy);
    router.push(`/boards?${params.toString()}`);
  };

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
          <ArticleSection
            articles={articles}
            keyword={keyword}
            page={page}
            totalPage={totalPage}
            orderBy={orderBy}
            isLoading={isLoading}
            isError={isError}
            onPageChange={handlePageChange}
          />
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
