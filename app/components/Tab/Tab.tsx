import clsx from "clsx";

interface TabProps {
  id: string;
  title: string;
  isActive?: boolean;
  onClick: (id: string) => void;
}

export default function Tab({ id, title, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={clsx(
        "appearance-none bg-transparent p-0 pb-5 text-lg font-medium border-b-1",
        isActive
          ? "text-text-tertiary border-current"
          : "text-text-default border-transparent"
      )}
    >
      {title}
    </button>
  );
}
