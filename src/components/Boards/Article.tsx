"use client";

import clsx from "clsx";
import Avatar from "@/components/Common/Avatar/Avatar";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import ArticleImage from "./ArticleImage";
import { useRouter } from "next/navigation";

interface ArticleProps {
  id: number;
  title: string;
  createdAt: string;
  avatarImageUrl?: string;
  articleImageUrl?: string;
  likeCount: number;
  writer: {
    id: number;
    nickname: string;
  };
}

const WRITEOPTIONS = ["수정하기", "삭제하기"];

function ArticleComp({
  id,
  title,
  createdAt,
  avatarImageUrl,
  articleImageUrl,
  likeCount,
  writer,
}: ArticleProps) {
  const router = useRouter();

  const handleKebabClick = (value: string) => {
    if (value === WRITEOPTIONS[0]) console.log("수정하기 누름");
    else console.log("삭제하기 누름");
  };

  if (typeof id !== "number") return null;

  return (
    <div
      className={clsx(
        "w-343 h-162 sm:w-696 sm:h-176 lg:w-590 relative",
        "bg-background-secondary hover:bg-background-tertiary px-32 py-24",
        "rounded-xl border border-text-primary/10"
      )}
      onClick={() => router.push(`/boards/${id}`)}
    >
      <div className="h-full flex flex-col justify-between ">
        <div className="flex justify-between items-center">
          <div
            className={clsx(
              "text-text-secondary text-2lg",
              "overflow-hidden text-ellipsis line-clamp-2"
            )}
          >
            {title}
          </div>
          {articleImageUrl && <ArticleImage image={articleImageUrl} />}
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
              imageUrl={avatarImageUrl}
              altText={`${writer.nickname} 프로필`}
              size="large"
            />
            <span>{writer.nickname}</span>
          </div>
          <span>|</span>
          <div className="flex flex-1 justify-between">
            <span>{createdAt}</span>
            <div className={clsx("flex gap-4 items-center")}>
              <span>
                <SVGIcon icon="heart" size="xxs" />
              </span>
              <span>{likeCount > 9999 ? "9999+" : likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleComp;
