"use client";

import clsx from "clsx";
import SVGIcon from "../Common/SVGIcon/SVGIcon";

interface LikeProps {
  isLike: boolean;
  onLikeClick: () => void;
}

// 좋아요를 누를 수 있는 버튼입니다, isLike 상태에 따라 나오는 버튼이 다릅니다.
function ArticleLike({ isLike, onLikeClick }: LikeProps) {
  // 렌더 버튼 좋아요 누른 상태에 따라 달라집니다.
  const renderLikeButton = () => {
    return (
      <button
        className={clsx(
          "bg-background-secondary hover:bg-background-tertiary cursor-pointer",
          "p-16 rounded-lg border border-border-primary"
        )}
        onClick={onLikeClick}
      >
        <div className={clsx("flex items-center gap-8")}>
          <span>
            <SVGIcon
              icon="heart"
              size={20}
              className={clsx(isLike ? "fill-gray-500" : "")}
            />
          </span>
          <span>{isLike ? "좋아요 취소" : "좋아요"}</span>
        </div>
      </button>
    );
  };
  return (
    <div className={clsx("flex justify-center")}>{renderLikeButton()}</div>
  );
}

export default ArticleLike;
