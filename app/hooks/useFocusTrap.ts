import { useEffect, useRef } from "react";

// 포커스 가능한 요소 셀렉터
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface UseFocusTrapOptions {
  isActive: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onEscape?: () => void;
  excludeInitialFocusSelector?: string;
}

/**
 * 포커스 트랩 커스텀 훅
 *
 * @param isActive
 * @param containerRef - 포커스를 가둘 컨테이너 요소의 ref
 * @param onEscape - ESC 키 누를 때 콜백
 * @param excludeInitialFocusSelector - 초기 포커스에서 제외할 요소의 선택자 (예: [aria-label="닫기"])
 */
export const useFocusTrap = ({
  isActive,
  containerRef,
  onEscape,
  excludeInitialFocusSelector,
}: UseFocusTrapOptions) => {
  const initialFocusSetRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      initialFocusSetRef.current = false;
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // 포커스 가능한 요소들 가져오기
    const getFocusableElements = () => {
      const elements = container.querySelectorAll(FOCUSABLE_SELECTOR);
      if (elements.length === 0) return null;

      return {
        all: elements,
        first: elements[0] as HTMLElement,
        last: elements[elements.length - 1] as HTMLElement,
      };
    };

    // 초기 포커스 설정 (한 번만)
    let focusTimeoutId: NodeJS.Timeout | undefined;
    if (!initialFocusSetRef.current) {
      focusTimeoutId = setTimeout(() => {
        const focusables = getFocusableElements();
        if (!focusables) return;

        // 제외할 요소가 아닌 첫 번째 요소 찾기
        const targetElement = excludeInitialFocusSelector
          ? (Array.from(focusables.all).find(
              (el) => !el.matches(excludeInitialFocusSelector)
            ) as HTMLElement | undefined)
          : undefined;

        const elementToFocus = targetElement || focusables.first;
        elementToFocus?.focus();
        initialFocusSetRef.current = true;
      }, 0);
    }

    // 키보드 이벤트 핸들러
    const handleKeydown = (e: KeyboardEvent) => {
      // ESC 키
      if (e.key === "Escape" && onEscape) {
        onEscape();
        return;
      }

      // Tab 키 (포커스 트랩)
      if (e.key === "Tab") {
        const focusables = getFocusableElements();
        if (!focusables) return;

        const { first, last } = focusables;

        // 요소가 하나만 있으면 이동 방지
        if (first === last) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      if (focusTimeoutId) clearTimeout(focusTimeoutId);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isActive, containerRef, onEscape, excludeInitialFocusSelector]);
};
