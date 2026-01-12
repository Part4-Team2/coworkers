"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getGroupInvitation, deleteMember } from "@/lib/api/group";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
    if (modalState.memberToDelete !== null && !isLoading) {
      setIsLoading(true);
      try {
        const result = await deleteMember(teamId, modalState.memberToDelete);

        if (!result.success) {
          alert(result.error);
          return;
        }

        alert("멤버가 삭제되었습니다.");
        resetModalState();
        router.refresh();
      } catch (error) {
        console.error("[deleteMember]", error);
        alert("멤버 삭제에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [teamId, modalState.memberToDelete, resetModalState, isLoading, router]);

  const copyEmail = useCallback(() => {
    if (modalState.selectedMember?.email) {
      navigator.clipboard
        .writeText(modalState.selectedMember.email)
        .then(() => {
          alert("이메일이 복사되었습니다!");
          resetModalState();
        })
        .catch(() => alert("이메일 복사에 실패했습니다. 다시 시도해주세요."));
    }
  }, [modalState.selectedMember, resetModalState]);

  const copyInviteLink = useCallback(async () => {
    try {
      const result = await getGroupInvitation(teamId);

      if ("error" in result) {
        alert(result.message);
        return;
      }

      // 초대 링크 생성
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        "http://localhost:3000";
      const inviteLink = `${baseUrl}/invite?token=${result.token}`;

      // 클립보드에 복사
      await navigator.clipboard.writeText(inviteLink);
      alert("초대 링크가 복사되었습니다!");
      resetModalState();
    } catch (error) {
      console.error("[copyInviteLink]", error);
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
    // 로딩 상태
    isLoading,
  };
}
