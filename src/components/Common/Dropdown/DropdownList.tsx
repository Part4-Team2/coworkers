import clsx from "clsx";

interface Props {
  isOpen: boolean;
  options: string[];
  value?: string;
  size: "sm" | "md";
  position: string;
  onSelect: (value: string) => void;
}

const sizeClass = {
  sm: "w-94 text-sm",
  md: "w-120 text-md",
};

export default function DropdownList({
  isOpen,
  options,
  value,
  size,
  position,
  onSelect,
}: Props) {
  if (!isOpen) return null;

  return (
    <ul
      className={clsx(
        sizeClass[size],
        "absolute z-50 bg-background-secondary border rounded-xl overflow-hidden",
        position
      )}
    >
      {options.map((option) => (
        <li
          key={option}
          onClick={() => onSelect(option)}
          className={clsx(
            option === value
              ? "bg-background-tertiary"
              : "hover:bg-background-primary",
            "cursor-pointer p-8"
          )}
        >
          {option}
        </li>
      ))}
    </ul>
  );
}
