import CardSkeleton from "./CardSkeleton";

interface SkeletonProps {
  commentCount?: number;
}

// 게시판 댓글 스켈레톤
export default function CommentSkeleton({ commentCount = 3 }: SkeletonProps) {
  return (
    <div className="space-y-40">
      <div className="h-32 w-150 bg-slate-700 rounded animate-pulse" />
      <div className="flex flex-col gap-16">
        {Array.from({ length: commentCount }).map((_, index) => (
          <CardSkeleton
            key={index}
            showImage={false}
            showTitle={false}
            showDescription={true}
            descriptionLines={2}
            showFooter={true}
          />
        ))}
      </div>
    </div>
  );
}
