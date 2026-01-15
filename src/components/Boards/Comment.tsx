import clsx from "clsx";
import Dropdown from "../Common/Dropdown/Dropdown";
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

const WRITEOPTIONS = ["삭제하기"];

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
  const handleSelect = async (value: string) => {
    console.log(`${commentId} 댓글 삭제하기`);
    if (value !== "삭제하기") return;

    await onDelete(commentId);
  };

  return (
    <div
      className={clsx(
        "bg-background-secondary hover:bg-background-tertiary",
        "max-w-1200 w-full p-16 sm:px-20 sm:py-24",
        "h-113 sm:h-123",
        "border border-text-primary/10 rounded-xl"
      )}
    >
      <div className={clsx("flex flex-col gap-32")}>
        <div className={clsx("flex justify-between items-center")}>
          <span
            className={clsx(
              "text-base text-text-primary",
              "overflow-hidden text-ellipsis line-clamp-1"
            )}
          >
            {content}
          </span>
          {isAuthor && (
            <Dropdown
              options={WRITEOPTIONS}
              onSelect={handleSelect}
              size="md"
              trigger="icon"
              value={WRITEOPTIONS[0]}
              icon="kebabLarge"
              listPosition="top-full right-0"
            />
          )}
        </div>
        <div className="flex items-center gap-16 text-sm">
          <span className="text-text-primary">{nickname}</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">{createdAt}</span>
        </div>
      </div>
    </div>
  );
}

export default Comment;
