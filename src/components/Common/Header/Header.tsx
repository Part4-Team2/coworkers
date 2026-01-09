"use client";

import { useState, useEffect } from "react";
import { useHeaderStore } from "@/store/headerStore";
import { logoutAction } from "@/api/auth";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Dropdown from "../Dropdown/Dropdown";
import SVGIcon from "../SVGIcon/SVGIcon";
import SideHeaderMobile from "./SideHeader/SideHeaderMobile";
import SideHeaderDesktop from "./SideHeader/SideHeaderDesktop";

// 유저 프로필을 누르면 나오는 드롭다운 리스트입니다.
const ACCOUNTLIST = ["마이 히스토리", "계정 설정", "팀 참여", "로그아웃"];

function Header() {
  const router = useRouter();
  // 추후에 CSS 가상선택자 or focus로 바꿔보자.
  const [isSideOpen, setIsSideOpen] = useState<boolean>(false);
  const { isLogin, nickname, teams, activeTeam } = useHeaderStore();

  const fetchUser = useHeaderStore((s) => s.fetchUser);
  const clearUser = useHeaderStore((s) => s.clearUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Side Header의 팀명 클릭시 작동하는 함수입니다.
  const handleSideClick = () => {
    setIsSideOpen((prev) => !prev);
  };

  // 로그아웃 작동하는 함수입니다.
  const handleLogout = async () => {
    try {
      await logoutAction();
      clearUser();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 우측 프로필을 누르면 작동하는 함수입니다.
  const handleProfileClick = (value: string) => {
    if (value === ACCOUNTLIST[0]) {
      router.push("/myhistory");
    } else if (value === ACCOUNTLIST[1]) {
      router.push("/mypage");
    } else if (value === ACCOUNTLIST[2]) {
      router.push("/jointeam");
    } else {
      handleLogout();
    }
  };

  return (
    <div className={"bg-background-secondary"}>
      <div
        className={clsx(
          "flex justify-between",
          "max-w-1200 w-full mx-auto py-14",
          "px-19"
        )}
      >
        <div className="cursor-pointer flex items-center gap-40">
          <div className="flex items-center gap-16">
            <div
              className={teams.length > 0 ? "sm:hidden" : "hidden"}
              onClick={handleSideClick}
            >
              <SVGIcon icon="gnbMenu" />
            </div>
            <Link href="/">
              <SVGIcon icon="LogoLarge" width={158} height={36} />
            </Link>
          </div>
          {isLogin && teams.length > 0 && (
            <div className="relative">
              <div className="hidden sm:flex gap-10">
                <div>{activeTeam}</div>
                <div className="cursor-pointer" onClick={handleSideClick}>
                  <SVGIcon icon="toggle" />
                </div>
                <div className="hidden sm:block">
                  <SideHeaderDesktop
                    isOpen={isSideOpen}
                    onClick={handleSideClick}
                    teams={teams}
                  />
                </div>
              </div>
            </div>
          )}
          {isSideOpen && (
            <div className="sm:hidden">
              <SideHeaderMobile
                isOpen={isSideOpen}
                onClick={handleSideClick}
                teams={teams}
              />
            </div>
          )}
          {isLogin && (
            <Link href="/boards" className="hidden sm:block cursor-pointer">
              자유게시판
            </Link>
          )}
        </div>
        {/* 팀명 옆 토글 버튼을 누르면 사이드바가 나옵니다 */}

        {/* 로그인 상태면 아래 내용이 mount 됩니다. */}
        {isLogin && (
          <div className="cursor-pointer flex items-center gap-8">
            {/* <SVGIcon icon="user" size="xxs" /> */}
            <Dropdown
              options={ACCOUNTLIST}
              onSelect={(val) => handleProfileClick(val)}
              size="sm"
              trigger="icon"
              icon="user"
              listPosition="top-full right-0"
            />
            <div>{nickname}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
