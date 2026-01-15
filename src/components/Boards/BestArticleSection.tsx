"use client";

import clsx from "clsx";
import BestArticle from "./BestArticle";
import { getArticles } from "@/lib/api/boards";
import { useEffect, useState } from "react";
import { Article } from "@/types/article";

// 베스트 게시글에 올라갈 Section입니다.
function BestArticleSection() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles({
      page: 1,
      pageSize: 3,
      orderBy: "like",
    })
      .then((res) => setArticles(res.list))
      .catch((error) => {
        console.error("베스트 게시글 불러오기 오류", error);
      });
  }, []);

  return (
    <article className="flex flex-col gap-56">
      <div className="flex justify-between items-center">
        <span className="text-text-primary text-xl">베스트 게시글</span>
      </div>
      <div
        className={clsx(
          "grid grid-cols-1 grid-rows-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-1200"
          // "grid grid-cols-[repeat(auto-fit, minmax(320px, 1fr))] gap-4"
        )}
      >
        {articles.map((article, index) => (
          //
          <div
            key={article.id}
            className={clsx(
              ["block", "sm:block hidden", "hidden lg:block"][index]
            )}
          >
            <BestArticle
              id={article.id}
              title={article.title}
              nickname={article.writer.nickname}
              createdAt={article.createdAt}
              articleImageUrl={article.image}
              likeCount={article.likeCount}
            />
          </div>
        ))}
      </div>
    </article>
  );
}

export default BestArticleSection;
