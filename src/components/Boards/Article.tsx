"use client";

import clsx from "clsx";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import ArticleImage from "./ArticleImage";
import { useRouter } from "next/navigation";
import { Article } from "@/types/article";

interface ArticleProps {
  article: Article;
  currentUserId: number | null;
}

function ArticleComp({ article, currentUserId }: ArticleProps) {
  const router = useRouter();
  const isAuthor = currentUserId === article.writer.id;

  // id가 정수가 아닐 시 그냥 리턴
  if (typeof article.id !== "number") return null;

  return (
    <div
      className={clsx(
        "w-full h-162 sm:h-176 relative",
        "bg-background-secondary hover:bg-background-tertiary px-32 py-24",
        "rounded-xl border border-text-primary/10"
      )}
      onClick={() => router.push(`/boards/${article.id}`)}
    >
      <div className="h-full flex flex-col justify-between">
        <div className="flex justify-between items-start gap-16">
          <div
            className={clsx(
              "flex-1 text-text-secondary text-2lg",
              "overflow-hidden text-ellipsis line-clamp-2",
              "break-all pr-8"
            )}
          >
            {article.title}
          </div>
          {/* 이미지 영역 */}
          <div className="shrink-0">
            {article.image ? (
              <ArticleImage image={article.image} />
            ) : (
              <div className={clsx("w-64 h-64")}></div>
            )}
          </div>
        </div>
        {isAuthor && (
          <button
            type="button"
            className={clsx(
              "absolute top-8 right-8",
              "cursor-pointer hover:opacity-70 transition-opacity"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/boards/${article.id}/edit`);
            }}
          >
            <SVGIcon icon="edit" size={17} fill="#5e6481" />
          </button>
        )}
        <div className="flex gap-16 items-center text-slate-400 text-md">
          <div className="flex gap-12 items-center text-text-primary">
            <span
              className={clsx(
                "w-50 sm:w-90 overflow-hidden text-ellipsis whitespace-nowrap"
              )}
            >
              {article.writer.nickname}
            </span>
          </div>
          <span>|</span>
          <div className="flex flex-1 justify-between">
            <span>{article.createdAt.slice(0, 10)}</span>
            <div className={clsx("flex gap-4 items-center")}>
              <span>
                <SVGIcon icon="heart" size="xxs" />
              </span>
              <span>
                {article.likeCount > 9999 ? "9999+" : article.likeCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleComp;
