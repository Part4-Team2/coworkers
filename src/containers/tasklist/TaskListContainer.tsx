"use client";

import List from "@/components/Tasklist/List/List";
import { MOCK_TASKS } from "@/mocks/task";
import { Task } from "@/types/task";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TaskDetailsContainer from "./tasks/TaskDetailsContainer";

interface TaskListProps {
  tabId: string;
  initialTasks?: Task[];
}

export default function TaskListContainer({
  tabId,
  initialTasks = MOCK_TASKS,
}: TaskListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const teamid = params.teamid as string;

  const openTaskId = searchParams.get("task");

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.tabId === tabId),
    [tasks, tabId]
  );

  const openTask = openTaskId
    ? tasks.find((task) => task.id === openTaskId)
    : null;

  useEffect(() => {
    if (openTask) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openTask]);

  if (filteredTasks.length === 0) {
    return (
      <div className="text-text-default text-center mx-auto my-0 p-100">
        아직 할 일이 없습니다 <br /> 할 일을 추가해보세요.
      </div>
    );
  }

  const handleTaskClick = (taskId: string) => {
    router.push(`/${teamid}/tasklist?task=${taskId}`);
  };

  const handleCloseSidebar = () => {
    router.push(`/${teamid}/tasklist`);
  };

  // // Task 업데이트 (사이드바에서 수정 시)
  // const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) =>
  //       task.id === taskId ? { ...task, ...updates } : task
  //     )
  //   );

  //   // TODO: API 호출
  //   // await fetch(`/api/tasks/${taskId}`, {
  //   //   method: 'PATCH',
  //   //   body: JSON.stringify(updates)
  //   // });
  // };

  const handleToggle = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isToggle: !task.isToggle } : task
      )
    );
  };

  const handleClickKebab = (id: string) => {
    // TODO: 케밥 메뉴 로직(useKebabMenu 사용)
  };

  return (
    <div>
      <div className="flex flex-col gap-16">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleTaskClick(task.id)}
            className="cursor-pointer"
          >
            <List
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
          </div>
        ))}
      </div>
      {openTask && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 bg-black/30 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-background-secondary shadow-xl overflow-y-auto"
          >
            <TaskDetailsContainer
              task={openTask}
              mode="sidebar"
              onClose={handleCloseSidebar}
            />
          </div>
        </div>
      )}
    </div>
  );
}
