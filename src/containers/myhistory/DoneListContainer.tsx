"use client";

import List from "@/components/Tasklist/List/List";
import { MOCK_TASKS } from "@/mocks/task";
import { formatDate } from "@/utils/date";

export default function DoneListContainer() {
  const groupedTasks = MOCK_TASKS.reduce(
    (acc, task) => {
      // api 연결 후 isToggle === true 만 불러오기
      if (!task.doneAt) return acc;

      if (!acc[task.doneAt]) {
        acc[task.doneAt] = [];
      }
      acc[task.doneAt].push(task);
      return acc;
    },
    {} as Record<string, typeof MOCK_TASKS>
  );

  const sortedDates = Object.keys(groupedTasks).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      {sortedDates.map((date) => (
        <div className="flex flex-col gap-16 mb-40" key={date}>
          <h2 className="text-lg font-medium">{formatDate(date)}</h2>
          {groupedTasks[date].map((task) => (
            <List
              key={task.id}
              id={task.id}
              content={task.content}
              onToggle={() => {}}
              onClickKebab={() => {}}
              isToggle={true}
              variant="simple"
            />
          ))}
        </div>
      ))}
    </>
  );
}
