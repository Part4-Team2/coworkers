"use client";

import clsx from "clsx";
import Image from "next/image";
import ButtonFloating from "../components/Button/ButtonFloating";
import SVGIcon from "../components/SVGIcon/SVGIcon";

export default function Home() {
  // 함수는 추후 navigating으로 변경됩니다.
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
          className={clsx(
            "flex flex-col justify-between items-center",
            "py-84 h-1080",
            "bg-[url(/landing/main/size-large.png)]"
          )}
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
          {/* 색상이 초록색으로 고정됩니다, 추후에 그라디언트 색상이 들어오면 변경 예정입니다. */}
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
            <div className={clsx("flex justify-around items-center", "pt-81")}>
              <div className={clsx("relative w-291 h-338")}>
                <Image
                  src={"/landing/mockup/mockup-01.svg"}
                  fill
                  priority
                  alt="mockup01"
                />
              </div>
              <div className="flex flex-col gap-16">
                <div>
                  <Image
                    src={"/landing/mockup/mockup-sub-01.svg"}
                    alt="mockup-sub01"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="text-2xl">
                  그룹으로<br></br>할 일을 관리해요
                </div>
              </div>
            </div>
          </div>
          <div
            className={clsx(
              "w-996 rounded-4xl border bg-background-secondary",
              "border-background-primary"
            )}
          >
            <div className={clsx("flex justify-around items-center", "pb-81")}>
              <div className="flex flex-col gap-16">
                <div>
                  <Image
                    src={"/landing/mockup/mockup-sub-02.svg"}
                    alt="mockup-sub01"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="text-2xl">
                  간단하게 멤버들을<br></br>초대해요
                </div>
              </div>
              <div className={clsx("relative w-291 h-338")}>
                <Image
                  src={"/landing/mockup/mockup-02.svg"}
                  fill
                  priority
                  alt="mockup01"
                />
              </div>
            </div>
          </div>
          {/* 이미지 부분 간격이 안 맞습니다 */}
          <div
            className={clsx(
              "w-996 rounded-4xl border bg-black",
              "border-background-primary"
            )}
          >
            <div className={clsx("flex justify-around items-center", "pb-81")}>
              <div className={clsx("relative w-291 h-338")}>
                <Image
                  src={"/landing/mockup/mockup-03.svg"}
                  fill
                  priority
                  alt="mockup01"
                />
              </div>
              <div className="flex flex-col gap-16">
                <div>
                  <Image
                    src={"/landing/mockup/mockup-sub-03.svg"}
                    alt="mockup-sub01"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="text-2xl">
                  할 일도 간편하게<br></br>체크해요
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Landing bottom */}
        <div
          className={clsx(
            "pt-230 h-1080",
            "bg-[url(/landing/bottom/size=large.png)]"
          )}
        >
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
