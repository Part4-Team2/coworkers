"use client";

import DropdownList from "./DropdownList";
import DropdownTrigger from "./DropdownTrigger";
import { IconMapTypes } from "../SVGIcon/iconMap";
import { useState, useEffect, useRef } from "react";

// trigger를 icon으로 사용시, 억지로 끼워 맞춰야하는 value prop을 선택으로 바꾸었습니다.
interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  size: "sm" | "md";
  trigger: "icon" | "text";
  value?: string;
  icon?: IconMapTypes;

  // 해당 props는 위치를 조절할 수 있게 됩니다.
  listPosition?: string;
}

function Dropdown({
  options,
  onSelect,
  size = "md",
  trigger,
  value,
  icon = "toggle",
  listPosition = "top-full",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  // 바깥 클릭하면 닫히는 함수입니다.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <DropdownTrigger
        trigger={trigger}
        value={value}
        size={size}
        icon={icon}
        onClick={toggleDropdown}
      />

      <DropdownList
        isOpen={isOpen}
        options={options}
        value={value}
        size={size}
        position={listPosition}
        onSelect={(v) => {
          onSelect(v);
          closeDropdown();
        }}
      />
    </div>
  );
}

export default Dropdown;
