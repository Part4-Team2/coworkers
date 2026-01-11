"use client";

import Tab from "./Tab";
import { TabItem } from "@/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface TabContainerProps {
  tab: TabItem[];
  defaultActiveId?: string;
}

export default function TabContainer({
  tab,
  defaultActiveId,
}: TabContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 어떤 탭을 실제로 보여줄지 결정(UI)
  const activeTabId = searchParams.get("tab") || defaultActiveId || tab[0]?.id;

  const switchTab = (tabId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);

    // 날짜 유지
    // TODO: date 없을 수 있는 상황(오늘 날짜)일 때 확인
    if (searchParams.get("date")) {
      params.set("date", searchParams.get("date")!);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  if (!tab || tab.length === 0) {
    return (
      <div className="text-text-default text-center mx-auto my-0 p-100">
        아직 할 일 목록이 없습니다. <br /> 새로운 목록을 추가해주세요.
      </div>
    );
  }

  return (
    <div>
      <div role="tablist" className="flex gap-12">
        {tab.map((t) => (
          <Tab
            key={t.id}
            id={t.id}
            title={t.title}
            isActive={activeTabId === t.id}
            onClick={() => switchTab(t.id)}
            controlsId={`panel-${t.id}`}
          />
        ))}
      </div>

      <div className="mt-16">
        {tab.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`panel-${t.id}`}
            aria-labelledby={`tab-${t.id}`}
            hidden={activeTabId !== t.id}
          >
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
