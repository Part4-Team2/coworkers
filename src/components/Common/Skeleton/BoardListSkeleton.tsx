import CardSkeleton from "./CardSkeleton";

interface BoardListSkeletonProps {
  showBestArticles?: boolean;
  articleCount?: number;
}

/**
 * 게시판 리스트 페이지 스켈레톤
 */
export default function BoardListSkeleton({
  showBestArticles = true,
  articleCount = 6,
}: BoardListSkeletonProps) {
  return (
    <div className="space-y-40">
      {/* Best Article 섹션 */}
      {showBestArticles && (
        <div className="space-y-16">
          <div className="h-32 w-150 bg-slate-700 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton
                key={index}
                variant="best"
                showImage={true}
                showTitle={true}
                showFooter={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* 일반 Article 리스트 */}
      <div className="space-y-16">
        <div className="h-28 w-120 bg-slate-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-3 gap-10 max-w-1200">
          {Array.from({ length: articleCount }).map((_, index) => (
            <CardSkeleton
              key={index}
              showImage={true}
              showTitle={true}
              showFooter={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
