"use client";

import { useCallback } from "react";
import { createTaskList, updateTaskList, deleteTaskList } from "@/api/group";
import { MODAL_TYPES, type ModalState } from "./useModalState";
import { Todo } from "@/types/todo";

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
    if (modalState.todoListName.trim()) {
      try {
        const result = await createTaskList(teamId, modalState.todoListName);

        if ("error" in result) {
          alert(result.message);
          return;
        }

        window.location.reload();
      } catch {
        alert("할 일 목록 생성 중 오류가 발생했습니다.");
      }
    }
  }, [modalState.todoListName, teamId]);

  const confirmEdit = useCallback(async () => {
    if (modalState.selectedTodo && modalState.todoListName.trim()) {
      try {
        const result = await updateTaskList(
          teamId,
          modalState.selectedTodo.id,
          modalState.todoListName
        );

        if ("error" in result) {
          alert(result.message);
          return;
        }

        window.location.reload();
      } catch {
        alert("할 일 목록 수정 중 오류가 발생했습니다.");
      }
    }
  }, [modalState.selectedTodo, modalState.todoListName, teamId]);

  const confirmDelete = useCallback(async () => {
    if (modalState.todoToDelete !== null) {
      try {
        const result = await deleteTaskList(teamId, modalState.todoToDelete);

        if ("error" in result) {
          alert(result.message);
          return;
        }

        window.location.reload();
      } catch {
        alert("할 일 목록 삭제 중 오류가 발생했습니다.");
      }
    }
  }, [modalState.todoToDelete, teamId]);

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
  };
}
