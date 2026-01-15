import Skeleton from "./Skeleton";

interface ListItemSkeletonProps {
  count?: number;
  showImage?: boolean;
  imageSize?: number;
  imageShape?: "rectangular" | "circular";
  textWidth?: string;
  className?: string;
}

/**
 * 범용 리스트 아이템 스켈레톤
 * Team, Task, Member 등 다양한 리스트에 재사용 가능
 */
export function ListItemSkeleton({
  count = 3,
  showImage = true,
  imageSize = 32,
  imageShape = "rectangular",
  textWidth = "40%",
  className = "",
}: ListItemSkeletonProps) {
  return (
    <div className="flex flex-col gap-10">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`flex items-center gap-12 w-full py-7 px-8 rounded-lg bg-slate-700 ${className}`}
        >
          {showImage && (
            <Skeleton
              variant={imageShape}
              width={imageSize}
              height={imageSize}
            />
          )}
          <Skeleton variant="text" width={textWidth} height={16} />
        </div>
      ))}
    </div>
  );
}

/**
 * 팀 리스트 전용 스켈레톤
 */
export default function TeamListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ListItemSkeleton
      count={count}
      showImage={true}
      imageSize={32}
      imageShape="rectangular"
      textWidth="40%"
    />
  );
}
