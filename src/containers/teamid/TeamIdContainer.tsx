"use client";

import Member from "@/components/Team/Member";
import Report from "@/components/Team/Report";
import TodoList from "@/components/Team/TodoList";
import TeamHeader from "@/components/Team/TeamHeader";
import Modal from "@/components/Common/Modal/Modal";
import { Todo } from "@/types/todo";
import { Member as MemberType } from "@/types/member";
import { GroupDetailResponse } from "@/api/group";
import { useModalState, MODAL_TYPES } from "@/hooks/useModalState";
import { useTeamActions } from "@/hooks/useTeamActions";
import { useTodoActions } from "@/hooks/useTodoActions";
import { useMemberActions } from "@/hooks/useMemberActions";

// 상수 정의
const TODO_COLORS = [
  "#A855F7",
  "#3B82F6",
  "#06B6D4",
  "#EC4899",
  "#F43F5E",
  "#F97316",
  "#EAB308",
];

interface TeamIdContainerProps {
  teamId: string;
  userRole: "ADMIN" | "MEMBER";
  currentUserId?: number;
  teamName: string;
  members: GroupDetailResponse["members"];
  taskLists: GroupDetailResponse["taskLists"];
}

export default function TeamIdContainer({
  teamId,
  userRole,
  currentUserId,
  teamName,
  members: initialMembers,
  taskLists: initialTaskLists,
}: TeamIdContainerProps) {
  // API 데이터를 컴포넌트 형식에 맞게 변환
  const members: MemberType[] = initialMembers.map((member) => ({
    id: member.userId,
    name: member.userName,
    email: member.userEmail,
    imageUrl: member.userImage || undefined,
  }));

  const todos: Todo[] = initialTaskLists.map((taskList) => ({
    id: taskList.id,
    name: taskList.name,
    completedCount: taskList.tasks.filter((task) => task.doneAt !== null)
      .length,
    totalCount: taskList.tasks.length,
    color: TODO_COLORS[taskList.displayIndex % TODO_COLORS.length],
  }));

  // Report 데이터 계산
  const totalTaskCount = todos.reduce((sum, todo) => sum + todo.totalCount, 0);
  const completedTaskCount = todos.reduce(
    (sum, todo) => sum + todo.completedCount,
    0
  );
  const progressPercentage =
    totalTaskCount > 0
      ? Math.round((completedTaskCount / totalTaskCount) * 100)
      : 0;

  // 오늘 날짜의 작업 수 계산만 별도로 수행
  const today = new Date().toISOString().split("T")[0];
  const todayTaskCount = initialTaskLists
    .flatMap((taskList) => taskList.tasks)
    .filter((task) => {
      const taskDate = new Date(task.date).toISOString().split("T")[0];
      return taskDate === today;
    }).length;

  // 커스텀 훅 사용
  const { modalState, openModalWithDelay, handleCloseModal, updateModalState } =
    useModalState();

  const teamActions = useTeamActions({
    teamId,
    openModalWithDelay,
  });

  const todoActions = useTodoActions({
    teamId,
    todos,
    modalState,
    openModalWithDelay,
    updateModalState,
  });

  const memberActions = useMemberActions({
    teamId,
    modalState,
    openModalWithDelay,
    resetModalState: handleCloseModal,
  });

  return (
    <div className="teamid-page w-full bg-background-primary min-h-screen py-24">
      <div className="max-w-1200 mx-auto px-16 lg:px-24">
        {/* 팀 헤더 - 공통 Header 아래 24px 위치 */}
        <div className="mb-24">
          <TeamHeader
            teamName={teamName}
            onEdit={
              userRole === "ADMIN" ? teamActions.navigateToEdit : undefined
            }
            onDelete={
              userRole === "ADMIN" ? teamActions.openDeleteModal : undefined
            }
          />
        </div>

        <div className="flex items-center justify-between mb-16">
          <h2 className="text-lg font-medium leading-lg text-text-primary">
            할 일 목록{" "}
            <span className="text-lg font-regular leading-lg text-text-default">
              ({todos.length}개)
            </span>
          </h2>
          <button
            type="button"
            onClick={todoActions.openCreateModal}
            className="text-md font-regular leading-md text-brand-primary text-right cursor-pointer active:text-interaction-pressed transition-colors"
          >
            + 새로운 목록 추가하기
          </button>
        </div>
        <TodoList
          todos={todos}
          onEdit={todoActions.openEditModal}
          onDelete={todoActions.openDeleteModal}
        />

        <div className="mt-48 lg:mt-64">
          <Report
            progressPercentage={progressPercentage}
            todayTaskCount={todayTaskCount}
            completedTaskCount={completedTaskCount}
          />
        </div>

        <div className="flex items-center justify-between mb-24 mt-48 lg:mt-64">
          <h2 className="text-lg font-medium leading-lg text-text-primary">
            멤버{" "}
            <span className="text-lg font-regular leading-lg text-text-default">
              ({members.length}명)
            </span>
          </h2>
          <button
            type="button"
            onClick={memberActions.openInviteModal}
            className="text-md font-regular leading-md text-brand-primary text-right cursor-pointer active:text-interaction-pressed transition-colors"
          >
            + 새로운 멤버 초대하기
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 sm:gap-24">
          {members.map((member) => (
            <Member
              key={member.id}
              name={member.name}
              email={member.email}
              imageUrl={member.imageUrl}
              isAdmin={userRole === "ADMIN"}
              onDeleteClick={
                userRole === "ADMIN" && member.id !== currentUserId
                  ? () => memberActions.openDeleteModal(member.id)
                  : undefined
              }
              onNameClick={() => memberActions.openProfileModal(member)}
            />
          ))}
        </div>
      </div>

      {/* 멤버 초대 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.INVITE}
        onClose={handleCloseModal}
        title="멤버 초대"
        description="그룹에 참여할 수 있는 링크를 복사합니다."
        primaryButton={{
          label: "링크 복사하기",
          onClick: memberActions.copyInviteLink,
        }}
      />

      {/* 할 일 목록 생성 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.TODO_LIST}
        onClose={handleCloseModal}
        title="할 일 목록"
        input={{
          placeholder: "목록 명을 입력해주세요.",
          value: modalState.todoListName,
          onChange: todoActions.handleNameChange,
        }}
        primaryButton={{
          label: todoActions.isLoading ? "만드는 중..." : "만들기",
          onClick: todoActions.confirmCreate,
          disabled: todoActions.isLoading,
        }}
      />

      {/* 할 일 목록 수정 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.TODO_EDIT}
        onClose={handleCloseModal}
        title="할 일 목록"
        input={{
          placeholder: "목록 명을 입력해주세요.",
          value: modalState.todoListName,
          onChange: todoActions.handleNameChange,
        }}
        primaryButton={{
          label: todoActions.isLoading ? "수정 중..." : "수정하기",
          onClick: todoActions.confirmEdit,
          disabled: todoActions.isLoading,
        }}
      />

      {/* 할 일 목록 삭제 확인 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.TODO_DELETE}
        onClose={handleCloseModal}
        title="정말 목록을 삭제하시겠습니까?"
        description="삭제된 데이터는 복구 할 수 없습니다."
        primaryButton={{
          label: todoActions.isLoading ? "삭제 중..." : "삭제",
          onClick: todoActions.confirmDelete,
          variant: "danger",
          disabled: todoActions.isLoading,
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleCloseModal,
        }}
      />

      {/* 프로필 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.PROFILE}
        onClose={handleCloseModal}
        avatar={{
          imageUrl: modalState.selectedMember?.imageUrl,
          altText: modalState.selectedMember?.name || "",
          size: "xlarge",
        }}
        title={modalState.selectedMember?.name || ""}
        description={modalState.selectedMember?.email || ""}
        primaryButton={{
          label: "이메일 복사하기",
          onClick: memberActions.copyEmail,
        }}
      />

      {/* 멤버 삭제 확인 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.MEMBER_DELETE}
        onClose={handleCloseModal}
        title="멤버를 삭제하시겠습니까?"
        description="삭제한 멤버는 팀에서 완전히 제외됩니다."
        primaryButton={{
          label: memberActions.isLoading ? "삭제 중..." : "삭제",
          onClick: memberActions.confirmDelete,
          variant: "danger",
          disabled: memberActions.isLoading,
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleCloseModal,
        }}
      />

      {/* 팀 삭제 확인 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.TEAM_DELETE}
        onClose={handleCloseModal}
        title="정말 팀을 삭제하시겠습니까?"
        description="삭제된 데이터는 복구 할 수 없습니다."
        primaryButton={{
          label: teamActions.isLoading ? "삭제 중..." : "삭제",
          onClick: teamActions.confirmDelete,
          variant: "danger",
          disabled: teamActions.isLoading,
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleCloseModal,
        }}
      />
    </div>
  );
}
