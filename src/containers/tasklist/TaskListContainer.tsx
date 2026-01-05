"use client";

import List from "@/components/Tasklist/List/List";
import { useMemo, useState } from "react";

interface Task {
  id: string;
  content: string;
  isToggle: boolean;
  tabId: string;
}

interface TaskMetadata extends Task {
  commentCount: number;
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  date: string;
}

interface TaskListProps {
  tabId: string;
  initialTasks?: TaskMetadata[];
}

const MOCK_TASKS: TaskMetadata[] = [
  {
    id: "1",
    tabId: "2",
    content: "법인 설립 안내 드리기",
    isToggle: true,
    commentCount: 3,
    frequency: "DAILY",
    date: "2026-01-01T11:02:32.192Z",
  },
  {
    id: "2",
    tabId: "2",
    content: "법인 설립 혹은 변경 등기 비용 안내 드리기",
    isToggle: false,
    commentCount: 3,
    frequency: "DAILY",
    date: "2026-01-01T11:02:32.192Z",
  },
  {
    id: "3",
    tabId: "2",
    content: "입력해주신 정보를 바탕으로 등기신청서 제출하기",
    isToggle: false,
    commentCount: 3,
    frequency: "DAILY",
    date: "2026-01-01T11:02:32.192Z",
  },
];

export default function TaskListContainer({
  tabId,
  initialTasks = MOCK_TASKS,
}: TaskListProps) {
  const [tasks, setTasks] = useState<TaskMetadata[]>(initialTasks);

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
        />
      ))}
    </div>
  );
}
