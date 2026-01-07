import clsx from "clsx";
import Dropdown from "../../Dropdown/Dropdown";

interface SideHeaderProps {
  isOpen: boolean;
  teams: string[];
  onClick: () => void;
}

// 팀명 옆 케밥버튼 누를때 뜨는 버튼입니다.
const TEAMSETTINGS = ["하나", "둘"];

// Header 컴포 요소 중 팀 옆 토글 버튼 누를사 등장하는 사이드 바입니다.
function SideHeaderDesktop({ isOpen, teams, onClick }: SideHeaderProps) {
  // Team 명을 클릭할때 소속 팀 화면으로 이동하는 함수입니다.
  // button이 아닌 Link로 변경할 수 있습니다.
  const handleClickTeam = (team: string) => {
    console.log(team);
    onClick();
  };

  const handleClickKebab = () => {
    console.log("Team kebab");
  };

  return (
    <div
      className={clsx(
        "absolute top-full right-0 z-50",
        "bg-background-secondary w-218 p-16",
        "border border-text-primary/10 rounded-xl",
        isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      )}
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          {teams.map((team) => {
            return (
              // 왼쪽 : 팀 이미지 + 팀 네임
              <div
                key={team}
                className={clsx(
                  "cursor-pointer",
                  "flex justify-between items-center"
                )}
                onClick={() => handleClickTeam(team)}
              >
                <div
                  className={clsx("flex flex-1 min-w-0 gap-12 items-center")}
                >
                  <div
                    className={clsx(
                      "w-32 h-32 shrink-0",
                      "rounded-md",
                      // 팀 이미지 api작업시 들어갈 예정입니다.
                      "bg-background-tertiary"
                    )}
                  ></div>
                  <span
                    className={clsx(
                      "text-base text-white",
                      "overflow-hidden text-ellipsis line-clamp-1",
                      "hover:decoration-solid hover:underline"
                    )}
                  >
                    {team}
                  </span>
                </div>
                {/* 오른쪽 : 드롭다운 */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Dropdown
                    options={TEAMSETTINGS}
                    onSelect={handleClickKebab}
                    size="sm"
                    trigger="icon"
                    icon="kebabLarge"
                  />
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
