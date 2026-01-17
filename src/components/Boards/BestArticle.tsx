import clsx from "clsx";
import Link from "next/link";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import ArticleImage from "./ArticleImage";

interface BestArticleProps {
  id: number;
  title: string;
  createdAt: string;
  nickname: string;
  articleImageUrl?: string;
  likeCount: number;
}

// 베스트 게시글을 display하는 컴포넌트 입니다.
function BestArticle({
  id,
  title,
  createdAt,
  nickname,
  articleImageUrl,
  likeCount,
}: BestArticleProps) {
  return (
    <Link href={`/boards/${id}`}>
      <div
        className={clsx(
          "bg-background-secondary hover:bg-background-tertiary",
          "w-full h-178 sm:h-220 min-w-0",
          "pt-12 px-24 pb-16",
          "border border-text-primary/10 rounded-xl"
        )}
      >
        <div className={clsx("h-full flex flex-col justify-between")}>
          {/* 제목, 날짜 영역 */}
          <div className="flex flex-col gap-14">
            <div className="flex gap-4">
              <SVGIcon icon="medal" />
              <span className="text-white">Best</span>
            </div>
            <div className="flex flex-col gap-12">
              <div className="flex justify-between items-start gap-16">
                <div className="flex-1 text-2lg text-text-secondary overflow-hidden text-ellipsis line-clamp-2 pr-8">
                  {title}
                </div>
                <div className="shrink-0">
                  {articleImageUrl && <ArticleImage image={articleImageUrl} />}
                </div>
              </div>
              <div className="text-sm text-slate-400">
                {createdAt.slice(0, 10)}
              </div>
            </div>
          </div>
          {/* 작성자 아바타, 작성자 닉네임, 좋아요 개수 영역 */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                <span
                  className={clsx(
                    "max-w-100 overflow-hidden text-ellipsis whitespace-nowrap"
                  )}
                >
                  {nickname}
                </span>
              </div>
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
    </Link>
  );
}

export default BestArticle;
