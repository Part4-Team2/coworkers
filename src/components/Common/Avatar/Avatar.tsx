import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import clsx from "clsx";
import Image from "next/image";
import { useSvgImage } from "@/hooks/useSvgImage";

const AVATAR_SIZE_MAP = {
  small: 24,
  large: 32,
  xlarge: 64,
} as const;

interface AvatarProps {
  imageUrl?: string;
  altText: string;
  size?: keyof typeof AVATAR_SIZE_MAP;
  isEditable?: boolean;
  onEditClick?: () => void;
  variant?: "user" | "team";
}

export default function Avatar({
  imageUrl,
  altText = "사용자 프로필",
  size = "xlarge",
  isEditable = false,
  onEditClick,
  variant,
}: AvatarProps) {
  const pixelSize = AVATAR_SIZE_MAP[size];
  const { processedUrl, isLoading, error, isSvg } = useSvgImage(imageUrl);

  const defaultIcon = variant === "team" ? "img" : "avatar";
  const AvatarContent = (
    <>
      <div
        className={clsx(
          "overflow-hidden rounded-full bg-background-tertiary",

          {
            "border border-border-primary": size !== "xlarge",
            "border-2 border-border-primary": size === "xlarge",
          }
        )}
        style={{ width: pixelSize, height: pixelSize }}
      >
        {processedUrl && !error && !isLoading ? (
          isSvg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={processedUrl}
              alt={altText}
              className="w-full h-full object-contain"
            />
          ) : (
            <Image
              src={processedUrl}
              alt={altText}
              width={pixelSize}
              height={pixelSize}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <SVGIcon icon={defaultIcon} size={pixelSize} />
          </div>
        )}
      </div>

      {isEditable && (
        <div className="absolute bottom-0 right-0">
          <SVGIcon icon="btnEditSmall" />
        </div>
      )}
    </>
  );

  if (isEditable) {
    return (
      <button
        type="button" // 기본값 type="submit" 방지
        onClick={onEditClick}
        aria-label="아바타 편집"
        className="relative inline-block cursor-pointer hover:opacity-80"
      >
        {AvatarContent}
      </button>
    );
  }
  return <div className="relative inline-block">{AvatarContent}</div>;
}
