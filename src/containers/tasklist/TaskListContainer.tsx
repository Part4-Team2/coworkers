"use client";

import List, { ListProps } from "@/components/Tasklist/List/List";
import { Task } from "@/types/task";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TaskDetailsContainer from "./tasks/TaskDetailsContainer";

interface TaskListProps {
  initialTasks?: Task[];
}

export default function TaskListContainer({
  initialTasks = [],
}: TaskListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [tasks, setTasks] = useState<ListProps[]>(initialTasks);

  // initialTasks가 변경되면 업데이트 (탭 전환 시)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const openTaskId = searchParams.get("task");
  const openTask = useMemo(
    () => tasks.find((task) => task.id.toString() === openTaskId),
    [tasks, openTaskId]
  );

  // 사이드바 열릴 때 배경 스크롤 방지
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

  const handleTaskClick = (taskId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("task", taskId.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCloseSidebar = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("task");
    router.push(`${pathname}?${params.toString()}`);
  };

  // // Task 업데이트 (사이드바에서 수정 시)
  // const handleUpdateTask = (taskId: number, updates: Partial<Task>) => {
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

  const handleToggle = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isToggle: !task.isToggle } : task
      )
    );
    // TODO: API 호출로 상태 업데이트
  };

  const handleClickKebab = (id: number) => {
    // TODO: 케밥 메뉴 로직(useKebabMenu 사용)
  };

  if (tasks.length === 0) {
    return (
      <div className="text-text-default text-center mx-auto my-0 p-100">
        아직 할 일이 없습니다 <br /> 할 일을 추가해보세요.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-16">
        {tasks.map((task) => (
          <List
            key={task.id}
            id={task.id}
            name={task.name}
            isToggle={task.isToggle}
            onToggle={handleToggle}
            onClickKebab={handleClickKebab}
            variant="detailed"
            commentCount={task.commentCount}
            frequency={task.frequency}
            date={task.date}
            onClick={() => handleTaskClick(task.id)}
          />
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
