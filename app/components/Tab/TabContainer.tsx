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
      <div role="tablist" className="flex gap-12">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            title={tab.title}
            isActive={activeTabId === tab.id}
            onClick={setActiveTabId}
            controlsId={`panel-${tab.id}`}
          />
        ))}
      </div>

      <div className="mt-16">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTabId !== tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
