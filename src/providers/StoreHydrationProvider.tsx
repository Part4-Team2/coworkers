"use client";

import { useEffect } from "react";
import { useHeaderStore } from "@/store/headerStore";

/**
 * Zustand persist store의 hydration을 앱 최상위에서 트리거하는 Provider
 * 이를 통해 개별 페이지에서 rehydrate를 호출하지 않아도 됨
 */
export default function StoreHydrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // persist가 없으면 실행하지 않음 명시적으로 체크
    if (useHeaderStore.persist) {
      useHeaderStore.persist.rehydrate();
    }
  }, []);

  return <>{children}</>;
}
