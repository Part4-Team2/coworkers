"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TaskAddButtonContainer from "./TaskAddButtonContainer";

function ConditionalTaskAddButtonContent({
  groupId,
  taskListId,
}: {
  groupId: string;
  taskListId: string;
}) {
  const searchParams = useSearchParams();
  const isSidebarOpen = searchParams.get("task") !== null;

  if (isSidebarOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-50 z-50 right-[max(1.5rem,calc(50%-600px+1.5rem))]">
      <TaskAddButtonContainer groupId={groupId} taskListId={taskListId} />
    </div>
  );
}

export default function ConditionalTaskAddButton({
  groupId,
  taskListId,
}: {
  groupId: string;
  taskListId: string;
}) {
  return (
    <Suspense fallback={null}>
      <ConditionalTaskAddButtonContent
        groupId={groupId}
        taskListId={taskListId}
      />
    </Suspense>
  );
}
