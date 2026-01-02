import clsx from "clsx";
import Link from "next/link";
import Avatar from "@/components/Common/Avatar/Avatar";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";

interface BestArticleProps {
  id: number;
  title: string;
  createdAt: string;
  nickname: string;
  avatarImageUrl?: string;
  likeCount: number;
}

// 베스트 게시글을 display하는 컴포넌트 입니다.
function BestArticle({
  id,
  title,
  createdAt,
  nickname,
  avatarImageUrl,
  likeCount,
}: BestArticleProps) {
  return (
    <Link href={`/boards/${id}`}>
      <div
        className={clsx(
          "bg-background-secondary hover:bg-background-tertiary",
          "w-343 sm:w-340 lg:w-387 h-178 sm:h-220",
          "pt-12 px-24 pb-16",
          "border border-text-primary/10 rounded-xl"
        )}
      >
        <div className={clsx("h-full flex flex-col justify-between")}>
          {/* 제목, 날짜 영역 */}
          <div className="flex flex-col gap-14">
            <div className="flex gap-4">
              <SVGIcon icon="progressDone" />
              <span className="text-white">Best</span>
            </div>
            <div className="flex flex-col gap-12">
              <div className="text-2lg text-text-secondary overflow-hidden text-ellipsis line-clamp-2">
                {title}
              </div>
              <div className="text-sm text-slate-400">{createdAt}</div>
            </div>
          </div>
          {/* 작성자 아바타, 작성자 닉네임, 좋아요 개수 영역 */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                <Avatar
                  imageUrl={avatarImageUrl}
                  altText={`${nickname} 프로필`}
                  size="large"
                />
                <span>{nickname}</span>
              </div>
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

export default BestArticle;
