import clsx from "clsx";
import Avatar from "@/app/components/Avatar/Avatar";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";

interface ArticleProps {
  title: string;
  nickname: string;
  createdAt: string;
  imageUrl?: string;
  likeCount: number;
}

function Article({
  title,
  nickname,
  createdAt,
  imageUrl,
  likeCount,
}: ArticleProps) {
  return (
    <div
      className={clsx(
        "w-343 h-162 sm:w-696 sm:h-176",
        "bg-background-secondary px-32 py-24",
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
        <div className="absolute top-0 right-0">
          <SVGIcon icon="kebabLarge" />
        </div>
        <div className="flex gap-16 items-center text-slate-400 text-md">
          <div className="flex gap-12 items-center text-text-primary">
            <Avatar
              imageUrl={imageUrl}
              altText={`${nickname} 프로필`}
              size="large"
            />
            <span>{nickname}</span>
          </div>
          <span>|</span>
          <div className="flex flex-1 justify-between">
            <span>{createdAt}</span>
            <div>{likeCount > 9999 ? "9999+" : likeCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
