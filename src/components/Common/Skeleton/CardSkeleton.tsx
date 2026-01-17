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
  variant?: "article" | "best";
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
  variant = "article",
}: CardSkeletonProps) {
  // Best Article 스켈레톤
  if (variant === "best") {
    return (
      <div
        className={`h-178 sm:h-220 bg-slate-800 rounded-xl border border-text-primary/10 pt-12 px-24 pb-16 ${className}`}
      >
        <div className="h-full flex flex-col justify-between">
          {/* Best 뱃지 */}
          <div className="space-y-14">
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={40} height={16} />
            </div>

            {/* 타이틀과 이미지 */}
            <div className="flex justify-between items-start gap-16">
              <div className="flex-1 space-y-8">
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="70%" height={20} />
              </div>

              {showImage && (
                <div className="flex-shrink-0">
                  <Skeleton
                    variant="rectangular"
                    width={64}
                    height={64}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* 날짜 */}
            <Skeleton variant="text" width={100} height={14} />
          </div>

          {/* 하단: 작성자와 좋아요 */}
          {showFooter && (
            <div className="flex items-center justify-between">
              <Skeleton variant="text" width={80} height={14} />
              <div className="flex items-center gap-4">
                <Skeleton variant="text" width={60} height={14} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 일반 Article 스켈레톤
  return (
    <div
      className={`h-162 sm:h-176 bg-slate-800 rounded-xl border border-text-primary/10 p-24 ${className}`}
    >
      <div className="h-full flex flex-col justify-between">
        {/* 상단: 타이틀과 이미지 */}
        <div className="flex justify-between items-start gap-16">
          {/* 제목 */}
          {showTitle && (
            <div className="flex-1 space-y-8">
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="70%" height={20} />
            </div>
          )}

          {/* 이미지 영역 */}
          {showImage && (
            <div className="flex-shrink-0">
              <Skeleton
                variant="rectangular"
                width={64}
                height={64}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        {/* 하단: 작성자 정보와 좋아요 */}
        {showFooter && (
          <div className="flex items-center justify-between gap-16">
            <Skeleton variant="text" width={80} height={14} />
            <div className="flex items-center gap-8">
              <Skeleton variant="text" width={60} height={14} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
