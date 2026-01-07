import clsx from "clsx";
import SVGIcon from "../../SVGIcon/SVGIcon";

interface SideHeaderProps {
  isOpen: boolean;
  teams: string[];
  onClick: () => void;
}

// Header 컴포 요소 중 팀 옆 토글 버튼 누를사 등장하는 사이드 바입니다.
function SideHeaderMobile({ isOpen, teams, onClick }: SideHeaderProps) {
  // Team 명을 클릭할때 소속 팀 화면으로 이동하는 함수입니다.
  // button이 아닌 Link로 변경할 수 있습니다.
  const handleClickTeam = (team: string) => {
    console.log(team);
    onClick();
  };

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 z-50",
        "min-h-screen",
        "bg-background-secondary w-204 p-16",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      )}
    >
      <div className="flex flex-col gap-35">
        <div onClick={onClick} className="self-end">
          <SVGIcon icon="x" className="cursor-pointer" />
        </div>
        <div className="flex flex-col gap-24">
          {teams.map((team) => {
            return (
              <button
                key={team}
                className="cursor-pointer hover:bg-background-tertiary"
                onClick={() => handleClickTeam(team)}
              >
                {team}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SideHeaderMobile;
