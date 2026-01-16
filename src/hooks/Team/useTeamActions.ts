"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGroup } from "@/lib/api/group";
import { MODAL_TYPES, type ModalState } from "./useModalState";
import { setPendingToast } from "@/utils/pendingToast";
import { showErrorToast } from "@/utils/error";

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
        showErrorToast(result.error);
        return;
      }

      // 성공 메시지를 저장하고 팀 목록 페이지로 이동
      setPendingToast("success", "팀이 삭제되었습니다.");
      router.replace("/teamlist");
    } catch (error) {
      console.error("[deleteGroup]", error);
      showErrorToast("팀 삭제 중 오류가 발생했습니다.");
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
