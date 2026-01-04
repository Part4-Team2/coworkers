"use client";

import { useState } from "react";
import Avatar from "../Common/Avatar/Avatar";
import SVGIcon from "../Common/SVGIcon/SVGIcon";
import DropdownList from "../Common/Dropdown/DropdownList";
import { mockComment } from "@/mocks";
import Button from "../Common/Button/Button";
import { Modal } from "../Common/Modal";

const DROPDOWN_OPTIONS = ["수정하기", "삭제하기"];

export default function Reply() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(mockComment[0].content);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onKebabClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleListClick = (value: string) => {
    if (value === "수정하기") {
      setIsEditing(true);
      setIsDropdownOpen(false);
    } else {
      setIsModalOpen(true);
      setIsDropdownOpen(false);
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // api PATCH
    setContent(content);
    setIsEditing(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-16 mt-16">
      <div className="flex justify-between items-start text-text-primary text-md font-regular">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
            className="flex-1 resize-none field-sizing-content placeholder-text-default text-text-primary text-md font-regular"
          />
        ) : (
          <div>{content}</div>
        )}

        {!isEditing && (
          <>
            <div className="relative">
              <SVGIcon icon="kebabSmall" size="xxs" onClick={onKebabClick} />
              {isDropdownOpen && (
                <DropdownList
                  isOpen
                  options={DROPDOWN_OPTIONS}
                  size="sm"
                  position="absolute right-0 top-full mt-5"
                  onSelect={handleListClick}
                />
              )}
            </div>

            <Modal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              title="해당 댓글을 정말 삭제하시겠어요?"
              description="삭제 후에는 되돌릴 수 없습니다."
              primaryButton={{
                label: "삭제하기",
                onClick: () => {
                  console.log("api DELETE");
                  handleModalClose();
                },
                variant: "danger",
              }}
              secondaryButton={{
                label: "닫기",
                onClick: handleModalClose,
              }}
            />
          </>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center justify-end gap-20">
          <button
            onClick={handleCancelEdit}
            className="text-text-default text-md font-semibold"
          >
            취소
          </button>
          <Button
            variant="outlined"
            size="xSmall"
            label="수정하기"
            onClick={handleSaveEdit}
          />
        </div>
      ) : (
        <div className="flex items-center">
          <Avatar altText="우지은 프로필" size="large" />
          <span className="ml-16 text-text-primary text-md font-medium">
            {mockComment[0].userName}
          </span>
          <span className="ml-auto text-text-secondary text-md font-regular">
            {mockComment[0].createdAt}
          </span>
        </div>
      )}

      <div className="border border-border-primary" />
    </div>
  );
}
