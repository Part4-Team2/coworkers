import clsx from "clsx";
import SVGIcon from "../Common/SVGIcon/SVGIcon";
import { useHeaderStore } from "@/store/headerStore";

// 댓글을 display하는 컴포넌트 입니다.
interface CommentProps {
  commentId: number;
  content: string;
  createdAt: string;
  writerId: number;
  nickname: string;
  onDelete: (id: number) => void;
}

function Comment({
  commentId,
  content,
  createdAt,
  writerId,
  nickname,
  onDelete,
}: CommentProps) {
  const userId = useHeaderStore((state) => state.userId);
  const isAuthor = userId === writerId;

  // 삭제하기 버튼 누를 시 작동하는 함수입니다.
  const handleDelete = async () => {
    await onDelete(commentId);
  };

  return (
    <div
      className={clsx(
        "bg-background-secondary hover:bg-background-tertiary",
        "max-w-1200 w-full p-16 sm:px-20 sm:py-24",
        "min-h-123 relative",
        "border border-text-primary/10 rounded-xl"
      )}
    >
      <div className={clsx("flex flex-col gap-32")}>
        <span className={clsx("text-base text-text-primary", "break-all")}>
          {content}
        </span>
        {isAuthor && (
          <div
            className={clsx("absolute top-5 right-5 cursor-pointer")}
            onClick={handleDelete}
          >
            <SVGIcon icon="x" size={20} />
          </div>
        )}
        {/* <div className={clsx("flex justify-between items-center")}>
        </div> */}
        <div className="flex items-center gap-16 text-sm">
          <span className="text-text-primary">{nickname}</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">{createdAt.slice(0, 10)}</span>
        </div>
      </div>
    </div>
  );
}

export default Comment;
