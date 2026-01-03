import clsx from "clsx";
import Avatar from "../Common/Avatar/Avatar";
import Dropdown from "../Common/Dropdown/Dropdown";

// 댓글을 display하는 컴포넌트 입니다.
interface CommentProps {
  commentId: number;
  content: string;
  createdAt: string;
  nickname: string;
  avatarImageUrl?: string;
}

const WRITEOPTIONS = ["삭제하기"];

function Comment({
  commentId,
  content,
  createdAt,
  nickname,
  avatarImageUrl,
}: CommentProps) {
  const handleEditClick = () => {
    console.log(`${commentId} 댓글 삭제하기`);
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
          <Dropdown
            options={WRITEOPTIONS}
            onSelect={handleEditClick}
            size="md"
            trigger="icon"
            value={WRITEOPTIONS[0]}
            icon="kebabLarge"
          />
        </div>
        <div className="flex items-center gap-16 text-sm">
          <Avatar imageUrl={avatarImageUrl} altText="profile" size="large" />
          <span className="text-text-primary">{nickname}</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">{createdAt}</span>
        </div>
      </div>
    </div>
  );
}

export default Comment;
