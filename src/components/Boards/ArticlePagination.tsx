import clsx from "clsx";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// Article 페이지네이션에 쓰이는 함수입니다.
function ArticlePagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className={clsx("flex gap-8", "text-text-primary")}>
      <button
        className={clsx("cursor-pointer")}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        이전
      </button>
      {/* 임시로 설정해놓은 버튼입니다 추후에 확장성을 위해 바꾸겠습니다. */}
      <div className="flex gap-8">
        <span>{page}</span>
        <span>/</span>
        <span>{totalPages}</span>
      </div>
      <button
        className={clsx("cursor-pointer")}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        다음
      </button>
    </div>
  );
}

export default ArticlePagination;
