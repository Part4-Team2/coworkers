"use client";

import List, { ListProps } from "@/components/Tasklist/List/List";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TaskDetailsContainer from "./tasks/TaskDetailsContainer";
import { getTasks } from "@/lib/api/task";

interface TaskListProps {
  groupId: number;
  listId: string;
  baseDate: string;
}

export default function TaskListContainer({
  groupId,
  listId,
  baseDate,
}: TaskListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [tasks, setTasks] = useState<ListProps[]>([]);
  // TODO: 로딩 UI 팀 컨벤션 정해지면 수정
  const [loading, setLoading] = useState(true);

  // 탭 바뀔 때 마다 API 호출
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const response = await getTasks(groupId, Number(listId), baseDate);
        if (response && "error" in response) {
          console.error("할 일 로드 실패:", response.message);
          setTasks([]);
        } else {
          setTasks(
            (response ?? []).map((task: ListProps) => ({
              ...task,
              isToggle: !!task.doneAt,
            }))
          );
        }
      } catch (err) {
        console.error("할 일 로드 실패", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [groupId, listId, baseDate]);

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

  if (loading) return <div className="text-center p-40">로딩 중...</div>;

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
