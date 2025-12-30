import clsx from "clsx";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";

const MOCKDATA = {
  id: 1,
  title: "게시글 제목입니다.",
  date: "2025.12.29",
};

// 베스트 게시글을 display하는 컴포넌트 입니다.
function BestArticle() {
  return (
    <div
      className={clsx(
        "w-387 h-220 bg-background-secondary",
        "pt-12 px-24 pb-16",
        "border border-text-primary/10 rounded-xl"
      )}
    >
      <div className={clsx("flex flex-col gap-14")}>
        <div className="flex gap-4">
          <SVGIcon icon="progressDone" />
          <span className="text-white">Best</span>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-12">
            <div className="text-2lg text-text-secondary">{MOCKDATA.title}</div>
            <div className="text-sm text-slate-400">{MOCKDATA.date}</div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-12">
              <span>우지은</span>
            </div>
            <div>9999 +</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestArticle;
