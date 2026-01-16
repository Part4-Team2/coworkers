"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTaskList,
  updateTaskList,
  deleteTaskList,
} from "@/lib/api/group";
import { MODAL_TYPES, type ModalState } from "./useModalState";
import { Todo } from "@/types/todo";

interface UseTodoActionsProps {
  teamId: string;
  todos: Todo[];
  modalState: ModalState;
  openModalWithDelay: (updates: Partial<ModalState>, delay?: number) => void;
  updateModalState: (updates: Partial<ModalState>) => void;
  resetModalState: () => void;
}

export function useTodoActions({
  teamId,
  todos,
  modalState,
  openModalWithDelay,
  updateModalState,
  resetModalState,
}: UseTodoActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 모달 열기 함수들
  const openCreateModal = useCallback(() => {
    openModalWithDelay(
      {
        type: MODAL_TYPES.TODO_LIST,
        todoListName: "",
        todoListNameError: "",
        selectedTodo: null,
        todoToDelete: null,
      },
      0
    );
  }, [openModalWithDelay]);

  const openEditModal = useCallback(
    (todoId: number) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo) {
        console.warn(`[openEditModal] Todo not found: ${todoId}`);
        return;
      }
      openModalWithDelay({
        type: MODAL_TYPES.TODO_EDIT,
        selectedTodo: todo,
        todoListName: todo.name,
        todoListNameError: "",
      });
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
    if (!modalState.todoListName.trim()) return;

    setIsLoading(true);
    try {
      const result = await createTaskList(teamId, modalState.todoListName);

      if (!result.success) {
        alert(result.error);
        return;
      }

      alert("할 일 목록이 생성되었습니다.");
      resetModalState();
      router.refresh();
    } catch (error) {
      console.error("[createTaskList]", error);
      alert("할 일 목록 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [modalState.todoListName, teamId, resetModalState, router]);

  const confirmEdit = useCallback(async () => {
    if (!modalState.selectedTodo || !modalState.todoListName.trim()) return;

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
      resetModalState();
      router.refresh();
    } catch (error) {
      console.error("[updateTaskList]", error);
      alert("할 일 목록 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [
    modalState.selectedTodo,
    modalState.todoListName,
    teamId,
    resetModalState,
    router,
  ]);

  const confirmDelete = useCallback(async () => {
    if (modalState.todoToDelete === null) return;

    setIsLoading(true);
    try {
      const result = await deleteTaskList(teamId, modalState.todoToDelete);

      if (!result.success) {
        alert(result.error);
        return;
      }

      alert("할 일 목록이 삭제되었습니다.");
      resetModalState();
      router.refresh();
    } catch (error) {
      console.error("[deleteTaskList]", error);
      alert("할 일 목록 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [modalState.todoToDelete, teamId, resetModalState, router]);

  // Input 변경 핸들러
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let error = "";

      if (value.length > 20) {
        error = "목록 이름은 최대 20자까지 입력 가능합니다.";
      }

      updateModalState({
        todoListName: value,
        todoListNameError: error,
      });
    },
    [updateModalState]
  );

  // validation 체크
  const isValidName =
    !modalState.todoListNameError && modalState.todoListName.trim();

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
    // validation
    isValidName,
  };
}
