"use client";

import { getGroup, GroupDetailResponse } from "@/lib/api/group";
import { createTaskList, getTaskList } from "@/lib/api/tasklist";
import { useEffect, useMemo, useState } from "react";
import List from "@/components/Tasklist/List/List";
import DateNavigator from "@/components/Tasklist/DateNavigator";
import TaskDetailsContainer from "./tasks/TaskDetailsContainer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TaskCreateModal, {
  CreateTaskForm,
} from "@/components/Tasklist/TaskCreateModal";
import TaskCreateButton from "../../components/Tasklist/TaskCreateButton";
import { GetTaskListResponse, Task } from "@/lib/types/task";
import {
  createTasks,
  deleteTask,
  deleteTaskRecurring,
  updateTask,
} from "@/lib/api/task";
import ListCreateButton from "@/components/Tasklist/ListCreateButton";
import TabList from "@/components/Tasklist/Tab/TabList";
import { toast } from "react-toastify";

interface TaskListPageContainerProps {
  groupId: string;
  selectedTaskListId: string;
  selectedDate?: string;
}

export default function TaskListPageContainer({
  groupId,
  selectedTaskListId,
  selectedDate,
}: TaskListPageContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [taskLists, setTaskLists] = useState<GroupDetailResponse["taskLists"]>(
    []
  );
  const [selectedTaskListData, setSelectedTaskListData] =
    useState<GetTaskListResponse | null>(null); // 선택된 것
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const openTaskId = searchParams.get("task");
  const openTask = selectedTaskListData?.tasks.find(
    (task) => task.id.toString() === openTaskId
  );

  const editingTask = useMemo(() => {
    return selectedTaskListData?.tasks.find((t) => t.id === editTaskId) ?? null;
  }, [selectedTaskListData, editTaskId]);

  // 사이드바 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (openTask) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [openTask]);
  // 리스트 페이지 헤더 날짜(date가 있으면 해당날짜, 없으면 "오늘")
  const baseDate = selectedDate ?? new Date().toISOString();

  // 1. 초기 로드: 모든 TaskList 가져오기
  useEffect(() => {
    async function loadTaskLists() {
      try {
        const response = await getGroup(groupId); // 이 API 필요!
        if (response.success) {
          setTaskLists(response.data.taskLists);
        } else {
          toast.error("리스트를 가져오는 중 오류가 발생했습니다.");
        }
      } catch (e) {
        toast.error("리스트를 가져오는 중 오류가 발생했습니다.");
      }
      setLoading(false);
    }
    loadTaskLists();
  }, [groupId]);

  // 2. 선택된 TaskList 변경시 상세 데이터 가져오기
  useEffect(() => {
    if (!selectedTaskListId) return;

    async function loadSelectedTaskList() {
      try {
        const date = selectedDate || new Date().toISOString().split("T")[0];
        const response = await getTaskList(groupId, selectedTaskListId, {
          date,
        });

        if (response.success) {
          setSelectedTaskListData(response.data);
        } else {
          toast.error("할 일 불러오는 중 오류가 발생했습니다.");
        }
      } catch (e) {
        toast.error("할 일 불러오는 중 오류가 발생했습니다.");
      }
    }

    loadSelectedTaskList();
  }, [groupId, selectedTaskListId, selectedDate]);

  // Task 클릭 핸들러 - 상세보기용
  const handleTaskClick = (taskId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("task", taskId.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleCloseSidebar = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("task");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Task 완료 토글
  const handleTaskToggle = async (taskId: number) => {
    if (!selectedTaskListData) return;

    const targetTask = selectedTaskListData.tasks.find(
      (task) => task.id === taskId
    );
    if (!targetTask) return;

    const willBeDone = !targetTask.doneAt;

    // 낙관적 업데이트
    setSelectedTaskListData({
      ...selectedTaskListData,
      tasks: selectedTaskListData.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              doneAt: task.doneAt ? null : new Date().toISOString(),
            }
          : task
      ),
    });

    try {
      const response = await updateTask(
        groupId,
        selectedTaskListId,
        String(taskId),
        {
          done: willBeDone,
        }
      );
      if (!response.success) {
        toast.error("완료 상태 변경 중 오류가 발생했습니다.");
      }
    } catch {
      toast.error("완료 상태 변경 중 오류가 발생했습니다.");
    }
  };

  // Task 업데이트
  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    if (!selectedTaskListData) return;

    // 낙관적 업데이트
    setSelectedTaskListData({
      ...selectedTaskListData,
      tasks: selectedTaskListData.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    });

    try {
      const response = await updateTask(
        groupId,
        selectedTaskListId,
        String(taskId),
        updates
      );
      if (!response.success) {
        toast.error("할 일 수정 중 오류가 발생했습니다.");
      }
    } catch {
      toast.error("할 일 수정 중 오류가 발생했습니다.");
    }

    setEditTaskId(null);
  };

  // Task 삭제
  const handleDeleteTask = async (task: {
    id: number;
    recurringId: number;
  }) => {
    if (!selectedTaskListData) return;

    // 낙관적 업데이트
    setSelectedTaskListData({
      ...selectedTaskListData,
      tasks: selectedTaskListData.tasks.filter((t) => t.id !== task.id),
    });

    try {
      let response;
      if (task.recurringId) {
        response = await deleteTaskRecurring(
          groupId,
          selectedTaskListId,
          String(task.id),
          String(task.recurringId)
        );
      } else {
        response = await deleteTask(
          groupId,
          selectedTaskListId,
          String(task.id)
        );
      }

      if (!response.success) {
        toast.error("할 일 삭제 중 오류가 발생했습니다.");
      }
    } catch {
      toast.error("할 일 삭제 중 오류가 발생했습니다.");
    }

    const params = new URLSearchParams(searchParams);
    params.delete("task");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Task 편집 (모달 등)
  const handleEditTask = (taskId: number) => {
    setEditTaskId(taskId);
  };

  // handleCreateTask 함수만 수정
  const handleCreateTask = async (form: CreateTaskForm) => {
    if (!selectedTaskListData) return;

    // ✅ 날짜와 시간을 올바르게 병합
    const year = form.startDate.getFullYear();
    const month = form.startDate.getMonth();
    const date = form.startDate.getDate();
    const hours = form.startTime.getHours();
    const minutes = form.startTime.getMinutes();

    // 로컬 시간으로 Date 객체 생성
    const localDateTime = new Date(year, month, date, hours, minutes, 0, 0);

    const createPayload = (() => {
      const basePayload = {
        name: form.name,
        description: form.description,
        // ✅ 로컬 시간을 UTC로 자동 변환하여 전송
        startDate: localDateTime.toISOString(),
      };

      switch (form.frequencyType) {
        case "MONTHLY":
          return {
            ...basePayload,
            frequencyType: "MONTHLY" as const,
            monthDay: form.monthDay!,
          };
        case "WEEKLY":
          return {
            ...basePayload,
            frequencyType: "WEEKLY" as const,
            weekDays: form.weekDays!,
          };
        case "DAILY":
          return {
            ...basePayload,
            frequencyType: "DAILY" as const,
          };
        case "ONCE":
          return {
            ...basePayload,
            frequencyType: "ONCE" as const,
          };
      }
    })();

    const response = await createTasks(
      groupId,
      selectedTaskListId,
      createPayload
    );

    if (!response.success) {
      toast.error("할 일 생성에 실패했습니다.");
      return;
    }

    const targetDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    const currentDate = selectedDate || new Date().toISOString().split("T")[0];

    const params = new URLSearchParams(searchParams);

    if (targetDate !== currentDate) {
      params.set("date", targetDate);
      router.push(`${pathname}?${params.toString()}`);
    } else {
      const refreshResponse = await getTaskList(groupId, selectedTaskListId, {
        date: targetDate,
      });

      if (refreshResponse.success) {
        setSelectedTaskListData({
          ...refreshResponse.data,
          tasks: refreshResponse.data.tasks,
        });
      }
    }
  };

  const handleCreateList = async (name: string) => {
    if (!name.trim()) return;

    // 낙관적 업데이트
    setTaskLists((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        groupId: Number(groupId),
        displayIndex: prev.length,
        tasks: [],
      },
    ]);

    try {
      const response = await createTaskList(groupId, name);
      if (!response.success) {
        toast.error("할 일 목록 생성 중 오류가 발생했습니다.");
      }
    } catch {
      toast.error("할 일 목록 생성 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="relative max-w-[1200px] mx-auto my-0 sm:px-24 px-16">
        <div className="text-xl font-bold mt-40">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="relative max-w-[1200px] mx-auto my-0 sm:px-24 px-16 mb-80">
      <div className="flex flex-col gap-24">
        <div className="text-xl font-bold mt-40">할 일</div>

        <div className="flex justify-between">
          <DateNavigator baseDate={baseDate} />
          <ListCreateButton onCreate={handleCreateList} />
        </div>
        <div className="h-20">
          <div className="overflow-x-auto custom-scrollbar">
            <TabList tabs={taskLists} />
          </div>
        </div>
        <main className="flex-1">
          {selectedTaskListData && (
            <div className="flex flex-col gap-16">
              {selectedTaskListData.tasks.length === 0 ? (
                <div className="text-text-default text-center mx-auto my-0 p-100">
                  아직 할 일이 없습니다 <br /> 할 일을 추가해보세요.
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-8">
                    {selectedTaskListData.tasks.map((task) => (
                      <List
                        {...task}
                        key={task.id}
                        onClick={() => handleTaskClick(task.id)}
                        isToggle={!!task.doneAt}
                        onToggle={handleTaskToggle}
                        variant="detailed"
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                        startDate={task.date}
                      />
                    ))}

                    <TaskCreateModal
                      isOpen={editTaskId !== null}
                      onClose={() => setEditTaskId(null)}
                      taskToEdit={editingTask}
                      onSubmit={(form) => {
                        if (editTaskId) {
                          handleUpdateTask(editTaskId, form); // PATCH
                        } else {
                          handleCreateTask(form); // POST
                        }
                      }}
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
                          onClose={handleCloseSidebar}
                          onToggleDone={(id) => handleTaskToggle(id)}
                          onTaskUpdated={(update) =>
                            handleUpdateTask(update.id, update)
                          }
                          onTaskDeleted={(id) =>
                            handleDeleteTask({
                              id,
                              recurringId: openTask.recurringId,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
        {!openTask && (
          <div className="fixed bottom-50 z-50 right-[max(1.5rem,calc(50%-600px+1.5rem))]">
            <TaskCreateButton onCreateTask={handleCreateTask} />
          </div>
        )}
      </div>
    </div>
  );
}
