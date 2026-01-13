"use client";

import clsx from "clsx";
import Button from "../Common/Button/Button";

interface LikeProps {
  onLikeClick: () => void;
  isLike: boolean;
}

// 좋아요를 누를 수 있는 버튼입니다, isLike 상태에 따라 나오는 버튼이 다릅니다.
function ArticleLike({ onLikeClick, isLike }: LikeProps) {
  // 렌더 버튼 좋아요 누른 상태에 따라 달라집니다.
  const renderLikeButton = () => {
    if (isLike === false) {
      return (
        <Button
          label="좋아요"
          variant="solid"
          size="large"
          width="150px"
          onClick={onLikeClick}
        />
      );
    } else {
      return (
        <Button
          label="좋아요 취소"
          variant="solid"
          size="large"
          width="150px"
          onClick={onLikeClick}
        />
      );
    }
  };
  return (
    <div className={clsx("flex justify-center")}>{renderLikeButton()}</div>
  );
}

export default ArticleLike;
