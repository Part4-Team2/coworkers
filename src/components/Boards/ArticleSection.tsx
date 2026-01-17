"use client";

import clsx from "clsx";
import ArticleComp from "./Article";
import ArticlePagination from "./ArticlePagination";
import BoardListSkeleton from "../Common/Skeleton/BoardListSkeleton";
import Dropdown from "../Common/Dropdown/Dropdown";
import { useSearchParams, useRouter } from "next/navigation";
import { useHeaderStore } from "@/store/headerStore";
import { Article } from "@/types/article";

interface PageProps {
  articles: Article[];
  page: number;
  totalPage: number;
  keyword: string;
  orderBy: string;
  isLoading: boolean;
  isError: Error | null;
  onPageChange: (nextPage: number) => void;
}

// 게시글 정렬 방식.
const ARRANGE: string[] = ["최신순", "좋아요 많은순"];

// 나머지 게시글이 올라가는 section 입니다.
function ArticleSection({
  articles,
  page,
  totalPage,
  keyword,
  orderBy,
  isLoading,
  isError,
  onPageChange,
}: PageProps) {
  const userId = useHeaderStore((state) => state.userId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ordering = orderBy === "recent" ? ARRANGE[0] : ARRANGE[1];

  // 드롭다운 클릭시 작동하는 함수입니다.
  const handleDropdownClick = (value: string) => {
    const nextOrder = value === "최신순" ? "recent" : "like";

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("orderBy", nextOrder);
    router.push(`/boards?${params.toString()}`);
  };

  // 로딩중
  if (isLoading) {
    return <BoardListSkeleton showBestArticles={false} />;
  }

  // 게시글 에러
  if (isError) {
    return (
      <div className="flex justify-center items-center">
        게시글을 불러오지 못했습니다.
      </div>
    );
  }

  // 키워드 검색 실패
  if (articles.length === 0) {
    return (
      <div className="flex justify-center items-center">
        {keyword
          ? `&quot;${keyword}&quot; 검색 결과가 없습니다.`
          : "게시글이 없습니다."}
      </div>
    );
  }

  return (
    <article className="flex flex-col gap-32">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-2xl">게시글</span>
        <Dropdown
          options={ARRANGE}
          onSelect={handleDropdownClick}
          size="lg"
          trigger="text"
          value={ordering}
          listPosition="top-full right-0"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-3 gap-10 max-w-1200">
        {articles.map((article) => {
          if (typeof article.id !== "number") return null;
          return (
            <ArticleComp
              key={article.id}
              article={article}
              currentUserId={userId}
            />
          );
        })}
      </div>
      {totalPage > 0 && (
        <div className={clsx("flex justify-center pb-40")}>
          <ArticlePagination
            page={page}
            totalPages={totalPage}
            onChange={onPageChange}
          />
        </div>
      )}
    </article>
  );
}

export default ArticleSection;
