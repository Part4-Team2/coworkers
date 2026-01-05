"use client";

import Avatar from "../Common/Avatar/Avatar";
import SVGIcon from "../Common/SVGIcon/SVGIcon";
import DropdownList from "../Common/Dropdown/DropdownList";
import { mockComment } from "@/mocks/task";
import Button from "../Common/Button/Button";
import { Modal } from "../Common/Modal";
import useKebabMenu from "@/hooks/useKebabMenu";

export default function Reply() {
  const kebab = useKebabMenu({
    initialContent: mockComment[0].content,
    onSave: (newContent) => {
      console.log("api PATCH 로직", newContent);
      // 실제 api 호출
    },
    onDelete: () => {
      console.log("api DELETE 로직");
      // 실제 api 호출
    },
    deleteModalTitle: "해당 댓글을 정말 삭제하시겠어요?",
  });

  return (
    <div className="flex flex-col gap-16 mt-16">
      <div className="flex justify-between items-start text-text-primary text-md font-regular">
        {kebab.isEditing ? (
          <textarea
            value={kebab.content}
            onChange={(e) => kebab.setContent(e.target.value)}
            autoFocus
            className="flex-1 resize-none field-sizing-content placeholder-text-default text-text-primary text-md font-regular"
          />
        ) : (
          <div>{kebab.content}</div>
        )}

        {!kebab.isEditing && (
          <>
            <div className="relative">
              <SVGIcon
                icon="kebabSmall"
                size="xxs"
                onClick={kebab.handleKebabClick}
              />
              {kebab.isDropdownOpen && (
                <DropdownList
                  isOpen
                  options={kebab.dropdownOptions}
                  size="sm"
                  position="absolute right-0 top-full mt-5"
                  onSelect={kebab.handleDropdownSelect}
                />
              )}
            </div>

            <Modal
              isOpen={kebab.isModalOpen}
              onClose={kebab.handleModalClose}
              title={kebab.deleteModalTitle}
              description={kebab.deleteModalDescription}
              primaryButton={{
                label: "삭제하기",
                onClick: kebab.handleDeleteConfirm,
                variant: "danger",
              }}
              secondaryButton={{
                label: "닫기",
                onClick: kebab.handleModalClose,
              }}
            />
          </>
        )}
      </div>

      {kebab.isEditing ? (
        <div className="flex items-center justify-end gap-20">
          <button
            onClick={kebab.handleCancelEdit}
            className="text-text-default text-md font-semibold"
          >
            취소
          </button>
          <Button
            variant="outlined"
            size="xSmall"
            label="수정하기"
            onClick={kebab.handleSaveEdit}
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
