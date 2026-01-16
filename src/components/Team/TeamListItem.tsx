import Image from "next/image";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useSvgImage } from "@/hooks/useSvgImage";

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
  const { processedUrl, isLoading, error, isSvg } = useSvgImage(teamImage);

  return (
    <button
      onClick={onClick}
      aria-label={`${teamName} 팀으로 이동`}
      className="flex items-center gap-12 w-full py-7 px-8 rounded-lg bg-slate-700 cursor-pointer"
    >
      <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0 bg-slate-600 relative">
        {processedUrl && !error && !isLoading ? (
          isSvg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={processedUrl}
              alt={teamName}
              className="w-full h-full object-contain"
            />
          ) : (
            <Image
              src={processedUrl}
              alt={teamName}
              fill
              className="object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <SVGIcon icon="image" size={20} />
          </div>
        )}
      </div>
      <span className="text-text-primary text-md font-medium leading-md truncate flex-1 text-left">
        {teamName}
      </span>
    </button>
  );
}
