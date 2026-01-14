"use client";

import List from "@/components/Tasklist/List/List";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TaskDetailsContainer from "./tasks/TaskDetailsContainer";
import {
  deleteTasks,
  getSpecificTask,
  getTasks,
  patchTask,
} from "@/lib/api/task";
import { TaskDetail } from "@/lib/types/taskTest";
import TaskCreateModal from "@/components/Tasklist/TaskCreateModal";

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
  const [editTask, setEditTask] = useState<TaskDetail | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getTasks(groupId, Number(listId), baseDate);
      if (response && "error" in response) {
        setTasks([]);
      } else {
        setTasks(
          (response ?? []).map((task: TaskDetail) => ({
            ...task,
            isToggle: !!task.doneAt || (task.doneBy?.length ?? 0) > 0,
          }))
        );
      }
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // 탭 바뀔 때 마다 API 호출
  useEffect(() => {
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

  const handleUpdateTask = async (
    taskId: number,
    updates: Partial<TaskDetail>
  ) => {
    try {
      const result = await patchTask(groupId, Number(listId), taskId, updates);

      if ("error" in result) {
        alert(result.message);
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...result } : t))
      );
    } catch (err) {
      console.error(err);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleOpenEditModal = async (taskId: number) => {
    const detail = await getSpecificTask(groupId, Number(listId), taskId);

    if ("error" in detail) {
      alert(detail.message);
      return;
    }

    setEditTask(detail);
    setIsModalOpen(true);
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
            onEditTask={handleOpenEditModal}
          />
        ))}
        <TaskCreateModal
          groupId={groupId.toString()}
          taskListId={listId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditTask(undefined);
          }}
          taskToEdit={editTask}
          onTaskUpdated={(updatedTask) => {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === updatedTask.id ? { ...t, ...updatedTask } : t
              )
            );
          }}
          onTaskCreated={() => fetchTasks()}
        />
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
