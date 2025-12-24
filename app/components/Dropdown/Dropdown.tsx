"use client";

import { useState, useEffect, useRef } from "react";

type DropdownSize = "md" | "sm";

// 드롭다운 활용시 문자열 배열을 집어넣어주시면 됩니다.
interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  size: DropdownSize;
  value: string;
}

const sizeClass: Record<DropdownSize, string> = {
  sm: "w-94 text-sm p-8",
  md: "w-120 text-md px-14 py-10",
};

const sizeListClass: Record<DropdownSize, string> = {
  sm: "w-94 text-sm",
  md: "w-120 text-md",
};

function Dropdown({ options, onSelect, size = "md", value }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (): void => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleSelect = (option: string): void => {
    onSelect(option);
    setIsOpen(() => false);
  };

  // 바깥 클릭을 하면 사라집니다.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      onClick={toggleDropdown}
      className={`${sizeClass[size]} rounded-xl bg-background-secondary relative`}
    >
      <div className="flex justify-between">
        <span>{value}</span>
        <span className="cursor-pointer">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <ul
          className={`${sizeListClass[size]} bg-background-secondary absolute top-full right-0 border border-border-primary rounded-xl overflow-hidden`}
        >
          {options.map((option) => {
            const isSelected = value === option;

            return (
              <li
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}
                className={`cursor-pointer p-8 ${isSelected ? "bg-background-tertiary" : "bg-background-secondary hover:bg-background-primary"}`}
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
