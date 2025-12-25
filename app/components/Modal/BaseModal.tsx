"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BaseModalProps } from "./types";
import SVGIcon from "../SVGIcon/SVGIcon";

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // 포커스 트랩
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => {
      document.removeEventListener("keydown", handleTab);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex sm:items-center items-end justify-center sm:p-16 p-0">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 모달 카드 */}
      <div
        ref={modalRef}
        className={`relative w-full sm:w-[374px] lg:w-[384px] sm:mx-16 mx-0 bg-background-secondary rounded-t-xl sm:rounded-xl shadow-xl ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* X 닫기 버튼 */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-16 top-16 text-text-default cursor-pointer"
            aria-label="닫기"
          >
            <SVGIcon icon="x" size={24} />
          </button>
        )}

        {children}
      </div>
    </div>
  );

  // Portal로 body에 렌더링
  return createPortal(modalContent, document.body);
};

export default BaseModal;
