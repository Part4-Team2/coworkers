"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Member from "@/components/Team/Member";
import Report from "@/components/Team/Report";
import TodoList from "@/components/Team/TodoList";
import TeamHeader from "@/components/Team/TeamHeader";
import Modal from "@/components/Common/Modal/Modal";
import { Todo } from "@/types/todo";
import { Member as MemberType } from "@/types/member";
import { GroupDetailResponse } from "@/lib/api/group";
import { useModalState, MODAL_TYPES } from "@/hooks/Team/useModalState";
import { useTeamActions } from "@/hooks/Team/useTeamActions";
import { useTodoActions } from "@/hooks/Team/useTodoActions";
import { useMemberActions } from "@/hooks/Team/useMemberActions";
import { useHeaderStore } from "@/store/headerStore";

// 상수 정의 - globals.css의 CSS 변수 참조
const TODO_COLORS = [
  "var(--color-point-purple)",
  "var(--color-point-blue)",
  "var(--color-point-cyan)",
  "var(--color-point-pink)",
  "var(--color-point-rose)",
  "var(--color-point-orange)",
  "var(--color-point-yellow)",
];

// displayIndex에 따른 색상 반환
const getTodoColor = (displayIndex: number): string =>
  TODO_COLORS[displayIndex % TODO_COLORS.length];

interface TeamIdContainerProps {
  teamId: string;
  teamName: string;
  members: GroupDetailResponse["members"];
  taskLists: GroupDetailResponse["taskLists"];
}

export default function TeamIdContainer({
  teamId,
  teamName,
  members: initialMembers,
  taskLists: initialTaskLists,
}: TeamIdContainerProps) {
  const router = useRouter();

  // 전역 상태에서 userId와 role 가져오기
  const userId = useHeaderStore((state) => state.userId);
  const teams = useHeaderStore((state) => state.teams);

  // currentTeam 메모이제이션
  const currentTeam = useMemo(
    () => teams.find((team) => team.teamId === teamId),
    [teams, teamId]
  );
  const userRole = (currentTeam?.role as "ADMIN" | "MEMBER") || "MEMBER";

  // API 데이터를 컴포넌트 형식에 맞게 변환 및 Report 데이터 계산 통합
  const { members, todos, completedTaskCount, progressPercentage } =
    useMemo(() => {
      const membersList: MemberType[] = initialMembers.map((member) => ({
        id: member.userId,
        name: member.userName,
        email: member.userEmail,
        imageUrl: member.userImage || undefined,
      }));

      const todosList: Todo[] = initialTaskLists.map((taskList) => ({
        id: taskList.id,
        name: taskList.name,
        completedCount: taskList.tasks.filter((task) => task.doneAt !== null)
          .length,
        totalCount: taskList.tasks.length,
        color: getTodoColor(taskList.displayIndex),
      }));

      const total = todosList.reduce((sum, todo) => sum + todo.totalCount, 0);
      const completed = todosList.reduce(
        (sum, todo) => sum + todo.completedCount,
        0
      );
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        members: membersList,
        todos: todosList,
        completedTaskCount: completed,
        progressPercentage: percentage,
      };
    }, [initialMembers, initialTaskLists]);

  // 오늘 날짜의 작업 수 계산만 별도로 수행
  const todayTaskCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]; // UTC 날짜 (YYYY-MM-DD)
    return initialTaskLists
      .flatMap((taskList) => taskList.tasks)
      .filter((task) => {
        const taskDate = task.date.split("T")[0]; // UTC 날짜 (YYYY-MM-DD)
        return taskDate === today;
      }).length;
  }, [initialTaskLists]);

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
    resetModalState: handleCloseModal,
  });

  const memberActions = useMemberActions({
    teamId,
    modalState,
    openModalWithDelay,
    resetModalState: handleCloseModal,
  });

  // userId가 없는 경우 에러 처리
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary">
        <p className="text-text-primary text-lg font-medium mb-16">
          로그인 정보를 확인할 수 없습니다.
        </p>
        <p className="text-text-secondary text-md">다시 로그인해주세요.</p>
      </div>
    );
  }

  // currentTeam이 없는 경우 에러 처리
  if (!currentTeam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary">
        <p className="text-text-primary text-lg font-medium mb-16">
          팀 정보를 찾을 수 없습니다.
        </p>
        <p className="text-text-secondary text-md">
          팀 목록에서 다시 선택해주세요.
        </p>
      </div>
    );
  }

  // 할 일 목록 클릭 핸들러
  const handleTodoListClick = (todoId: number) => {
    router.push(`/${teamId}/tasklist?tab=${todoId}`);
  };

  return (
    <div className="teamid-page w-full bg-background-primary min-h-screen py-24">
      <div className="max-w-1200 mx-auto px-16 lg:px-24">
        {/* 팀 헤더 - 공통 Header 아래 24px 위치 */}
        <div className="mb-24">
          <TeamHeader
            teamName={teamName}
            userRole={userRole}
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
          onClick={handleTodoListClick}
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
                userRole === "ADMIN" && member.id !== userId
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
          label: "만들기",
          onClick: todoActions.confirmCreate,
          loading: todoActions.isLoading,
          disabled: !modalState.todoListName.trim(),
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
          label: "수정하기",
          onClick: todoActions.confirmEdit,
          loading: todoActions.isLoading,
          disabled: !modalState.todoListName.trim(),
        }}
      />

      {/* 할 일 목록 삭제 확인 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.TODO_DELETE}
        onClose={handleCloseModal}
        title="정말 목록을 삭제하시겠습니까?"
        description="삭제된 데이터는 복구 할 수 없습니다."
        primaryButton={{
          label: "삭제",
          onClick: todoActions.confirmDelete,
          variant: "danger",
          loading: todoActions.isLoading,
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
          label: "삭제",
          onClick: memberActions.confirmDelete,
          variant: "danger",
          loading: memberActions.isLoading,
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
          label: "삭제",
          onClick: teamActions.confirmDelete,
          variant: "danger",
          loading: teamActions.isLoading,
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleCloseModal,
        }}
      />
    </div>
  );
}
