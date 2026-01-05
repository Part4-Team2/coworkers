import { useCallback } from "react";

/**
 * 현재 포커스된 요소의 포커스를 해제하는 커스텀 훅
 * 드롭다운 메뉴에서 모달 오픈 시 포커스 충돌 방지용
 */
export const useBlurActiveElement = () => {
  return useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);
};
