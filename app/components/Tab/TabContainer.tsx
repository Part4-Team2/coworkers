"use client";

import { useState } from "react";
import Tab from "./Tab";

interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface TabContainerProps {
  tabs: TabItem[];
  defaultActiveId?: string;
}

export default function TabContainer({
  tabs,
  defaultActiveId,
}: TabContainerProps) {
  const [activeTabId, setActiveTabId] = useState(
    defaultActiveId || tabs[0]?.id
  );

  return (
    <div>
      <div className="flex gap-12">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            title={tab.title}
            isActive={activeTabId === tab.id}
            onClick={setActiveTabId}
          />
        ))}
      </div>

      <div className="mt-16">
        {tabs.find((tab) => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
}
