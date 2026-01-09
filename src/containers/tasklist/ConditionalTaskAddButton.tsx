"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TaskAddButtonContainer from "./TaskAddButtonContainer";

function ConditionalTaskAddButtonContent() {
  const searchParams = useSearchParams();
  const isSidebarOpen = searchParams.get("task") !== null;

  if (isSidebarOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-50 z-50 right-[max(1.5rem,calc(50%-600px+1.5rem))]">
      <TaskAddButtonContainer />
    </div>
  );
}

export default function ConditionalTaskAddButton() {
  return (
    <Suspense fallback={null}>
      <ConditionalTaskAddButtonContent />
    </Suspense>
  );
}
