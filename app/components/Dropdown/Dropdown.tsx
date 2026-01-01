"use client";

import clsx from "clsx";
import SVGIcon from "../SVGIcon/SVGIcon";
import { IconMapTypes } from "../SVGIcon/iconMap";
import { useState, useEffect, useRef } from "react";

type DropdownSize = "md" | "sm";

// 드롭다운 활용시 문자열 배열을 집어넣어주시면 됩니다.
interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  size: DropdownSize;
  value: string;
  icon?: IconMapTypes;
}

const sizeClass: Record<DropdownSize, string> = {
  sm: "w-94 text-sm p-8",
  md: "w-120 text-md px-14 py-10",
};

const sizeListClass: Record<DropdownSize, string> = {
  sm: "w-94 text-sm",
  md: "w-120 text-md",
};

function Dropdown({
  options,
  onSelect,
  size = "md",
  value,
  icon = "toggle",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (): void => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleSelect = (option: string): void => {
    onSelect(option);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // 바깥 클릭을 하면 사라집니다.
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        `${sizeClass[size]}`,
        "rounded-xl bg-background-secondary relative"
      )}
    >
      <div className="flex justify-between">
        <span className="overflow-hidden text-ellipsis line-clamp-1">
          {value}
        </span>
        {/* 다른 아이콘이나 버튼을 받을 수 있게 해야댐. */}
        <span className="cursor-pointer" onClick={toggleDropdown}>
          <SVGIcon icon={icon} size="md" />
        </span>
      </div>
      {/* popover 형태로 짜야한다. */}
      {isOpen && (
        <ul
          className={clsx(
            `${sizeListClass[size]}`,
            "bg-background-secondary absolute top-full right-0 z-50",
            "border border-border-primary rounded-xl overflow-hidden"
          )}
        >
          {options.map((option) => {
            const isSelected = value === option;

            return (
              <li
                key={option}
                onClick={() => {
                  handleSelect(option);
                }}
                className={clsx(
                  `${isSelected ? "bg-background-tertiary" : "bg-background-secondary hover:bg-background-primary"}`,
                  "cursor-pointer p-8"
                )}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
