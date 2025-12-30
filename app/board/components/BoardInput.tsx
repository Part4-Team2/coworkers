import clsx from "clsx";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";
import { ChangeEvent } from "react";

interface BoardInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// 자유게시판에 쓰이는 검색바 입니다.
// 임시로 최대 수용 글자수를 50으로 설정했습니다.
// 추후에 어떤 방식으로 작동할지는 모르겠습니다.
function BoardInput({ value, onChange }: BoardInputProps) {
  return (
    <div
      className={clsx(
        "w-full max-w-1200 bg-background-secondary mx-auto p-16",
        "rounded-xl border border-text-primary/10",
        "text-text-default text-base",
        "focus-within:border-text-primary"
      )}
    >
      <div className="flex gap-12">
        {/* 아이콘은 추후에 돋보기 모양으로 변경 예정 */}
        <div>
          <SVGIcon icon="comment" />
        </div>
        <input
          type="text"
          className="flex-1 bg-transparent outline-0"
          placeholder="검색어를 입력해주세요"
          value={value}
          onChange={onChange}
          maxLength={50}
        />
      </div>
    </div>
  );
}

export default BoardInput;
