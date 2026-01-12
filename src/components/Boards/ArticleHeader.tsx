"use client";

import clsx from "clsx";
import Dropdown from "../Common/Dropdown/Dropdown";

interface Props {
  title: string;
}

const ARTICLEDATA = ["수정하기", "삭제하기"];

function ArticleHeader({ title }: Props) {
  // 게시글 수정하기 삭제하기를 다루는 임시함수 입니다.
  const handleArticleClick = (value: string) => {
    console.log(value);
  };

  return (
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
  );
}

export default ArticleHeader;
