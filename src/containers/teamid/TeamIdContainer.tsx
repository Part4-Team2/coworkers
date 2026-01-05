"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Member from "@/components/Team/Member";
import Report from "@/components/Team/Report";
import TodoList from "@/components/Team/TodoList";
import TeamHeader from "@/components/Team/TeamHeader";
import Modal from "@/components/Common/Modal/Modal";
import { Todo, Member as MemberType } from "@/types";

// 모달 타입 상수 정의
const MODAL_TYPES = {
  INVITE: "invite",
  TODO_LIST: "todo-list",
  TODO_EDIT: "todo-edit",
  TODO_DELETE: "todo-delete",
  PROFILE: "profile",
  MEMBER_DELETE: "member-delete",
  TEAM_DELETE: "team-delete",
} as const;

type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES] | null;

// 상수 정의
const MODAL_OPEN_DELAY = 100; // 드롭다운 닫힌 후 모달 오픈 지연 (ms)

// State 관리를 위한 인터페이스
interface ModalState {
  type: ModalType;
  selectedMember: MemberType | null;
  memberToDelete: number | null;
  todoListName: string;
  selectedTodo: Todo | null;
  todoToDelete: number | null;
}

// 임시 데이터
const mockMembers: MemberType[] = [
  {
    id: 1,
    name: "우지은",
    email: "jieun@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 2,
    name: "김미희",
    email: "Mihee@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 3,
    name: "김슬아",
    email: "seula@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 4,
    name: "이동규",
    email: "dongkyu@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 5,
    name: "김단혜",
    email: "Dahye@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 6,
    name: "이연지",
    email: "Yeonji@codeit.com",
    imageUrl: undefined,
  },
];

const mockTodos: Todo[] = [
  {
    id: 1,
    name: "법인 설립",
    completedCount: 3,
    totalCount: 5,
    color: "#A855F7",
  },
  {
    id: 2,
    name: "변경 등기",
    completedCount: 5,
    totalCount: 5,
    color: "#3B82F6",
  },
  {
    id: 3,
    name: "정기 주총",
    completedCount: 3,
    totalCount: 5,
    color: "#14B8A6",
  },
  {
    id: 4,
    name: "법인 설립",
    completedCount: 3,
    totalCount: 5,
    color: "#EC4899",
  },
];

interface TeamIdContainerProps {
  teamId: string;
}

