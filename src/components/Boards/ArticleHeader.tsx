"use client";

import clsx from "clsx";
import Avatar from "../Common/Avatar/Avatar";
import SVGIcon from "../Common/SVGIcon/SVGIcon";
import Dropdown from "../Common/Dropdown/Dropdown";

interface Props {
  title: string;
  nickname: string;
  date: string;
  commentCount: number;
  likeCount: number;
}

const ARTICLEDATA = ["수정하기", "삭제하기"];

function ArticleHeader({
  title,
  nickname,
  date,
  commentCount,
  likeCount,
}: Props) {
  // 게시글 수정하기 삭제하기를 다루는 임시함수 입니다.
  const handleArticleClick = (value: string) => {
    console.log(value);
  };

  return (
    <>
      {/* 게시글 제목 영역 */}
      <div className={clsx("flex justify-between")}>
        <span className="text-2lg">{title}</span>
        <span>
          <Dropdown
            options={ARTICLEDATA}
            onSelect={handleArticleClick}
            value={ARTICLEDATA[0]}
            size="md"
            trigger="icon"
            icon="kebabLarge"
            listPosition="top-full right-0"
          />
        </span>
      </div>
      <div className="border-b border-b-text-primary/10"></div>
      {/* 작성자, 좋아요/댓글 개수 표시 영역 */}
      <div className={clsx("flex justify-between text-slate-400 text-sm")}>
        {/* 작성자, 게시글 생성일자 */}
        <div className="flex gap-16 items-center">
          <div className="flex gap-12 items-center">
            <Avatar imageUrl={undefined} altText="none" size="large" />
            <span className="text-text-primary">{nickname}</span>
          </div>
          <div className="text-text-primary/10">|</div>
          <div className="text-slate-400">{date}</div>
        </div>
        {/* 좋아요/댓글 개수 표시 */}
        <div className="flex gap-16">
          <div className="flex gap-4 items-center">
            <SVGIcon icon="comment" size={14} />
            <span>{commentCount}</span>
          </div>
          <div className="flex gap-4 items-center cursor-pointer">
            <SVGIcon icon="heart" size={14} />
            <span>{likeCount > 9999 ? "9999+" : likeCount}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArticleHeader;
