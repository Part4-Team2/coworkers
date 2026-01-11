"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createTaskList, updateTaskList, deleteTaskList } from "@/api/group";
import { MODAL_TYPES, type ModalState } from "./useModalState";
import { Todo } from "@/types/todo";
import { useApiMutation } from "./useApiMutation";

interface UseTodoActionsProps {
  teamId: string;
  todos: Todo[];
  modalState: ModalState;
  openModalWithDelay: (updates: Partial<ModalState>, delay?: number) => void;
  updateModalState: (updates: Partial<ModalState>) => void;
}

export function useTodoActions({
  teamId,
  todos,
  modalState,
  openModalWithDelay,
  updateModalState,
}: UseTodoActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 모달 열기 함수들
  const openCreateModal = useCallback(() => {
    openModalWithDelay({ type: MODAL_TYPES.TODO_LIST }, 0);
  }, [openModalWithDelay]);

  const openEditModal = useCallback(
    (todoId: number) => {
      const todo = todos.find((t) => t.id === todoId);
      if (todo) {
        openModalWithDelay({
          type: MODAL_TYPES.TODO_EDIT,
          selectedTodo: todo,
          todoListName: todo.name,
        });
      }
    },
    [todos, openModalWithDelay]
  );

  const openDeleteModal = useCallback(
    (todoId: number) => {
      openModalWithDelay({
        type: MODAL_TYPES.TODO_DELETE,
        todoToDelete: todoId,
      });
    },
    [openModalWithDelay]
  );

  // API 호출 함수들
  const confirmCreate = useCallback(async () => {
    if (modalState.todoListName.trim() && !isLoading) {
      setIsLoading(true);
      try {
        const result = await createTaskList(teamId, modalState.todoListName);

        if (!result.success) {
          alert(result.error);
          return;
        }

        alert("할 일 목록이 생성되었습니다.");
        router.refresh();
      } catch (error) {
        console.error("[createTaskList]", error);
        alert("할 일 목록 생성 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [modalState.todoListName, teamId, isLoading, router]);

  const confirmEdit = useCallback(async () => {
    if (
      modalState.selectedTodo &&
      modalState.todoListName.trim() &&
      !isLoading
    ) {
      setIsLoading(true);
      try {
        const result = await updateTaskList(
          teamId,
          modalState.selectedTodo.id,
          modalState.todoListName
        );

        if (!result.success) {
          alert(result.error);
          return;
        }

        alert("할 일 목록이 수정되었습니다.");
        window.location.reload();
      } catch {
        alert("할 일 목록 수정 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [modalState.selectedTodo?.id, modalState.todoListName, teamId, isLoading]);

  const confirmDelete = useCallback(async () => {
    if (modalState.todoToDelete !== null && !isLoading) {
      setIsLoading(true);
      try {
        const result = await deleteTaskList(teamId, modalState.todoToDelete);

        if (!result.success) {
          alert(result.error);
          return;
        }

        alert("할 일 목록이 삭제되었습니다.");
        router.refresh();
      } catch (error) {
        console.error("[deleteTaskList]", error);
        alert("할 일 목록 삭제 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [modalState.todoToDelete, teamId, isLoading, router]);

  // Input 변경 핸들러
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateModalState({ todoListName: e.target.value });
    },
    [updateModalState]
  );

  return {
    // 모달 열기
    openCreateModal,
    openEditModal,
    openDeleteModal,
    // API 호출
    confirmCreate,
    confirmEdit,
    confirmDelete,
    // Input 핸들러
    handleNameChange,
    // 로딩 상태
    isLoading,
  };
}
