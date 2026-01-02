"use client";
// container 적용시 위치 및 구조 수정 예정
import { useState, useCallback } from "react";
import Member from "@/components/Team/Member";
import Report from "@/components/Team/Report";
import TodoList from "@/components/Team/TodoList";
import TeamHeader from "@/components/Team/TeamHeader";
import Modal from "@/components/Common/Modal/Modal";
import { Todo, Member as MemberType } from "@/types";

type ModalType = "invite" | "todo-list" | "profile" | "member-delete" | null;

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

export default function TeamPageClient() {
  const [members] = useState(mockMembers);
  const [todos] = useState(mockTodos);
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [todoListName, setTodoListName] = useState("");

  // TODO: 실제로는 API나 라우터 파라미터에서 팀 정보를 가져와야 함
  const [teamName] = useState("경영관리팀");

  const resetModalState = useCallback(() => {
    setOpenModal(null);
    setSelectedMember(null);
    setMemberToDelete(null);
    setTodoListName("");
  }, []);

  const handleCloseModal = useCallback(() => {
    resetModalState();
  }, [resetModalState]);

  const handleInviteMember = useCallback(() => {
    setOpenModal("invite");
  }, []);

  const handleAddTodo = useCallback(() => {
    setOpenModal("todo-list");
  }, []);

  const handleMemberDelete = useCallback((memberId: number) => {
    setMemberToDelete(memberId);
    setOpenModal("member-delete");
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (memberToDelete !== null) {
      console.log("멤버 삭제:", memberToDelete);
      // 실제 삭제 로직
      resetModalState();
    }
  }, [memberToDelete, resetModalState]);

  const handleMemberNameClick = useCallback((member: MemberType) => {
    setSelectedMember(member);
    setOpenModal("profile");
  }, []);

  const handleEmailCopy = useCallback(() => {
    if (selectedMember?.email) {
      navigator.clipboard
        .writeText(selectedMember.email)
        .then(() => alert("이메일이 복사되었습니다!"))
        .catch(() => alert("이메일 복사에 실패했습니다. 다시 시도해주세요."));
    }
  }, [selectedMember]);

  const handleInviteLinkCopy = useCallback(() => {
    // 실제로는 서버에서 받은 초대 링크를 복사
    const inviteLink = "https://coworkers.com/invite/team-id";
    navigator.clipboard.writeText(inviteLink).then(() => {
      console.log("초대 링크 복사됨");
      alert("초대 링크가 복사되었습니다!");
      resetModalState();
    });
  }, [resetModalState]);

  const handleCreateTodoList = useCallback(() => {
    console.log("목록 만들기:", todoListName);
    resetModalState();
  }, [todoListName, resetModalState]);

  const handleTodoMenuClick = useCallback((todoId: number) => {
    // 할 일 메뉴 클릭
    console.log("Todo menu clicked:", todoId);
  }, []);

  const handleSettingsClick = useCallback(() => {
    // 팀 설정
    console.log("팀 설정하기");
  }, []);

  return (
    <div className="w-full bg-background-primary min-h-screen py-40">
      <div className="max-w-1200 mx-auto px-16 lg:px-24">
        {/* 팀 헤더 - 공통 Header 아래 24px 위치 */}
        <div className="mb-24">
          <TeamHeader
            teamName={teamName}
            onSettingsClick={handleSettingsClick}
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
        <TodoList todos={todos} onMenuClick={handleTodoMenuClick} />

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
        isOpen={openModal === "invite"}
        onClose={handleCloseModal}
        title="멤버 초대"
        description="그룹에 참여할 수 있는 링크를 복사합니다."
        primaryButton={{
          label: "링크 복사하기",
          onClick: handleInviteLinkCopy,
        }}
      />

      {/* 2. 할 일 목록 모달 */}
      <Modal
        isOpen={openModal === "todo-list"}
        onClose={handleCloseModal}
        title="할 일 목록"
        input={{
          placeholder: "목록 명을 입력해주세요.",
          value: todoListName,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setTodoListName(e.target.value),
        }}
        primaryButton={{
          label: "만들기",
          onClick: handleCreateTodoList,
        }}
      />

      {/* 3. 프로필 모달 */}
      <Modal
        isOpen={openModal === "profile"}
        onClose={handleCloseModal}
        avatar={{
          imageUrl: selectedMember?.imageUrl,
          altText: selectedMember?.name || "",
          size: "xlarge",
        }}
        title={selectedMember?.name || ""}
        description={selectedMember?.email || ""}
        primaryButton={{
          label: "이메일 복사하기",
          onClick: handleEmailCopy,
        }}
      />

      {/* 4. 멤버 삭제 확인 모달 */}
      <Modal
        isOpen={openModal === "member-delete"}
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
    </div>
  );
}
