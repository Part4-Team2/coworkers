import SVGIcon from "@/app/components/SVGIcon/SVGIcon";

interface TeamHeaderProps {
  teamName: string;
  onSettingsClick?: () => void;
}

export default function TeamHeader({
  teamName,
  onSettingsClick,
}: TeamHeaderProps) {
  return (
    <div className="relative w-full h-64 rounded-xl border border-[rgba(248,250,252,0.10)] bg-[rgba(248,250,252,0.10)] flex items-center overflow-hidden">
      <h1 className="ml-24 font-medium text-xl leading-xl text-white text-center">
        {teamName}
      </h1>

      <div className="absolute right-80">
        <SVGIcon icon="thumbnailTeam" width={181} height={64} />
      </div>

      <button
        type="button"
        onClick={onSettingsClick}
        className="absolute right-24 w-20 h-20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="팀 설정"
      >
        <SVGIcon icon="gear" size={20} />
      </button>
    </div>
  );
}
