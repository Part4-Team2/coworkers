import clsx from "clsx";
import Link from "next/link";
import Avatar from "@/components/Common/Avatar/Avatar";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";

interface ArticleProps {
  id: number;
  title: string;
  nickname: string;
  createdAt: string;
  avatarImageUrl?: string;
  likeCount: number;
}

const WRITEOPTIONS = ["수정하기", "삭제하기"];

function Article({
  id,
  title,
  nickname,
  createdAt,
  avatarImageUrl,
  likeCount,
}: ArticleProps) {
  const handleKebabClick = () => {
    console.log("kebab click");
  };

  return (
    <Link href={`/board/${id}`}>
      <div
        className={clsx(
          "w-343 h-162 sm:w-696 sm:h-176 lg:w-590",
          "bg-background-secondary hover:bg-background-tertiary px-32 py-24",
          "rounded-xl border border-text-primary/10"
        )}
      >
        <div className="h-full flex flex-col justify-between relative">
          <div
            className={clsx(
              "text-text-secondary text-2lg",
              "overflow-hidden text-ellipsis line-clamp-2"
            )}
          >
            {title}
          </div>
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleKebabClick();
            }}
          >
            <Dropdown
              options={WRITEOPTIONS}
              onSelect={handleKebabClick}
              size="md"
              trigger="icon"
              value={WRITEOPTIONS[0]}
              icon="kebabLarge"
            />
          </div>
          <div className="flex gap-16 items-center text-slate-400 text-md">
            <div className="flex gap-12 items-center text-text-primary">
              <Avatar
                imageUrl={avatarImageUrl}
                altText={`${nickname} 프로필`}
                size="large"
              />
              <span>{nickname}</span>
            </div>
            <span>|</span>
            <div className="flex flex-1 justify-between">
              <span>{createdAt}</span>
              <div className={clsx("flex gap-4 items-center")}>
                <span>
                  <SVGIcon icon="done" size="xxs" />
                </span>
                <span>{likeCount > 9999 ? "9999+" : likeCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Article;
