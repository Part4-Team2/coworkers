"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/store/headerStore";
import SVGIcon from "../../SVGIcon/SVGIcon";

interface SideHeaderProps {
  isOpen: boolean;
  teams: {
    teamId: number;
    teamName: string;
    teamImage: string | null;
    role: string;
  }[];
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

// Header 컴포 요소 중 팀 옆 토글 버튼 누를사 등장하는 사이드 바입니다.
function SideHeaderMobile({
  isOpen,
  teams,
  wrapperRef,
  onClose,
}: SideHeaderProps) {
  const router = useRouter();
  const setActiveTeam = useHeaderStore((s) => s.setActiveTeam);

  const handleClickTeam = (team: {
    teamId: number;
    teamName: string;
    teamImage: string | null;
    role: string;
  }) => {
    setActiveTeam(team);
    router.push(`/${team.teamId}`);
    onClose();
  };

  // 나머지 서비스를 클릭할때 이름에 맞게 이동하는 함수입니다.
  const handleClickPath = (path: number | string) => {
    router.push(`/${path}`);
    onClose();
  };

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        "fixed top-0 left-0 z-50",
        "min-h-screen",
        "bg-background-secondary w-204 p-16",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      )}
    >
      <div className="flex flex-col gap-24">
        <div onClick={onClose} className="self-end">
          <SVGIcon icon="x" className="cursor-pointer" />
        </div>
        {teams.length > 0 && (
          <div className="flex flex-col gap-24">
            {teams.map((team) => {
              return (
                <button
                  key={team.teamId}
                  className={clsx(
                    "flex cursor-pointer hover:bg-background-tertiary",
                    "overflow-hidden text-ellipsis whitespace-nowrap"
                  )}
                  onClick={() => handleClickTeam(team)}
                >
                  {team.teamName}
                </button>
              );
            })}
          </div>
        )}
        <div
          className={clsx("text-brand-primary")}
          onClick={() => {
            handleClickPath("boards");
          }}
        >
          자유게시판
        </div>
        <div
          className={clsx("text-brand-primary")}
          onClick={() => {
            handleClickPath("addteam");
          }}
        >
          팀 생성하기
        </div>
      </div>
    </div>
  );
}

export default SideHeaderMobile;
