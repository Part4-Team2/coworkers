import Avatar from "@/components/Common/Avatar/Avatar";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";

interface MemberProps {
  name: string;
  email: string;
  imageUrl?: string;
  isAdmin?: boolean;
  onDeleteClick?: () => void;
  onNameClick?: () => void;
}

interface MemberNameButtonProps {
  name: string;
  onClick?: () => void;
  className?: string;
}

interface DeleteButtonProps {
  onClick?: () => void;
}

const MemberNameButton = ({
  name,
  onClick,
  className,
}: MemberNameButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={className}
    aria-label={`${name} 프로필 보기`}
  >
    {name}
  </button>
);

const DeleteButton = ({ onClick }: DeleteButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center cursor-pointer shrink-0"
    aria-label="멤버 삭제"
  >
    <SVGIcon icon="x" size={24} />
  </button>
);

export default function Member({
  name,
  email,
  imageUrl,
  isAdmin = false,
  onDeleteClick,
  onNameClick,
}: MemberProps) {
  return (
    <div className="flex h-auto sm:min-h-73 px-24 py-20 rounded-2xl bg-background-secondary">
      {/* 모바일 */}
      <div className="flex flex-col w-full sm:hidden">
        <div className="flex items-start gap-8">
          <div className="shrink-0">
            <Avatar imageUrl={imageUrl} altText={name} size="small" />
          </div>
          <MemberNameButton
            name={name}
            onClick={onNameClick}
            className="text-md font-medium leading-20 text-text-primary truncate flex-1 py-1 text-left hover:underline cursor-pointer"
          />
          {isAdmin && <DeleteButton onClick={onDeleteClick} />}
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
          <MemberNameButton
            name={name}
            onClick={onNameClick}
            className="text-md font-medium leading-20 text-text-primary truncate text-left hover:underline cursor-pointer"
          />
          <p className="text-xs font-regular leading-16 text-text-secondary overflow-visible whitespace-normal wrap-break-word">
            {email}
          </p>
        </div>
        {isAdmin && <DeleteButton onClick={onDeleteClick} />}
      </div>
    </div>
  );
}
