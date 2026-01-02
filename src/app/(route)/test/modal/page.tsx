"use client";

import { useState } from "react";
import Modal from "@/components/Common/Modal/Modal";

export default function ModalTestPage() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");

  const handleClose = () => {
    setOpenModal(null);
    // 모달 닫을 때 모든 입력 값 초기화
    setInputValue("");
    setEmailValue("");
    setPasswordValue("");
    setConfirmPasswordValue("");
    setTodoTitle("");
    setTodoDescription("");
  };

  return (
    <div className="min-h-screen bg-background-primary p-24">
      <div className="max-w-1200 mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-32">
          Modal Component Test
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {/* 1. 멤버 초대 - 단일 버튼 */}
          <button
            onClick={() => setOpenModal("invite")}
            className="p-20 bg-background-secondary rounded-lg hover:transition-colors"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-8">
              멤버 초대
            </h3>
            <p className="text-sm text-text-default">단일 버튼 모달</p>
          </button>

          {/* 2. 할 일 목록 - Input + 단일 버튼 */}
          <button
            onClick={() => setOpenModal("todo-list")}
            className="p-20 bg-background-secondary rounded-lg hover:transition-colors"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-8">
              할 일 목록
            </h3>
            <p className="text-sm text-text-default">Input + 단일 버튼</p>
          </button>

          {/* 3. 할 일 만들기 - 복잡한 폼 */}
          <button
            onClick={() => setOpenModal("todo-create")}
            className="p-20 bg-background-secondary rounded-lg hover:transition-colors"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-8">
              할 일 만들기
            </h3>
            <p className="text-sm text-text-default">
              Input + Textarea + 단일 버튼
            </p>
          </button>

          {/* 4. 비밀번호 재설정 - Input + 2버튼 */}
          <button
            onClick={() => setOpenModal("password-reset")}
            className="p-20 bg-background-secondary rounded-lg hover:transition-colors"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-8">
              비밀번호 재설정
            </h3>
            <p className="text-sm text-text-default">Input + 2개 버튼</p>
          </button>

          {/* 5. 회원 탈퇴 - Danger 아이콘 + 여러 설명 */}
          <button
            onClick={() => setOpenModal("withdraw")}
            className="p-20 bg-background-secondary rounded-lg hover:transition-colors"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-8">
              회원 탈퇴
            </h3>
            <p className="text-sm text-text-default">
              Danger 아이콘 + 여러 설명
            </p>
          </button>

          {/* 6. 로그아웃 - Danger 2버튼 */}
          <button
            onClick={() => setOpenModal("logout")}
            className="p-20 bg-background-secondary rounded-lg hover:transition-colors"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-8">
              로그아웃
            </h3>
            <p className="text-sm text-text-default">Danger 2개 버튼</p>
          </button>

          {/* 7. 비밀번호 변경 - 2개 Input + 2버튼 */}
          <button
            onClick={() => setOpenModal("password-change")}
            className="p-20 bg-background-secondary rounded-lg hover:transition-colors"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-8">
              비밀번호 변경
            </h3>
            <p className="text-sm text-text-default">2개 Input + 2개 버튼</p>
          </button>

          {/* 8. 프로필 - 완전 커스텀 */}
          <button
            onClick={() => setOpenModal("profile")}
            className="p-20 bg-background-secondary rounded-lg hover:transition-colors"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-8">
              프로필
            </h3>
            <p className="text-sm text-text-default">완전 커스텀</p>
          </button>
        </div>
      </div>

      {/* 1. 멤버 초대 모달 v */}
      <Modal
        isOpen={openModal === "invite"}
        onClose={handleClose}
        title="멤버 초대"
        description="그룹에 참여할 수 있는 링크를 복사합니다."
        primaryButton={{
          label: "링크 복사하기",
          onClick: () => {
            console.log("링크 복사");
            handleClose();
          },
        }}
      />

      {/* 2. 할 일 목록 모달 v */}
      <Modal
        isOpen={openModal === "todo-list"}
        onClose={handleClose}
        title="할 일 목록"
        input={{
          placeholder: "목록 명을 입력해주세요.",
          value: inputValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value),
        }}
        primaryButton={{
          label: "만들기",
          onClick: () => {
            console.log("목록 만들기:", inputValue);
            handleClose();
          },
        }}
      />

      {/* 3. 할 일 만들기 모달 v */}
      <Modal
        isOpen={openModal === "todo-create"}
        onClose={handleClose}
        title="할 일 만들기"
        description={[
          "할 일은 실제로 행동 가능한 작업 중심으로",
          "작성해주시면 좋습니다.",
        ]}
        input={[
          {
            label: "할 일 제목",
            placeholder: "할 일 제목을 입력해주세요.",
            value: todoTitle,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setTodoTitle(e.target.value),
          },
          {
            type: "textarea" as const,
            label: "할 일 메모",
            placeholder: "메모를 입력해주세요.",
            value: todoDescription,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setTodoDescription(e.target.value),
            minHeight: "120px",
          },
        ]}
        primaryButton={{
          label: "만들기",
          onClick: () => {
            console.log("할 일 만들기", { todoTitle, todoDescription });
            handleClose();
          },
        }}
      />

      {/* 4. 비밀번호 재설정 모달 v */}
      <Modal
        isOpen={openModal === "password-reset"}
        onClose={handleClose}
        title="비밀번호 재설정"
        description="비밀번호 재설정 링크를 보내드립니다."
        input={{
          placeholder: "이메일을 입력하세요.",
          type: "email",
          value: emailValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setEmailValue(e.target.value),
        }}
        primaryButton={{
          label: "링크 보내기",
          onClick: () => {
            console.log("링크 보내기:", emailValue);
            handleClose();
          },
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      />

      {/* 5. 회원 탈퇴 모달 v */}
      <Modal
        isOpen={openModal === "withdraw"}
        onClose={handleClose}
        title="회원 탈퇴를 진행하시겠어요?"
        icon={{
          name: "alert",
          size: 20,
          className: "text-status-danger",
        }}
        description={[
          "그룹장으로 있는 그룹은 자동으로 삭제되고,",
          "모든 그룹에서 나가집니다.",
        ]}
        primaryButton={{
          label: "회원 탈퇴",
          onClick: () => {
            console.log("회원 탈퇴");
            handleClose();
          },
          variant: "danger",
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      />

      {/* 6. 로그아웃 모달 v */}
      <Modal
        isOpen={openModal === "logout"}
        onClose={handleClose}
        title="로그아웃 하시겠어요?"
        primaryButton={{
          label: "로그아웃",
          onClick: () => {
            console.log("로그아웃");
            handleClose();
          },
          variant: "danger",
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      />

      {/* 7. 비밀번호 변경 모달 v */}
      <Modal
        isOpen={openModal === "password-change"}
        onClose={handleClose}
        title="비밀번호 변경하기"
        input={[
          {
            label: "새 비밀번호",
            type: "password",
            placeholder: "새 비밀번호를 입력해주세요.",
            value: passwordValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setPasswordValue(e.target.value),
            allowPasswordToggle: true,
          },
          {
            label: "새 비밀번호 확인",
            type: "password",
            placeholder: "새 비밀번호를 다시 한 번 입력해주세요.",
            value: confirmPasswordValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPasswordValue(e.target.value),
            allowPasswordToggle: true,
          },
        ]}
        primaryButton={{
          label: "변경하기",
          onClick: () => {
            console.log("비밀번호 변경", {
              passwordValue,
              confirmPasswordValue,
            });
            handleClose();
          },
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      />

      {/* 8. 프로필 모달 v */}
      <Modal
        isOpen={openModal === "profile"}
        onClose={handleClose}
        avatar={{
          altText: "우지은",
          size: "xlarge",
        }}
        title="우지은"
        description="jieunn@codeit.com"
        primaryButton={{
          label: "이메일 복사하기",
          onClick: () => {
            console.log("이메일 복사");
            handleClose();
          },
        }}
      />
    </div>
  );
}
