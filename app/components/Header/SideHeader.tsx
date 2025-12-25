import clsx from "clsx";
import SVGIcon from "../SVGIcon/SVGIcon";

interface SideHeaderProps {
  onClick: () => void;
}

const MOCKDATA: string[] = [
  "Sales Team",
  "Marketing Team",
  "Administration Team",
  "Develop Team",
];

// Header 컴포 요소 중 팀 옆 토글 버튼 누를사 등장하는 사이드 바입니다.
function SideHeader({ onClick }: SideHeaderProps) {
  const teams: string[] = MOCKDATA; // 팀 받아올때 zustand로 받아올 것 같습니다.

  return (
    <div
      className={clsx(
        "min-h-screen",
        "bg-background-secondary w-204 p-16",
        "fixed top-0 left-0"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-35">
        <SVGIcon icon="x" className="cursor-pointer self-end" />
        <div className="flex flex-col gap-24">
          {/* 배열로 받는 방식이 아니면 과감히 변경할 예정입니다. */}
          {teams.map((team) => {
            return (
              <div key={team} className="cursor-pointer">
                {team}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SideHeader;
