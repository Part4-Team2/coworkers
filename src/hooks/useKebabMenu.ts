import { useState } from "react";

interface UseKebabMenuProps {
  initialContent: string;
  onSave: (content: string) => void;
  onDelete: () => void;
  deleteModalTitle?: string | React.ReactNode;
  deleteModalDescription?: string;
}

const KEBAB_MENU_OPTIONS = ["수정하기", "삭제하기"];

export default function useKebabMenu({
  initialContent,
  onSave,
  onDelete,
  deleteModalTitle,
  deleteModalDescription = "삭제 후에는 되돌릴 수 없습니다.",
}: UseKebabMenuProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleDropdownSelect = (value: string) => {
    if (value === "수정하기") {
      setIsEditing(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCancelEdit = () => {
    setContent(initialContent);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    // api PATCH
    onSave(content);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    isEditing,
    content,
    setContent,
    dropdownOptions: KEBAB_MENU_OPTIONS,
    deleteModalTitle,
    deleteModalDescription,
    handleDropdownSelect,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteConfirm,
    handleModalClose,
  };
}
