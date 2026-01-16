import clsx from "clsx";
import SVGIcon from "../SVGIcon/SVGIcon";
import Avatar from "../Avatar/Avatar";
import { useHeaderStore } from "@/store/headerStore";
import { IconMapTypes } from "../SVGIcon/iconMap";

interface Props {
  trigger: "text" | "icon" | "avatar";
  value?: string;
  size: "sm" | "md" | "lg";
  icon: IconMapTypes;
  background: "primary" | "secondary";
  onClick: () => void;
}

const sizeClass = {
  sm: "w-94 text-sm p-8",
  md: "w-120 text-md px-14 py-10",
  lg: "w-180 text-md px-14 py-10",
};

const backgroundClass = {
  primary: "bg-background-primary",
  secondary: "bg-background-secondary",
};

export default function DropdownTrigger({
  trigger,
  value,
  size,
  icon,
  background,
  onClick,
}: Props) {
  const profileImage = useHeaderStore((s) => s.profileImage);

  if (trigger === "icon") {
    return (
      <span onClick={onClick} className="cursor-pointer">
        <SVGIcon icon={icon} size="md" />
      </span>
    );
  }

  if (trigger === "avatar") {
    return (
      <div className={clsx("flex justify-center")} onClick={onClick}>
        <Avatar
          imageUrl={profileImage ? profileImage : undefined}
          altText="profile"
          size="large"
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        sizeClass[size],
        backgroundClass[background],
        "flex justify-between rounded-xl cursor-pointer"
      )}
    >
      <span className="line-clamp-1">{value}</span>
      <SVGIcon icon={icon} size="md" />
    </div>
  );
}
