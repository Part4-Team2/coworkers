import clsx from "clsx";

interface Props {
  isOpen: boolean;
  options: string[];
  value?: string;
  size: "sm" | "md" | "lg";
  position: string;
  onSelect: (value: string) => void;
  align?: "left" | "center";
}

const sizeClass = {
  sm: "w-94 text-sm",
  md: "w-120 text-md",
  lg: "w-180 text-md",
};

export default function DropdownList({
  isOpen,
  options,
  value,
  size,
  position,
  onSelect,
  align = "left",
}: Props) {
  if (!isOpen) return null;

  return (
    <ul
      className={clsx(
        sizeClass[size],
        "absolute z-50 bg-background-secondary border border-text-primary/10 rounded-xl overflow-y-auto max-h-160 py-4",
        position
      )}
    >
      {options.map((option) => (
        <li
          key={option}
          onClick={() => onSelect(option)}
          className={clsx(
            "hover:bg-background-primary",
            "cursor-pointer py-12 px-10",
            align === "center" ? "text-center" : "text-left"
          )}
        >
          {option}
        </li>
      ))}
    </ul>
  );
}
