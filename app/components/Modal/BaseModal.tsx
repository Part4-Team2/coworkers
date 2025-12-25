"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BaseModalProps } from "./types";
import SVGIcon from "../SVGIcon/SVGIcon";

// 포커스 가능한 요소 셀렉터
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 제어 (스크롤 잠금, ESC 키, 포커스 트랩)
  useEffect(() => {
    // 스크롤 잠금
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    if (!isOpen) {
      // isOpen이 false일 때도 cleanup 보장
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }

    // ESC 키 핸들러
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // 포커스 트랩 설정
    const updateFocusableElements = () => {
      if (!modalRef.current) return null;

      const elements = modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);

      if (elements.length === 0) return null;

      return {
        first: elements[0] as HTMLElement,
        last: elements[elements.length - 1] as HTMLElement,
      };
    };

    let focusableElements = updateFocusableElements();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      // 동적 콘텐츠 변경 시 포커스 가능 요소 갱신
      focusableElements = updateFocusableElements();
      if (!focusableElements) return;

      const { first, last } = focusableElements;

      // 요소가 하나만 있는 경우 탭 이동 방지
      if (first === last) {
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      handleEscape(e);
      handleTab(e);
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof window === "undefined") return null;

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
        className={`relative w-full sm:w-374 lg:w-sm sm:mx-16 mx-0 bg-background-secondary rounded-t-xl sm:rounded-xl shadow-xl ${className}`}
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
