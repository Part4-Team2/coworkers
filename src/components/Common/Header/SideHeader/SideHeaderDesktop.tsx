"use client";

import clsx from "clsx";
import Avatar from "../../Avatar/Avatar";
import { useRouter } from "next/navigation";

interface SideHeaderProps {
  isOpen: boolean;
  teams: {
    teamId: number;
    teamName: string;
    teamImage: string | null;
  }[];
  onClick: () => void;
}

// Header 컴포 요소 중 팀 옆 토글 버튼 누를사 등장하는 사이드 바입니다.
function SideHeaderDesktop({ isOpen, teams, onClick }: SideHeaderProps) {
  const router = useRouter();

  // Team 명을 클릭할때 소속 팀 화면으로 이동하는 함수입니다.
  // button이 아닌 Link로 변경할 수 있습니다.
  const handleClickTeam = (team: number) => {
    router.push(`/${team}`);
    onClick();
  };

  return (
    <div
      className={clsx(
        "absolute top-full right-0 z-50",
        "bg-background-secondary w-218 p-16",
        "border border-text-primary/10 rounded-xl",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          {teams.map((team) => {
            return (
              // 왼쪽 : 팀 이미지 + 팀 네임
              <div
                key={team.teamId}
                className={clsx(
                  "cursor-pointer",
                  "flex justify-between items-center"
                )}
                onClick={() => handleClickTeam(team.teamId)}
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
                      "overflow-hidden text-ellipsis line-clamp-1",
                      "hover:decoration-solid hover:underline"
                    )}
                  >
                    {team.teamName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SideHeaderDesktop;
