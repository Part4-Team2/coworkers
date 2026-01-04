"use client";

import clsx from "clsx";
import Link from "next/link";
import SVGIcon from "../SVGIcon/SVGIcon";
import SideHeader from "./SideHeader";
import { useState } from "react";

// 반응형 웹 개발할때 햄버거 아이콘, 작은 로고 도입 예정입니다.
// Headers는 props를 받지 않습니다, 로그인 상태, 팀보유 상태를 zustand로 직접 받아올 예정입니다.
const TEAM: string = "Sales Team"; //추후에 useState 쓸듯, 배열 받아야할지도
const NAME: string = "Doro";
const isLogin: boolean = true; // zustand 들어오기전 임시로 사용하는 로그인 상태입니다.
const hasTeam: boolean = isLogin && !!TEAM; // zustand 들어오기전 임시로 사용하는 팀 상태입니다.

function Header() {
  // 추후에 CSS 가상선택자 or focus로 바꿔보자.
  const [isSideOpen, setIsSideOpen] = useState<boolean>(false);

  const handleSideClick = () => {
    setIsSideOpen((prev) => !prev);
  };

  return (
    <div className={"bg-background-secondary"}>
      <div
        className={clsx(
          "flex justify-between",
          "max-w-1200 w-full mx-auto py-14",
          "px-19 lg:px-0"
        )}
      >
        <div className="cursor-pointer flex items-center gap-40">
          <div className="flex items-center gap-16">
            <div className="sm:hidden" onClick={handleSideClick}>
              <SVGIcon icon="gnbMenu" />
            </div>
            <Link href="/">
              <SVGIcon icon="LogoLarge" width={158} height={36} />
            </Link>
          </div>
          {hasTeam && (
            <div className="hidden sm:flex gap-10">
              <div>{TEAM}</div>
              <div className="cursor-pointer" onClick={handleSideClick}>
                <SVGIcon icon="toggle" />
              </div>
            </div>
          )}
          {isLogin && (
            <Link href="/boards" className="hidden sm:block cursor-pointer">
              자유게시판
            </Link>
          )}
        </div>
        {/* 팀명 옆 토글 버튼을 누르면 사이드바가 나옵니다 */}
        {/* {isSideOpen && (
          <SideHeader isOpen={isSideOpen} onClick={handleSideClick} />
        )} */}
        <SideHeader isOpen={isSideOpen} onClick={handleSideClick} />

        {/* 로그인 상태면 아래 내용이 mount 됩니다. */}
        {isLogin && (
          <div className="cursor-pointer flex items-center gap-8">
            <SVGIcon icon="user" size="xxs" />
            <div>{NAME}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
