"use client";

import clsx from "clsx";
import ArticleComp from "./Article";
import ArticlePagination from "./ArticlePagination";
import Dropdown from "../Common/Dropdown/Dropdown";
import { getArticles } from "@/api/boards";
import { useEffect, useState } from "react";
import { Article } from "@/types/article";

const PAGE_SIZE = 6;

// 게시글 정렬 리스트입니다.
const ARRANGE: string[] = ["최신순", "좋아요 많은순"];

// 나머지 게시글이 올라가는 section 입니다.
function ArticleSection() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [orderBy, setOrderBy] = useState("recent");
  const [articles, setArticles] = useState<Article[]>([]);

  const currentArrange = orderBy === "recent" ? ARRANGE[0] : ARRANGE[1];

  // 드롭다운 클릭시 작동하는 함수입니다.
  const handleDropdownClick = (value: string) => {
    setPage(1);
    if (value === "최신순") setOrderBy("recent");
    else setOrderBy("like");
  };

  useEffect(() => {
    getArticles({
      page,
      pageSize: PAGE_SIZE,
      orderBy,
    }).then((res) => {
      setArticles(res.list);
      setTotalPage(Math.ceil(res.totalCount / PAGE_SIZE));
    });
  }, [page, orderBy]);

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
              id={article.id}
              key={article.id}
              title={article.title}
              writer={article.writer}
              createdAt={article.createdAt}
              avatarImageUrl={undefined}
              articleImageUrl={article.image}
              likeCount={article.likeCount}
            />
          );
        })}
      </div>
      <div className={clsx("flex justify-center")}>
        <ArticlePagination
          page={page}
          totalPages={totalPage}
          onChange={setPage}
        />
      </div>
    </article>
  );
}

export default ArticleSection;
