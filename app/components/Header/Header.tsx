import clsx from "clsx";
import Link from "next/link";
import SVGIcon from "../SVGIcon/SVGIcon";
import LogoLargeIcon from "../../assets/img/logo_coworkers/logo-large.svg";
// import LogoSmallIcon from "@/app/assets/img/logo_coworkers/logo-small.svg";

// Headers는 props를 받지 않습니다, 로그인 상태, 팀보유 상태를 zustand로 직접 받아올 예정입니다.
// 반응형 웹 개발할때 햄버거 아이콘, 작은 로고 도입 예정입니다.
function Header() {
  const team: string = "Sales Team"; //추후에 useState 쓸듯, 배열 받아야할지도
  const name: string = "Doro";
  const isLogin: boolean = false; // zustand 들어오기전 임시로 사용하는 로그인 상태입니다.
  const hasTeam: boolean = isLogin && !!team; // zustand 들어오기전 임시로 사용하는 팀 상태입니다.

  return (
    <div className={"bg-background-secondary"}>
      <div className={clsx("flex justify-between", "max-w-1200 mx-auto py-14")}>
        <div className="cursor-pointer flex items-center gap-40">
          <Link href="/">
            <LogoLargeIcon className="w-158 h-32" />
          </Link>
          {hasTeam && (
            <div className="flex gap-10">
              <div>{team}</div>
              <SVGIcon icon="toggle" />
            </div>
          )}
          {isLogin && <div className="cursor-pointer">자유게시판</div>}
        </div>
        {/* 로그인 상태면 아래 내용이 mount 됩니다. */}
        {isLogin && (
          <div className="cursor-pointer flex items-center gap-8">
            <SVGIcon icon="user" size="xxs" />
            <div>{name}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
