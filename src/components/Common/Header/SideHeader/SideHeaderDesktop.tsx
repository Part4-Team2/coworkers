"use client";

import clsx from "clsx";
import Avatar from "../../Avatar/Avatar";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/store/headerStore";

interface SideHeaderProps {
  isOpen: boolean;
  teams: {
    teamId: string;
    teamName: string;
    teamImage: string | null;
    role: string;
  }[];
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

// Header 컴포 요소 중 팀 옆 토글 버튼 누를사 등장하는 사이드 바입니다.
function SideHeaderDesktop({
  isOpen,
  teams,
  wrapperRef,
  onClose,
}: SideHeaderProps) {
  const router = useRouter();
  const setActiveTeam = useHeaderStore((s) => s.setActiveTeam);

  const handleClickTeam = (team: {
    teamId: string;
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
        "absolute top-45 right-0 z-50",
        "bg-background-secondary w-218 p-16",
        "border border-text-primary/10 rounded-xl",
        isOpen
          ? "translate-x-0 opacity-100 pointer-events-auto"
          : "translate-x-full opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col gap-16">
        <div className={clsx("flex flex-col gap-8")}>
          {teams.map((team) => {
            return (
              // 팀 이미지 + 팀 네임
              <div
                key={team.teamId}
                className={clsx(
                  "cursor-pointer",
                  "flex justify-between items-center",
                  "px-8 py-7 rounded-lg",
                  "hover:bg-background-tertiary"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickTeam(team);
                }}
              >
                <div
                  className={clsx("flex flex-1 min-w-0 gap-12 items-center")}
                >
                  <Avatar
                    imageUrl={team.teamImage || undefined}
                    altText="Team image"
                    size="large"
                    variant="team"
                  />
                  <span
                    className={clsx(
                      "text-base text-white",
                      "overflow-hidden text-ellipsis line-clamp-1"
                    )}
                  >
                    {team.teamName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className={clsx(
            "flex justify-center px-45 py-15",
            "border border-white rounded-xl",
            "hover:bg-background-tertiary",
            "overflow-hidden text-ellipsis whitespace-nowrap"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleClickPath("addteam");
          }}
        >
          + 팀 추가하기
        </div>
      </div>
    </div>
  );
}

export default SideHeaderDesktop;
