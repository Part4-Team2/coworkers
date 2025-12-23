"use client";

import React from "react";

export interface DropdownItem {
  id: string | number;
  label: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  selectedId?: string | number;
}

const Dropdown: React.FC<DropdownProps> = ({ items, selectedId }) => {
  return (
    <div className="rounded-[10px] border border-border-primary bg-background-secondary text-text-primary max-h-[200px] overflow-y-auto w-full">
      <ul className="space-y-0">
        {items.map((item) => (
          <li key={item.id}>
            <div
              className={`px-4 py-3 text-left text-sm transition-colors ${
                selectedId === item.id ? "bg-brand-primary text-inverse" : ""
              } cursor-default`}
            >
              {item.label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
