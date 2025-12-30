import Avatar from "@/app/components/Avatar/Avatar";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";

interface MemberProps {
  name: string;
  email: string;
  imageUrl?: string;
  isAdmin?: boolean;
  onDeleteClick?: () => void;
  onNameClick?: () => void;
}

export default function Member({
  name,
  email,
  imageUrl,
  isAdmin = false,
  onDeleteClick,
  onNameClick,
}: MemberProps) {
  const deleteButton = isAdmin ? (
    <button
      type="button"
      onClick={onDeleteClick}
      className="flex items-center justify-center cursor-pointer shrink-0"
      aria-label="멤버 삭제"
    >
      <SVGIcon icon="x" size={24} />
    </button>
  ) : null;

  return (
    <div className="flex h-auto sm:min-h-73 px-24 py-20 rounded-2xl bg-background-secondary">
      {/* 모바일 */}
      <div className="flex flex-col w-full sm:hidden">
        <div className="flex items-start gap-8">
          <div className="shrink-0">
            <Avatar imageUrl={imageUrl} altText={name} size="small" />
          </div>
          <button
            type="button"
            onClick={onNameClick}
            className="text-md font-medium leading-20 text-text-primary truncate flex-1 py-1 text-left hover:underline cursor-pointer"
          >
            {name}
          </button>
          {deleteButton}
        </div>
        <p className="text-xs font-regular leading-16 text-text-secondary truncate">
          {email}
        </p>
      </div>

      {/* PC/태블릿 */}
      <div className="hidden sm:flex items-center gap-12 w-full">
        <div className="shrink-0">
          <Avatar imageUrl={imageUrl} altText={name} size="large" />
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <button
            type="button"
            onClick={onNameClick}
            className="text-md font-medium leading-20 text-text-primary truncate text-left hover:underline cursor-pointer"
          >
            {name}
          </button>
          <p className="text-xs font-regular leading-16 text-text-secondary overflow-visible whitespace-normal wrap-break-word">
            {email}
          </p>
        </div>
        {deleteButton}
      </div>
    </div>
  );
}
