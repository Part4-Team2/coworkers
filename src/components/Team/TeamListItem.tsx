import Image from "next/image";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";

interface TeamListItemProps {
  teamName: string;
  teamImage?: string;
  onClick: () => void;
}

export default function TeamListItem({
  teamName,
  teamImage,
  onClick,
}: TeamListItemProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`${teamName} 팀으로 이동`}
      className="flex items-center gap-12 w-full py-7 px-8 rounded-lg bg-slate-700 cursor-pointer"
    >
      <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0 bg-slate-600">
        {teamImage ? (
          <Image
            src={teamImage}
            alt={teamName}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <SVGIcon icon="image" size={20} />
          </div>
        )}
      </div>
      <span className="text-text-primary text-md font-medium leading-md">
        {teamName}
      </span>
    </button>
  );
}
