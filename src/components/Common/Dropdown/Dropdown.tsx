"use client";

import clsx from "clsx";
import SVGIcon from "../SVGIcon/SVGIcon";
import { IconMapTypes } from "../SVGIcon/iconMap";
import { useState, useEffect, useRef } from "react";

export type DropdownSize = "md" | "sm";
export type TriggerStyle = "text" | "icon";

// trigger로 dropdown style 지정 가능합니다.
// icon으로 원하는 아이콘으로 적용할 수 있습니다.
interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  size: DropdownSize;
  trigger: TriggerStyle;
  value: string;
  icon?: IconMapTypes;
}

// Text로 정할시 반영되는 크기. Default "md"
const sizeClass: Record<DropdownSize, string> = {
  sm: "w-94 text-sm p-8",
  md: "w-120 text-md px-14 py-10",
};

// Text/Icon 공통으로 반영되는 List 크기. Default "md"
const sizeListClass: Record<DropdownSize, string> = {
  sm: "w-94 text-sm",
  md: "w-120 text-md",
};

function Dropdown({
  options,
  onSelect,
  size = "md",
  trigger,
  value,
  icon = "toggle",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 트리거에 따라 나오는 UI가 다릅니다.
  const renderTrigger = () => {
    if (trigger === "text") {
      return (
        <div
          className={clsx(
            sizeClass[size],
            "flex justify-between rounded-xl bg-background-secondary cursor-pointer"
          )}
          onClick={toggleDropdown}
        >
          <span className="overflow-hidden text-ellipsis line-clamp-1">
            {value}
          </span>
          <SVGIcon icon={icon} size="md" />
        </div>
      );
    }

    return (
      <span onClick={toggleDropdown} className="cursor-pointer">
        <SVGIcon icon={icon} size="md" />
      </span>
    );
  };

  // 트리거를 누르면 리스트가 등장합니다.
  const renderList = () =>
    isOpen && (
      <ul
        className={clsx(
          sizeListClass[size],
          "bg-background-secondary absolute top-full z-50",
          "border border-border-primary rounded-xl overflow-hidden"
        )}
      >
        {options.map((option) => {
          const isSelected = value === option;

          return (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={clsx(
                isSelected
                  ? "bg-background-tertiary"
                  : "bg-background-secondary hover:bg-background-primary",
                "cursor-pointer p-8"
              )}
            >
              {option}
            </li>
          );
        })}
      </ul>
    );

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {renderTrigger()}
      {renderList()}
    </div>
  );
}

export default Dropdown;
