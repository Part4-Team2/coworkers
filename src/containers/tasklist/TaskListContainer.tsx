"use client";

import List from "@/components/Tasklist/List/List";
import { MOCK_TASKS } from "@/mocks/task";
import { Task } from "@/types/task";
import { useMemo, useState } from "react";

interface TaskListProps {
  tabId: string;
  initialTasks?: Task[];
}

export default function TaskListContainer({
  tabId,
  initialTasks = MOCK_TASKS,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.tabId === tabId),
    [tasks, tabId]
  );

  if (filteredTasks.length === 0) {
    return (
      <div className="text-text-default text-center mx-auto my-0 p-100">
        아직 할 일이 없습니다 <br /> 할 일을 추가해보세요.
      </div>
    );
  }

  const handleToggle = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isToggle: !task.isToggle } : task
      )
    );
  };

  const handleClickKebab = (id: string) => {
    // setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-16">
      {filteredTasks.map((task) => (
        <List
          key={task.id}
          id={task.id}
          content={task.content}
          isToggle={task.isToggle}
          onToggle={handleToggle}
          onClickKebab={handleClickKebab}
          variant="detailed"
          commentCount={task.commentCount}
          frequency={task.frequency}
          date={task.date}
          tabId={task.tabId}
        />
      ))}
    </div>
  );
}