export default function TeamIdContainer({ teamId }: TeamIdContainerProps) {
  const router = useRouter();

  const [members] = useState(mockMembers);
  const [todos] = useState(mockTodos);

  // 통합된 모달 state 관리
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    selectedMember: null,
    memberToDelete: null,
    todoListName: "",
    selectedTodo: null,
    todoToDelete: null,
  });

  // TODO: 실제로는 API나 라우터 파라미터에서 팀 정보를 가져와야 함
  const [teamName] = useState("경영관리팀");

  // 공통 모달 오픈 헬퍼 함수
  const openModalWithDelay = useCallback(
    (updates: Partial<ModalState>, delay = MODAL_OPEN_DELAY) => {
      if (delay > 0) {
        setTimeout(() => {
          setModalState((prev) => ({ ...prev, ...updates }));
        }, delay);
      } else {
        setModalState((prev) => ({ ...prev, ...updates }));
      }
    },
    []
  );

  const resetModalState = useCallback(() => {
    setModalState({
      type: null,
      selectedMember: null,
      memberToDelete: null,
      todoListName: "",
      selectedTodo: null,
      todoToDelete: null,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    resetModalState();
  }, [resetModalState]);

  const handleInviteMember = useCallback(() => {
    openModalWithDelay({ type: MODAL_TYPES.INVITE }, 0);
  }, [openModalWithDelay]);

  const handleAddTodo = useCallback(() => {
    openModalWithDelay({ type: MODAL_TYPES.TODO_LIST }, 0);
  }, [openModalWithDelay]);

  const handleMemberDelete = useCallback(
    (memberId: number) => {
      openModalWithDelay(
        { type: MODAL_TYPES.MEMBER_DELETE, memberToDelete: memberId },
        0
      );
    },
    [openModalWithDelay]
  );

  const handleConfirmDelete = useCallback(() => {
    if (modalState.memberToDelete !== null) {
      console.log("멤버 삭제:", modalState.memberToDelete);
      // 실제 삭제 로직
      resetModalState();
    }
  }, [modalState.memberToDelete, resetModalState]);

  const handleMemberNameClick = useCallback(
    (member: MemberType) => {
      openModalWithDelay(
        { type: MODAL_TYPES.PROFILE, selectedMember: member },
        0
      );
    },
    [openModalWithDelay]
  );

  const handleEmailCopy = useCallback(() => {
    if (modalState.selectedMember?.email) {
      navigator.clipboard
        .writeText(modalState.selectedMember.email)
        .then(() => alert("이메일이 복사되었습니다!"))
        .catch(() => alert("이메일 복사에 실패했습니다. 다시 시도해주세요."));
    }
  }, [modalState.selectedMember]);

  const handleInviteLinkCopy = useCallback(() => {
    // 실제로는 서버에서 받은 초대 링크를 복사
    const inviteLink = "https://coworkers.com/invite/team-id";
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        console.log("초대 링크 복사됨");
        alert("초대 링크가 복사되었습니다!");
        resetModalState();
      })
      .catch(() => {
        alert("링크 복사에 실패했습니다. 다시 시도해주세요.");
      });
  }, [resetModalState]);

  const handleCreateTodoList = useCallback(() => {
    console.log("목록 만들기:", modalState.todoListName);
    resetModalState();
  }, [modalState.todoListName, resetModalState]);

  const handleTodoEdit = useCallback(
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

  const handleTodoDelete = useCallback(
    (todoId: number) => {
      openModalWithDelay({
        type: MODAL_TYPES.TODO_DELETE,
        todoToDelete: todoId,
      });
    },
    [openModalWithDelay]
  );

  const handleConfirmTodoEdit = useCallback(() => {
    if (modalState.selectedTodo) {
      console.log(
        "할 일 목록 수정:",
        modalState.selectedTodo.id,
        modalState.todoListName
      );
      // 실제 수정 로직
      resetModalState();
    }
  }, [modalState.selectedTodo, modalState.todoListName, resetModalState]);

  const handleConfirmTodoDelete = useCallback(() => {
    if (modalState.todoToDelete !== null) {
      console.log("할 일 목록 삭제:", modalState.todoToDelete);
      // 실제 삭제 로직
      resetModalState();
    }
  }, [modalState.todoToDelete, resetModalState]);

  const handleTeamEdit = useCallback(() => {
    // 팀 수정 페이지로 이동
    router.push(`/${teamId}/edit`);
  }, [router, teamId]);

  const handleTeamDelete = useCallback(() => {
    openModalWithDelay({ type: MODAL_TYPES.TEAM_DELETE });
  }, [openModalWithDelay]);

  const handleConfirmTeamDelete = useCallback(() => {
    console.log("팀 삭제:", teamId);
    // 실제 팀 삭제 로직
    resetModalState();
    // TODO: 삭제 후 팀 목록 페이지로 이동
    // router.push('/teamlist');
  }, [teamId, resetModalState]);

  const handleTodoListNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setModalState((prev) => ({ ...prev, todoListName: e.target.value }));
    },
    []
  );

  return (
    <div className="teamid-page w-full bg-background-primary min-h-screen py-24">
      <div className="max-w-1200 mx-auto px-16 lg:px-24">
        {/* 팀 헤더 - 공통 Header 아래 24px 위치 */}
        <div className="mb-24">
          <TeamHeader
            teamName={teamName}
            onEdit={handleTeamEdit}
            onDelete={handleTeamDelete}
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
            onClick={handleAddTodo}
            className="text-md font-regular leading-md text-brand-primary text-right cursor-pointer active:text-interaction-pressed transition-colors"
          >
            + 새로운 목록 추가하기
          </button>
        </div>
        <TodoList
          todos={todos}
          onEdit={handleTodoEdit}
          onDelete={handleTodoDelete}
        />

        <div className="mt-48 lg:mt-64">
          <Report
            progressPercentage={25}
            todayTaskCount={20}
            completedTaskCount={5}
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
            onClick={handleInviteMember}
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
              isAdmin={true}
              onDeleteClick={() => handleMemberDelete(member.id)}
              onNameClick={() => handleMemberNameClick(member)}
            />
          ))}
        </div>
      </div>

      {/* 1. 멤버 초대 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.INVITE}
        onClose={handleCloseModal}
        title="멤버 초대"
        description="그룹에 참여할 수 있는 링크를 복사합니다."
        primaryButton={{
          label: "링크 복사하기",
          onClick: handleInviteLinkCopy,
        }}
      />

      {/* 할 일 목록 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.TODO_LIST}
        onClose={handleCloseModal}
        title="할 일 목록"
        input={{
          placeholder: "목록 명을 입력해주세요.",
          value: modalState.todoListName,
          onChange: handleTodoListNameChange,
        }}
        primaryButton={{
          label: "만들기",
          onClick: handleCreateTodoList,
        }}
      />

      {/* 3. 할 일 목록 수정 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.TODO_EDIT}
        onClose={handleCloseModal}
        title="할 일 목록"
        input={{
          placeholder: "목록 명을 입력해주세요.",
          value: modalState.todoListName,
          onChange: handleTodoListNameChange,
        }}
        primaryButton={{
          label: "수정하기",
          onClick: handleConfirmTodoEdit,
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
          onClick: handleConfirmTodoDelete,
          variant: "danger",
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleCloseModal,
        }}
      />

      {/* 5. 프로필 모달 */}
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
          onClick: handleEmailCopy,
        }}
      />

      {/* 6. 멤버 삭제 확인 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.MEMBER_DELETE}
        onClose={handleCloseModal}
        title="멤버를 삭제하시겠습니까?"
        description="삭제한 멤버는 팀에서 완전히 제외됩니다."
        primaryButton={{
          label: "삭제",
          onClick: handleConfirmDelete,
          variant: "danger",
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleCloseModal,
        }}
      />

      {/* 7. 팀 삭제 확인 모달 */}
      <Modal
        isOpen={modalState.type === MODAL_TYPES.TEAM_DELETE}
        onClose={handleCloseModal}
        title="정말 팀을 삭제하시겠습니까?"
        description="삭제된 데이터는 복구 할 수 없습니다."
        primaryButton={{
          label: "삭제",
          onClick: handleConfirmTeamDelete,
          variant: "danger",
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleCloseModal,
        }}
      />
    </div>
  );
}
