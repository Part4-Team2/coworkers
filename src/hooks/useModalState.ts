"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Todo } from "@/types/todo";
import { Member as MemberType } from "@/types/member";

// 모달 타입 상수 정의
export const MODAL_TYPES = {
  INVITE: "invite",
  TODO_LIST: "todo-list",
  TODO_EDIT: "todo-edit",
  TODO_DELETE: "todo-delete",
  PROFILE: "profile",
  MEMBER_DELETE: "member-delete",
  TEAM_DELETE: "team-delete",
} as const;

export type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES] | null;

const MODAL_OPEN_DELAY = 100; // 드롭다운 닫힌 후 모달 오픈 지연 (ms)

export interface ModalState {
  type: ModalType;
  selectedMember: MemberType | null;
  memberToDelete: number | null;
  todoListName: string;
  selectedTodo: Todo | null;
  todoToDelete: number | null;
}

const initialModalState: ModalState = {
  type: null,
  selectedMember: null,
  memberToDelete: null,
  todoListName: "",
  selectedTodo: null,
  todoToDelete: null,
};

export function useModalState() {
  const [modalState, setModalState] = useState<ModalState>(initialModalState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const openModalWithDelay = useCallback(
    (updates: Partial<ModalState>, delay = MODAL_OPEN_DELAY) => {
      // 기존 타이머 취소
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (delay > 0) {
        timerRef.current = setTimeout(() => {
          setModalState((prev) => ({ ...prev, ...updates }));
          timerRef.current = null;
        }, delay);
      } else {
        setModalState((prev) => ({ ...prev, ...updates }));
      }
    },
    []
  );

  const resetModalState = useCallback(() => {
    setModalState(initialModalState);
  }, []);

  const handleCloseModal = useCallback(() => {
    resetModalState();
  }, [resetModalState]);

  const updateModalState = useCallback((updates: Partial<ModalState>) => {
    setModalState((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    modalState,
    openModalWithDelay,
    resetModalState,
    handleCloseModal,
    updateModalState,
  };
}
