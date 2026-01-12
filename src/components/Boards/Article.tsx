"use client";

import clsx from "clsx";
import Avatar from "@/components/Common/Avatar/Avatar";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import ArticleImage from "./ArticleImage";
import { useRouter } from "next/navigation";
import { Article } from "@/types/article";

interface ArticleProps {
  article: Article;
  currentUserId: number | null;

  onDelete: (args: { articleId: number; authorId: number }) => Promise<void>;
  onEdit?: (articleId: number) => void;
  onLike?: (articleId: number) => void;
}

const WRITEOPTIONS = ["수정하기", "삭제하기"];

function ArticleComp({
  article,
  currentUserId,
  onDelete,
  onEdit,
  onLike,
}: ArticleProps) {
  const router = useRouter();
  const isAuthor = currentUserId === article.writer.id;

  // 케밥 리스트를 클릭하면 작동하는 함수입니다.
  const handleKebabClick = async (value: string) => {
    if (!isAuthor) return;

    if (value === "수정하기") console.log("수정하기 누름");

    if (value === "삭제하기") {
      console.log("삭제하기 누름");
      await onDelete({
        articleId: article.id,
        authorId: article.writer.id,
      });
    }
  };

  // id가 정수가 아닐 시 그냥 리턴
  if (typeof article.id !== "number") return null;

  return (
    <div
      className={clsx(
        "w-343 h-162 sm:w-696 sm:h-176 lg:w-590 relative",
        "bg-background-secondary hover:bg-background-tertiary px-32 py-24",
        "rounded-xl border border-text-primary/10"
      )}
      onClick={() => router.push(`/boards/${article.id}`)}
    >
      <div className="h-full flex flex-col justify-between ">
        <div className="flex justify-between items-center">
          <div
            className={clsx(
              "text-text-secondary text-2lg",
              "overflow-hidden text-ellipsis line-clamp-2"
            )}
          >
            {article.title}
          </div>
          {article.image && <ArticleImage image={article.image} />}
        </div>
        <div
          className="absolute top-10 right-10 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Dropdown
            options={WRITEOPTIONS}
            onSelect={handleKebabClick}
            size="md"
            trigger="icon"
            value={WRITEOPTIONS[0]}
            icon="kebabLarge"
            listPosition="top-full right-0"
          />
        </div>
        <div className="flex gap-16 items-center text-slate-400 text-md">
          <div className="flex gap-12 items-center text-text-primary">
            <Avatar
              imageUrl={undefined}
              altText={`${article.writer.nickname} 프로필`}
              size="large"
            />
            <span>{article.writer.nickname}</span>
          </div>
          <span>|</span>
          <div className="flex flex-1 justify-between">
            <span>{article.createdAt}</span>
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
