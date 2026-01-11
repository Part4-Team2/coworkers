"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGroup } from "@/api/group";
import { MODAL_TYPES, type ModalState } from "./useModalState";

interface UseTeamActionsProps {
  teamId: string;
  openModalWithDelay: (updates: Partial<ModalState>, delay?: number) => void;
}

export function useTeamActions({
  teamId,
  openModalWithDelay,
}: UseTeamActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 팀 수정 페이지로 이동 (모달 없음)
  const navigateToEdit = useCallback(() => {
    router.push(`/${teamId}/edit`);
  }, [router, teamId]);

  // 모달 열기
  const openDeleteModal = useCallback(() => {
    openModalWithDelay({ type: MODAL_TYPES.TEAM_DELETE });
  }, [openModalWithDelay]);

  // API 호출
  const confirmDelete = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await deleteGroup(teamId);

      if (!result.success) {
        alert(result.error);
        return;
      }

      // 성공 시 팀 목록 페이지로 이동 (replace로 히스토리 교체)
      router.replace("/teamlist");
    } catch (error) {
      console.error("[deleteGroup]", error);
      alert("팀 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [teamId, router, isLoading]);

  return {
    navigateToEdit,
    openDeleteModal,
    confirmDelete,
    isLoading,
  };
}
