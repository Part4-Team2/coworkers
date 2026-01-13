"use client";

import clsx from "clsx";
import ArticleComp from "./Article";
import ArticlePagination from "./ArticlePagination";
import Dropdown from "../Common/Dropdown/Dropdown";
import { getArticles } from "@/api/boards";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHeaderStore } from "@/store/headerStore";
import { Article } from "@/types/article";

const PAGE_SIZE = 6;

interface PageProps {
  page: number;
  keyword: string;
}

// 게시글 정렬 리스트입니다.
const ARRANGE: string[] = ["최신순", "좋아요 많은순"];

// 나머지 게시글이 올라가는 section 입니다.
function ArticleSection({ page, keyword }: PageProps) {
  const userId = useHeaderStore((state) => state.userId);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [totalPage, setTotalPage] = useState(0);
  const [orderBy, setOrderBy] = useState("recent");
  const [articles, setArticles] = useState<Article[]>([]);

  const currentArrange = orderBy === "recent" ? ARRANGE[0] : ARRANGE[1];

  // 페이지 바뀔 때 작동하는 함수입니다.
  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/boards?${params.toString()}`);
  };

  // 드롭다운 클릭시 작동하는 함수입니다.
  const handleDropdownClick = (value: string) => {
    const nextOrder = value === "최신순" ? "recent" : "like";
    setOrderBy(nextOrder);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`/boards?${params.toString()}`);
  };

  // 안좋은 구조다.
  useEffect(() => {
    const loadArticles = async () => {
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
        console.error("게시글 목록 불러오기 실패", error);
      }
    };
    loadArticles();
  }, [page, orderBy, keyword]);

  return (
    <article className="flex flex-col gap-32">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-2xl">게시글</span>
        <Dropdown
          options={ARRANGE}
          onSelect={handleDropdownClick}
          size="md"
          trigger="text"
          value={currentArrange}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-3 gap-21 max-w-1200 mx-auto">
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
        <div className={clsx("flex justify-center")}>
          <ArticlePagination
            page={page}
            totalPages={totalPage}
            onChange={handlePageChange}
          />
        </div>
      )}
    </article>
  );
}

export default ArticleSection;
