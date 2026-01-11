"use client";

import clsx from "clsx";
import BestArticle from "./BestArticle";
import { getArticles } from "@/api/boards";
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
    }).then((res) => setArticles(res.list));
  }, []);

  return (
    <article className="flex flex-col gap-56">
      <div className="flex justify-between items-center">
        <span className="text-text-primary text-xl">베스트 게시글</span>
      </div>
      <div
        className={clsx(
          "grid grid-cols-1 grid-rows-1 sm:grid-cols-2 lg:grid-cols-3 gap-21 max-w-1200 mx-auto"
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
              avatarImageUrl={undefined}
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
