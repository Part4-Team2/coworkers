"use client";

import clsx from "clsx";

interface LikeProps {
  isLike: boolean;
  likeCount: number;
  onLikeClick: () => void;
}

// 좋아요를 누를 수 있는 버튼입니다, isLike 상태에 따라 나오는 버튼이 다릅니다.
function ArticleLike({ likeCount, isLike, onLikeClick }: LikeProps) {
  // 렌더 버튼 좋아요 누른 상태에 따라 달라집니다.
  const renderLikeButton = () => {
    if (isLike === false) {
      return (
        <button
          className={clsx(
            "bg-background-secondary hover:bg-background-tertiary cursor-pointer",
            "p-16 rounded-lg border border-border-primary"
          )}
          onClick={onLikeClick}
        >
          <div className={clsx("flex gap-16")}>
            <span>{likeCount}</span>
            <span>좋아요</span>
          </div>
        </button>
      );
    } else {
      return (
        <button
          className={clsx(
            "bg-background-secondary hover:bg-background-tertiary cursor-pointer",
            "p-16 rounded-lg border border-border-primary"
          )}
          onClick={onLikeClick}
        >
          <div className={clsx("flex gap-16")}>
            <span>{likeCount}</span>
            <span>좋아요 취소</span>
          </div>
        </button>
      );
    }
  };
  return (
    <div className={clsx("flex justify-center")}>{renderLikeButton()}</div>
  );
}

export default ArticleLike;
