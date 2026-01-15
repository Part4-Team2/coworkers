"use client";

import { useState, useEffect, useRef } from "react";
import { useHeaderStore } from "@/store/headerStore";
import { logoutAction } from "@/lib/api/auth";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Dropdown from "../Dropdown/Dropdown";
import SVGIcon from "../SVGIcon/SVGIcon";
import SideHeaderMobile from "./SideHeader/SideHeaderMobile";
import SideHeaderDesktop from "./SideHeader/SideHeaderDesktop";

// 유저 프로필을 누르면 나오는 드롭다운 리스트입니다.
const ACCOUNTLIST = ["마이 히스토리", "계정 설정", "팀 참여", "로그아웃"];

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const sideWrapperRef = useRef<HTMLDivElement>(null);

  const [isSideOpen, setIsSideOpen] = useState<boolean>(false);

  const isLogin = useHeaderStore((s) => s.isLogin);
  const nickname = useHeaderStore((s) => s.nickname);
  const teams = useHeaderStore((s) => s.teams);
  const activeTeam = useHeaderStore((s) => s.activeTeam);

  const fetchUser = useHeaderStore((s) => s.fetchUser);
  const clearUser = useHeaderStore((s) => s.clearUser);

  useEffect(() => {
    // 최초 마운트 시 무조건 한 번
    fetchUser();
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    // 해당 페이지의 경우 유저 정보를 갱신합니다.
    const shouldRefetch =
      pathname === "/teamlist" || // 팀 목록 - 팀 생성이나 삭제 후 갱신
      pathname === "/mypage" || // 마이페이지 - 유저 정보 수정 후 갱신
      pathname === "/addteam" || // 팀 생성 페이지 이후 갱신
      pathname.match(/^\/\d+$/) || // 팀 상세 (/[teamid]) - 팀 수정 후 갱신
      pathname.match(/^\/\d+\/edit$/); // 팀 수정 페이지

    if (shouldRefetch) {
      fetchUser();
    }
  }, [pathname, fetchUser]);

  useEffect(() => {
    if (!isSideOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!sideWrapperRef.current) return;

      if (!sideWrapperRef.current.contains(e.target as Node)) {
        setIsSideOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSideOpen]);

  const handleSideOpen = () => {
    setIsSideOpen(true);
  };

  const handleSideClose = () => {
    setIsSideOpen(false);
  };

  // 헤더에 있는 팀 이름 클릭하면 작동하는 함수입니다.
  const activeTeamClick = () => {
    if (!activeTeam) return;
    router.push(`/${activeTeam?.teamId}`);
  };

  // 로그아웃 작동하는 함수입니다.
  const handleLogout = async () => {
    try {
      await logoutAction();
      clearUser();
      setIsSideOpen(false);
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      // 추후에 토스트 같은 걸로 사용자에게 피드백 제공하면 좋을 것 같습니다.
    }
  };

  // 우측 프로필을 누르면 작동하는 함수입니다.
  const handleProfileClick = (value: string) => {
    if (value === "마이 히스토리") {
      router.push("/myhistory");
    } else if (value === "계정 설정") {
      router.push("/mypage");
    } else if (value === "팀 참여") {
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
            <div className={clsx("sm:hidden")} onClick={handleSideOpen}>
              <SVGIcon icon="gnbMenu" />
            </div>
            <Link href="/">
              <SVGIcon icon="LogoLarge" width={158} height={36} />
            </Link>
          </div>
          {isLogin && teams.length > 0 && (
            <div className="relative">
              <div className="hidden sm:flex gap-10">
                {/* 활성화 된 팀명, 드롭다운으로 클릭할때마다 바뀝니다. */}
                <div onClick={activeTeamClick}>{activeTeam?.teamName}</div>
                {/* 토글 버튼 */}
                <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSideOpen();
                  }}
                >
                  <SVGIcon icon="toggle" />
                </div>
                <div className="hidden sm:block">
                  <SideHeaderDesktop
                    isOpen={isSideOpen}
                    teams={teams}
                    wrapperRef={sideWrapperRef}
                    onClose={handleSideClose}
                  />
                </div>
              </div>
            </div>
          )}
          {isSideOpen && (
            <div className="sm:hidden">
              <SideHeaderMobile
                isOpen={isSideOpen}
                teams={teams}
                wrapperRef={sideWrapperRef}
                onClose={handleSideClose}
              />
            </div>
          )}
          <div className={clsx("hidden sm:block")}>
            <Link href="/boards" className="hidden sm:block cursor-pointer">
              자유게시판
            </Link>
          </div>
        </div>
        {/* 팀명 옆 토글 버튼을 누르면 사이드바가 나옵니다 */}

        {/* 로그인 상태면 아래 내용이 mount 됩니다. */}
        {isLogin ? (
          <div className="cursor-pointer flex items-center gap-8">
            {/* <SVGIcon icon="user" size="xxs" /> */}
            <Dropdown
              options={ACCOUNTLIST}
              onSelect={handleProfileClick}
              size="sm"
              trigger="icon"
              icon="user"
              listPosition="top-full right-0"
            />
            <div
              className={clsx(
                "max-w-100 overflow-hidden text-ellipsis whitespace-nowrap"
              )}
            >
              {nickname}
            </div>
          </div>
        ) : (
          <div
            className={clsx("flex items-center cursor-pointer")}
            onClick={() => router.push("login")}
          >
            로그인
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
