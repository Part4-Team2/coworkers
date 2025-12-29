"use client";

import { useState } from "react";
import Form from "@/app/components/Form/Form";
import Avatar from "@/app/components/Avatar/Avatar";
import Button from "@/app/components/Button/Button";
import Modal from "@/app/components/Modal/Modal";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";

export default function MyPage() {
  const [name, setName] = useState("우지은");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [openModal, setOpenModal] = useState<string | null>(null);

  const handleClose = () => setOpenModal(null);

  return (
    <>
      <Form
        onSubmit={() => {}}
        profile={
          <div className="w-full flex flex-col gap-8">
            <label className="text-xl font-bold">계정 설정</label>
            <div className="relative inline-block w-64 h-64">
              <Avatar
                // imageUrl={userProfileImage}
                altText="사용자 프로필"
                size="xlarge"
                isEditable={true}
                // onEditClick={handleEditClick}
              />
            </div>
          </div>
        }
        input={[
          {
            label: "이름",
            placeholder: "이름을 입력해주세요.",
            variant: "default",
            size: "large",
            type: "text",
            full: true,
            value: name,
            onChange: (e) => setName(e.target.value),
          },
          {
            label: "이메일",
            placeholder: "이메일을 입력해주세요.",
            variant: "default",
            size: "large",
            type: "email",
            full: true,
            value: "codeit@codeit.com",
            disabled: true,
          },
          {
            label: "비밀번호",
            placeholder: "비밀번호를 입력해주세요.",
            variant: "default",
            size: "large",
            type: "password",
            rightElement: (
              <Button
                label="변경하기"
                variant="solid"
                size="xSmall"
                onClick={() => setOpenModal("password-change")}
              />
            ),
            full: true,
            disabled: true,
          },
        ]}
        option={
          <div
            className="text-status-danger text-lg cursor-pointer hover:opacity-80 flex items-center gap-8 py-8"
            onClick={() => setOpenModal("withdraw")}
          >
            <SVGIcon icon="secession" />
            <span>회원 탈퇴하기</span>
          </div>
        }
        optionAlign="start"
      />

      {/* 비밀번호 변경 모달 */}
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
            handleClose();
          },
        }}
        secondaryButton={{
          label: "닫기",
          onClick: handleClose,
        }}
      />

      {/* 회원 탈퇴 모달 */}
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
    </>
  );
}
