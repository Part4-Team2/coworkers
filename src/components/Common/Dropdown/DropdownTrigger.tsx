import clsx from "clsx";
import SVGIcon from "../SVGIcon/SVGIcon";
import { IconMapTypes } from "../SVGIcon/iconMap";

interface Props {
  trigger: "text" | "icon";
  value?: string;
  size: "sm" | "md";
  icon: IconMapTypes;
  onClick: () => void;
}

const sizeClass = {
  sm: "w-94 text-sm p-8",
  md: "w-120 text-md px-14 py-10",
};

export default function DropdownTrigger({
  trigger,
  value,
  size,
  icon,
  onClick,
}: Props) {
  if (trigger === "icon") {
    return (
      <span onClick={onClick} className="cursor-pointer">
        <SVGIcon icon={icon} size="md" />
      </span>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        sizeClass[size],
        "flex justify-between rounded-xl bg-background-secondary cursor-pointer"
      )}
    >
      <span className="line-clamp-1">{value}</span>
      <SVGIcon icon={icon} size="md" />
    </div>
  );
}
