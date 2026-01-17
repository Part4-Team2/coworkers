import clsx from "clsx";

interface TabProps {
  name: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
  tabIndex: number;
  ariaSelected?: boolean;
}

export default function TabItem({
  name,
  onClick,
  isActive,
  className,
}: TabProps) {
  return (
    <button
      onClick={onClick}
      role="tab"
      className={clsx(
        "appearance-none bg-transparent p-0 pb-5 text-lg font-medium border-b-1",
        isActive
          ? "text-text-tertiary border-current"
          : "text-text-default border-transparent",
        className
      )}
    >
      {name}
    </button>
  );
}
