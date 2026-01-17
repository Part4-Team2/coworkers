"use client";

import clsx from "clsx";
import BestArticle from "./BestArticle";
import CardSkeleton from "../Common/Skeleton/CardSkeleton";
import { getArticles } from "@/lib/api/boards";
import { useEffect, useState } from "react";
import { Article } from "@/types/article";

// 베스트 게시글에 올라갈 Section입니다.
function BestArticleSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBestArticles = async (ignore: { current: boolean }) => {
    try {
      const res = await getArticles({
        page: 1,
        pageSize: 3,
        orderBy: "like",
      });

      if (ignore.current) return;
      setArticles(res.list);
    } catch (error) {
      if (ignore.current) return;
      console.error("베스트 게시글 불러오기 오류", error);
    } finally {
      if (!ignore.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    const ignore = { current: false };
    fetchBestArticles(ignore);
    return () => {
      ignore.current = true;
    };
  }, []);

  return (
    <article className="flex flex-col gap-56">
      <div className="flex justify-between items-center">
        <span className="text-text-primary text-xl">베스트 게시글</span>
      </div>
      <div
        className={clsx(
          "grid grid-cols-1 grid-rows-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-1200"
        )}
      >
        {isLoading
          ? // 로딩 중 - 스켈레톤 3개 표시
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={clsx(
                  ["block", "sm:block hidden", "hidden lg:block"][index]
                )}
              >
                <CardSkeleton
                  variant="best"
                  showImage={true}
                  showTitle={true}
                  showFooter={true}
                />
              </div>
            ))
          : // 정상 게시글 표시
            articles.map((article, index) => (
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
