"use client";

import List from "@/components/Tasklist/List/List";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TaskDetailsContainer from "./tasks/TaskDetailsContainer";
import { deleteTasks, getTasks, patchTask } from "@/lib/api/task";
import { TaskDetail, TaskListItem } from "@/lib/types/taskTest";

interface TaskListProps {
  groupId: number;
  listId: string;
  baseDate: string;
}

interface TaskWithToggle extends TaskDetail {
  isToggle: boolean; // doneAt나 doneBy 기반 UI 토글
}

export default function TaskListContainer({
  groupId,
  listId,
  baseDate,
}: TaskListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [tasks, setTasks] = useState<TaskWithToggle[]>([]);
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
            (response ?? []).map((task: TaskDetail) => ({
              ...task,
              isToggle: !!task.doneAt || (task.doneBy?.length ?? 0) > 0,
              displayIndex: task.displayIndex,
              recurringId: task.recurringId,
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
    document.body.style.overflow = openTask ? "hidden" : "";
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

  const handleToggle = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isToggle: !task.isToggle } : task
      )
    );
    // TODO: API 호출 -> doneAt/doneBy 업데이트
  };

  const handleUpdateTask = async () => {
    console.log("api PATCH 로직");
  };

  // Task 삭제
  const handleDeleteTask = async (task: {
    id: number;
    recurringId: number;
  }) => {
    try {
      const result = await deleteTasks(
        groupId,
        Number(listId),
        task.id,
        task.recurringId
      );

      if ("error" in result) {
        alert(result.message);
        return;
      }

      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
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
            variant="detailed"
            commentCount={task.commentCount}
            frequency={task.frequency}
            date={task.date}
            displayIndex={task.displayIndex}
            recurringId={task.recurringId}
            onClick={() => handleTaskClick(task.id)}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
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
              groupId={groupId}
              taskListId={Number(listId)}
              onClose={handleCloseSidebar}
            />
          </div>
        </div>
      )}
    </div>
  );
}
