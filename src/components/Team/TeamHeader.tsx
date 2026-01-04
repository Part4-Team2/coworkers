import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import { useBlurActiveElement } from "@/hooks/useBlurActiveElement";

interface TeamHeaderProps {
  teamName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DROPDOWN_ACTIONS = {
  EDIT: "수정하기",
  DELETE: "삭제하기",
} as const;

export default function TeamHeader({
  teamName,
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
      <h1 className="ml-24 font-medium text-xl leading-xl text-text-primary text-center">
        {teamName}
      </h1>

      <div className="absolute right-80 overflow-hidden">
        <SVGIcon icon="thumbnailTeam" width={181} height={64} />
      </div>

      <div className="absolute right-24 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <Dropdown
          options={[DROPDOWN_ACTIONS.EDIT, DROPDOWN_ACTIONS.DELETE]}
          onSelect={handleSelect}
          size="md"
          trigger="icon"
          icon="gear"
          listPosition="top-[calc(100%+8px)] right-0"
        />
      </div>
    </div>
  );
}
