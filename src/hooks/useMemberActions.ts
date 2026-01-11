"use client";

import { useCallback } from "react";
import { getGroupInvitation, deleteMember } from "@/api/group";
import { MODAL_TYPES, type ModalState } from "./useModalState";
import { Member as MemberType } from "@/types/member";

interface UseMemberActionsProps {
  teamId: string;
  modalState: ModalState;
  openModalWithDelay: (updates: Partial<ModalState>, delay?: number) => void;
  resetModalState: () => void;
}

export function useMemberActions({
  teamId,
  modalState,
  openModalWithDelay,
  resetModalState,
}: UseMemberActionsProps) {
  // 모달 열기 함수들
  const openInviteModal = useCallback(() => {
    openModalWithDelay({ type: MODAL_TYPES.INVITE }, 0);
  }, [openModalWithDelay]);

  const openDeleteModal = useCallback(
    (memberId: number) => {
      openModalWithDelay(
        { type: MODAL_TYPES.MEMBER_DELETE, memberToDelete: memberId },
        0
      );
    },
    [openModalWithDelay]
  );

  const openProfileModal = useCallback(
    (member: MemberType) => {
      openModalWithDelay(
        { type: MODAL_TYPES.PROFILE, selectedMember: member },
        0
      );
    },
    [openModalWithDelay]
  );

  // API 호출 및 액션 함수들
  const confirmDelete = useCallback(async () => {
    if (modalState.memberToDelete !== null) {
      try {
        const result = await deleteMember(teamId, modalState.memberToDelete);

        if ("error" in result) {
          alert(result.message);
          return;
        }

        alert("멤버가 삭제되었습니다.");
        resetModalState();
        window.location.reload();
      } catch (error) {
        console.error("멤버 삭제 에러:", error);
        alert("멤버 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  }, [teamId, modalState.memberToDelete, resetModalState]);

  const copyEmail = useCallback(() => {
    if (modalState.selectedMember?.email) {
      navigator.clipboard
        .writeText(modalState.selectedMember.email)
        .then(() => alert("이메일이 복사되었습니다!"))
        .catch(() => alert("이메일 복사에 실패했습니다. 다시 시도해주세요."));
    }
  }, [modalState.selectedMember]);

  const copyInviteLink = useCallback(async () => {
    try {
      const result = await getGroupInvitation(teamId);

      if ("error" in result) {
        alert(result.message);
        return;
      }

      // 초대 링크 생성
      const baseUrl = window.location.origin;
      const inviteLink = `${baseUrl}/invite?token=${result.token}`;

      // 클립보드에 복사
      await navigator.clipboard.writeText(inviteLink);
      alert("초대 링크가 복사되었습니다!");
      resetModalState();
    } catch (error) {
      alert("링크 복사에 실패했습니다. 다시 시도해주세요.");
    }
  }, [teamId, resetModalState]);

  return {
    // 모달 열기
    openInviteModal,
    openDeleteModal,
    openProfileModal,
    // API 호출/액션
    confirmDelete,
    copyEmail,
    copyInviteLink,
  };
}
