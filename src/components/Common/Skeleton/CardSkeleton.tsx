import Skeleton from "./Skeleton";

interface CardSkeletonProps {
  showImage?: boolean;
  imageHeight?: number;
  showTitle?: boolean;
  titleWidth?: string;
  showDescription?: boolean;
  descriptionLines?: number;
  showFooter?: boolean;
  className?: string;
}

/**
 * 범용 카드 스켈레톤
 * Article, Report, BestArticle 등에 재사용 가능
 */
export default function CardSkeleton({
  showImage = false,
  imageHeight = 120,
  showTitle = true,
  titleWidth = "70%",
  showDescription = true,
  descriptionLines = 2,
  showFooter = true,
  className = "",
}: CardSkeletonProps) {
  return (
    <div className={`bg-slate-800 rounded-lg overflow-hidden ${className}`}>
      {/* 이미지 영역 */}
      {showImage && (
        <Skeleton
          variant="rectangular"
          height={imageHeight}
          className="rounded-none"
        />
      )}

      {/* 콘텐츠 영역 */}
      <div className="p-16 space-y-12">
        {/* 제목 */}
        {showTitle && (
          <Skeleton variant="text" width={titleWidth} height={20} />
        )}

        {/* 설명 */}
        {showDescription && (
          <div className="space-y-8">
            {Array.from({ length: descriptionLines }).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={index === descriptionLines - 1 ? "60%" : "100%"}
                height={14}
              />
            ))}
          </div>
        )}

        {/* 푸터 (작성자, 날짜 등) */}
        {showFooter && (
          <div className="flex items-center gap-12 pt-8">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={80} height={12} />
            <Skeleton variant="text" width={60} height={12} />
          </div>
        )}
      </div>
    </div>
  );
}
