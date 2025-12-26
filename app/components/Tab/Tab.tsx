import clsx from "clsx";

interface TabProps {
  id: string;
  title: string;
  isActive?: boolean;
  onClick: (id: string) => void;
  controlsId: string;
}

export default function Tab({
  id,
  title,
  isActive,
  onClick,
  controlsId,
}: TabProps) {
  return (
    <button
      id={`tab-${id}`}
      onClick={() => onClick(id)}
      role="tab"
      aria-selected={isActive}
      aria-controls={controlsId}
      tabIndex={isActive ? 0 : -1}
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
