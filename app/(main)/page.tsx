"use client";

import clsx from "clsx";
// import Image from "next/image";
import ButtonFloating from "../components/Button/ButtonFloating";
import SVGIcon from "../components/SVGIcon/SVGIcon";

export default function Home() {
  const handleClick = () => {
    console.log("Button click");
  };

  return (
    // Page Wrapper
    <div className="min-h-screen bg-background-primary">
      {/* Content Wrapper */}
      <div className="max-w-1920 mx-auto">
        {/* Landing top */}
        <div
          className={clsx("flex flex-col justify-center items-center", "py-84")}
        >
          <div
            className={clsx("flex flex-col gap-20", "items-center", "w-612")}
          >
            <div className={clsx("flex items-center gap-24")}>
              <div className="text-5xl font-semibold leading-none">
                함께 만들어가는 투두 리스트
              </div>
              <SVGIcon icon="repairLarge" size={48} />
            </div>
            <div
              className={clsx(
                "text-7xl text-transparent font-normal",
                "bg-brand-gradient bg-clip-text"
              )}
            >
              Coworkers
            </div>
          </div>
          <ButtonFloating
            label="지금 시작하기"
            variant="solid"
            size="large"
            width="373px"
            onClick={handleClick}
          />
        </div>
        {/* Landing mid */}
        <div className="flex flex-col items-center gap-80 pt-60">
          <div
            className={clsx(
              "w-996 rounded-4xl border border-brand-secondary",
              "shadow-lg shadow-white/25"
            )}
          >
            그룹을 할 일을 관리해요<br></br>
            그룹을 할 일을 관리해요<br></br>
            그룹을 할 일을 관리해요<br></br>
            그룹을 할 일을 관리해요<br></br>
          </div>
          <div
            className={clsx(
              "w-996 rounded-4xl border bg-background-secondary",
              "border-background-primary"
            )}
          >
            간단하게 멤버들을 초대해요<br></br>
            간단하게 멤버들을 초대해요<br></br>
            간단하게 멤버들을 초대해요<br></br>
            간단하게 멤버들을 초대해요<br></br>
          </div>
          <div
            className={clsx(
              "w-996 rounded-4xl border bg-black",
              "border-background-primary"
            )}
          >
            할 일도 간편하게 체크해요<br></br>할 일도 간편하게 체크해요<br></br>
            할 일도 간편하게 체크해요<br></br>할 일도 간편하게 체크해요<br></br>
          </div>
        </div>
        {/* Landing bottom */}
        <div className="pt-230">
          <div className="flex flex-col gap-24 items-center">
            <div className="text-4xl font-semibold">지금 바로 시작해보세요</div>
            <div className="text-xl font-medium">
              팀원 모두와 같은 방향, 같은 속도로 나아가는 가장 쉬운 방법
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
