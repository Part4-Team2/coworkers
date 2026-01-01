"use client";

import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import Article from "./components/Article";
import ButtonFloating from "../components/Button/ButtonFloating";
import SVGIcon from "../components/SVGIcon/SVGIcon";
import Dropdown from "../components/Dropdown/Dropdown";
import BoardInput from "./components/BoardInput";
import BestArticle from "./components/BestArticle";

const ARRANGE: string[] = ["최신순", "좋아요 많은순"];

// mockdata는 추후에 api 들어오면 삭제 예정입니다.
type Mockdata = {
  id: number;
  nickname: string;
  title: string;
  createdAt: string;
  avatarImageUrl?: string;
  likeCount: number;
};

const MOCKDATA01: Mockdata = {
  id: 1,
  nickname: "우지은",
  title: "게시글 제목입니다.",
  createdAt: "2025.12.29",
  avatarImageUrl: undefined,
  likeCount: 10000,
};

const MOCKDATA02: Mockdata = {
  id: 2,
  nickname: "우지우",
  title: "게시글 제목입니다.",
  createdAt: "2025.12.29",
  avatarImageUrl: undefined,
  likeCount: 9998,
};

const MOCKDATA03: Mockdata = {
  id: 3,
  nickname: "우지호",
  title: "게시글 제목입니다.",
  createdAt: "2025.12.29",
  avatarImageUrl: undefined,
  likeCount: 9997,
};

const MOCKMEMBERS = [MOCKDATA01, MOCKDATA02, MOCKDATA03];

function BoardPage() {
  const [inputVal, setInputVal] = useState("");
  const [arrange, setArrange] = useState(ARRANGE[0]);
  const members = MOCKMEMBERS;

  // 추후 함수는 글쓰기 페이지로 이동할 예정입니다.
  const handleWriteClick = () => {
    console.log("Write Button Click.");
  };

  // 더보기 문구 클릭시 작동하는 함수입니다.
  const handleMoreClick = () => {
    console.log("더보기 클릭.");
  };

  return (
    // Page Wrapper
    <div
      className={clsx(
        "min-h-screen bg-background-primary",
        "px-16 sm:px-24 lg:px-0"
      )}
    >
      {/* content wrapper */}
      <main className="max-w-1200 mx-auto py-40">
        <section className="flex flex-col gap-24 sm:gap-32 lg:gap-40">
          <div className="text-text-primary text-2xl">자유게시판</div>
          <BoardInput
            value={inputVal}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputVal(e.target.value)
            }
          />
          <article className="flex flex-col gap-56">
            <div className="flex justify-between items-center">
              <span className="text-text-primary text-xl">베스트 게시글</span>
              {/* 더보기 버튼 */}
              <div
                className="flex items-center cursor-pointer"
                onClick={handleMoreClick}
              >
                <span className="text-sm text-slate-400 hover:text-slate-200">
                  더보기
                </span>
                <SVGIcon icon="arrowRight" size="xxs" />
              </div>
            </div>
            <div
              className={clsx(
                "grid grid-cols-1 grid-rows-1 sm:grid-cols-2 lg:grid-cols-3 gap-21 max-w-1200 mx-auto"
              )}
            >
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className={clsx(
                    index === 0 && "block",
                    index === 1 && "sm:block hidden",
                    index === 2 && "hidden lg:block"
                  )}
                >
                  <BestArticle
                    title={member.title}
                    nickname={member.nickname}
                    createdAt={member.createdAt}
                    avatarImageUrl={member.avatarImageUrl}
                    likeCount={member.likeCount}
                  />
                </div>
              ))}
            </div>
          </article>
          <div className="border-b border-b-border-primary/10"></div>
          <article className="flex flex-col gap-32">
            <div className="flex items-center justify-between">
              <span className="text-text-primary text-2xl">게시글</span>
              <Dropdown
                options={ARRANGE}
                onSelect={setArrange}
                size="md"
                value={arrange}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-3 gap-21 max-w-1200 mx-auto">
              {members.map((member) => (
                <Article
                  key={member.id}
                  title={member.title}
                  nickname={member.nickname}
                  createdAt={member.createdAt}
                  avatarImageUrl={member.avatarImageUrl}
                  likeCount={member.likeCount}
                />
              ))}
            </div>
          </article>
        </section>
        <div className="fixed right-24 bottom-61 z-30">
          <ButtonFloating
            label="+ 글쓰기"
            size="large"
            onClick={handleWriteClick}
          />
        </div>
      </main>
    </div>
  );
}

export default BoardPage;
