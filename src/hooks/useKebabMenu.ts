import { useState } from "react";

interface UseKebabMenuProps {
  initialContent: string;
  onSave: (content: string) => void;
  onDelete: () => void;
  deleteModalTitle?: string | React.ReactNode;
  deleteModalDescription?: string;
}

export default function useKebabMenu({
  initialContent,
  onSave,
  onDelete,
  deleteModalTitle,
  deleteModalDescription = "삭제 후에는 되돌릴 수 없습니다.",
}: UseKebabMenuProps) {
  const KEBAB_MENU_OPTIONS = ["수정하기", "삭제하기"];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleKebabClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownSelect = (value: string) => {
    if (value === "수정하기") {
      setIsEditing(true);
      setIsDropdownOpen(false);
    } else {
      setIsModalOpen(true);
      setIsDropdownOpen(false);
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
    isDropdownOpen,
    isModalOpen,
    isEditing,
    content,
    setContent,
    dropdownOptions: KEBAB_MENU_OPTIONS,
    deleteModalTitle,
    deleteModalDescription,
    handleKebabClick,
    handleDropdownSelect,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteConfirm,
    handleModalClose,
  };
}
