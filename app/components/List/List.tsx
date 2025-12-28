import SVGIcon from "@/app/components/SVGIcon/SVGIcon";
import clsx from "clsx";

interface ListProps {
  id: string;
  isToggle?: boolean;
  onToggle: () => void;
  content: string;
  onClickKebab: () => void;
}

export default function List({
  id, // 부모에서 사용
  isToggle = false,
  onToggle,
  content,
  onClickKebab,
}: ListProps) {
  return (
    <div className="flex items-start justify-between bg-background-secondary px-14 py-10 rounded-[8px]">
      <div className="flex items-start gap-7">
        <button onClick={onToggle}>
          <SVGIcon icon={isToggle ? "checkboxActive" : "checkboxDefault"} />
        </button>
        <div
          className={clsx(
            "flex-1 text-text-primary text-md font-regular",
            isToggle && "line-through"
          )}
        >
          {content}
        </div>
      </div>
      <button onClick={onClickKebab}>
        <SVGIcon icon="kebabSmall" />
      </button>
    </div>
  );
}
