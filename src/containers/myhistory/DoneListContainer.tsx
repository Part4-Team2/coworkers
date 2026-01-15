"use client";

import { useMemo } from "react";
import List from "@/components/Tasklist/List/List";
import { formatDate } from "@/utils/date";
import { TaskDetail } from "@/types/task";
import { FrequencyType } from "@/types/schemas";

interface DoneListContainerProps {
  initialData:
    | {
        tasksDone: Array<{
          displayIndex: number;
          writerId: number;
          userId: number;
          deletedAt?: string | null;
          frequency: string;
          description?: string;
          name: string;
          recurringId: number;
          doneAt: string;
          date: string;
          updatedAt: string;
          id: number;
        }>;
      }
    | { error: true; message: string };
}

export default function DoneListContainer({
  initialData,
}: DoneListContainerProps) {
  // 서버에서 받은 데이터를 Task 타입으로 변환
  const tasks = useMemo(() => {
    if ("error" in initialData) {
      // 개발 환경에서만 MOCK_TASKS 사용, 프로덕션에서는 빈 배열
      return [];
    }

    return initialData.tasksDone.map(
      (task): TaskDetail => ({
        id: task.id,
        name: task.name,
        description: task.description,
        doneAt: task.doneAt,
        date: task.date,
        frequency: task.frequency as FrequencyType,
        displayIndex: task.displayIndex,
        recurringId: task.recurringId,
        updatedAt: task.updatedAt,
        deletedAt: task.deletedAt ?? undefined,
        commentCount: 0,
        writer: {
          id: task.writerId,
          nickname: "",
          image: null,
        },
        doneBy: [],
      })
    );
  }, [initialData]);

  const groupedTasks = tasks.reduce(
    (acc, task) => {
      if (!task.doneAt) return acc;

      if (!acc[task.doneAt]) {
        acc[task.doneAt] = [];
      }
      acc[task.doneAt].push(task);
      return acc;
    },
    {} as Record<string, TaskDetail[]>
  );

  const sortedDates = Object.keys(groupedTasks).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (sortedDates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p className="text-md font-medium text-text-default">
          아직 히스토리가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <>
      {sortedDates.map((date) => (
        <div className="flex flex-col gap-16 mb-40" key={date}>
          <h2 className="text-lg font-medium">{formatDate(date)}</h2>
          {groupedTasks[date].map((task) => (
            <List
              key={task.id}
              id={task.id}
              name={task.name}
              isToggle={true}
              variant="simple"
              hideKebab={true}
              commentCount={task.commentCount ?? 0}
              frequency={task.frequency}
              date={task.date}
              displayIndex={task.displayIndex}
              recurringId={task.recurringId}
            />
          ))}
        </div>
      ))}
    </>
  );
}
