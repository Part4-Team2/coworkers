import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import { useBlurActiveElement } from "@/hooks/useBlurActiveElement";

interface TeamHeaderProps {
  teamName: string;
  userRole: "ADMIN" | "MEMBER";
  onEdit?: () => void;
  onDelete?: () => void;
}

const DROPDOWN_ACTIONS = {
  EDIT: "수정하기",
  DELETE: "삭제하기",
} as const;

export default function TeamHeader({
  teamName,
  userRole,
  onEdit,
  onDelete,
}: TeamHeaderProps) {
  const blurActiveElement = useBlurActiveElement();

  const handleSelect = (value: string) => {
    blurActiveElement();

    if (value === DROPDOWN_ACTIONS.EDIT && onEdit) {
      onEdit();
    } else if (value === DROPDOWN_ACTIONS.DELETE && onDelete) {
      onDelete();
    }
  };

  return (
    <div className="relative w-full h-64 rounded-xl border border-border-primary bg-[rgba(248,250,252,0.10)] flex items-center">
      <h1 className="ml-24 mr-auto font-medium text-xl leading-xl text-text-primary truncate max-w-[calc(100%-120px)] sm:max-w-[calc(100%-280px)] lg:max-w-[calc(100%-300px)]">
        {teamName}
      </h1>

      <div className="absolute right-80 overflow-hidden">
        <SVGIcon icon="thumbnailTeam" width={181} height={64} />
      </div>

      {userRole === "ADMIN" && (
        <div className="absolute right-24 top-1/2 -translate-y-1/2 flex items-center justify-center [&_ul]:overflow-hidden">
          <Dropdown
            options={[DROPDOWN_ACTIONS.EDIT, DROPDOWN_ACTIONS.DELETE]}
            onSelect={handleSelect}
            size="md"
            trigger="icon"
            icon="gear"
            listPosition="top-[calc(100%+8px)] right-0"
          />
        </div>
      )}
    </div>
  );
}
