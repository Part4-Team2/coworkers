"use client";

import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import Article from "./components/Article";
import BoardInput from "./components/BoardInput";
import BestArticle from "./components/BestArticle";

const MOCKDATA01 = {
  id: 1,
  nickname: "우지은",
  title: "게시글 제목입니다.",
  createdAt: "2025.12.29",
  imageUrl: undefined,
  likeCount: 10000,
};

const MOCKDATA02 = {
  id: 2,
  nickname: "우지우",
  title: "게시글 제목입니다.",
  createdAt: "2025.12.29",
  imageUrl: undefined,
  likeCount: 9998,
};

const MOCKDATA03 = {
  id: 3,
  nickname: "우지호",
  title: "게시글 제목입니다.",
  createdAt: "2025.12.29",
  imageUrl: undefined,
  likeCount: 9997,
};

const MOCKMEMBERS = [MOCKDATA01, MOCKDATA02, MOCKDATA03];

function BoardPage() {
  const [inputVal, setInputVal] = useState("");
  const members = MOCKMEMBERS;

  return (
    <div
      className={clsx(
        "min-h-screen flex flex-col gap-20 justify-center items-center"
      )}
    >
      <BoardInput
        value={inputVal}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputVal(e.target.value)
        }
      />
      <div
        className={clsx(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-17"
        )}
      >
        {members.map((member) => (
          <BestArticle
            key={member.id}
            title={member.title}
            nickname={member.nickname}
            createdAt={member.createdAt}
            imageUrl={member.imageUrl}
            likeCount={member.likeCount}
          />
        ))}
      </div>
      <Article
        title={MOCKDATA01.title}
        nickname={MOCKDATA01.nickname}
        createdAt={MOCKDATA01.createdAt}
        imageUrl={MOCKDATA01.imageUrl}
        likeCount={MOCKDATA01.likeCount}
      />
    </div>
  );
}

export default BoardPage;
