"use client";

import clsx from "clsx";
import Image from "next/image";
import Button from "@/components/Common/Button/Button";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { useRouter } from "next/navigation";

export default function Home() {
  const Router = useRouter();

  // 버튼을 누르면 로그인 페이지로 이동합니다.
  const handleClick = () => {
    console.log("Button click");
    Router.push("/login");
  };

  return (
    // Page Wrapper
    <div className="min-h-screen bg-background-primary">
      {/* Content Wrapper */}
      <main className="max-w-639 sm:max-w-1199 lg:max-w-1920 mx-auto">
        {/* Landing top */}
        <section
          className={clsx(
            "flex flex-col justify-between items-center",
            "py-84 h-640 sm:h-940 lg:h-1080",
            "bg-[url(/landing/main/size-small.png)] sm:bg-[url(/landing/main/size-medium.png)] lg:bg-[url(/landing/main/size-large.png)]",
            "bg-no-repeat bg-center bg-cover"
          )}
        >
          <article
            className={clsx("flex flex-col gap-20", "items-center", "w-612")}
          >
            <div className={clsx("flex items-center gap-24")}>
              <div className="text-2xl sm:text-4xl lg:text-5xl font-semibold leading-none">
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
          </article>
          {/* 색상이 초록색으로 고정됩니다, 추후에 그라디언트 색상이 들어오면 변경 예정입니다. */}
          <Button
            label="지금 시작하기"
            variant="gradient"
            size="large"
            width="373px"
            onClick={handleClick}
          />
        </section>
        {/* Landing mid */}
        <section className="flex flex-col items-center gap-24 lg:gap-80 pt-60">
          <article
            className={clsx(
              "w-343 sm:w-696 lg:w-996 rounded-4xl border border-brand-secondary",
              "shadow-lg shadow-white/25"
            )}
          >
            <div
              className={clsx(
                "flex flex-col-reverse gap-40 sm:flex-row justify-around items-center",
                "px-54 pt-48 sm:pt-81"
              )}
            >
              <div
                className={clsx(
                  "relative",
                  "w-232 h-269",
                  "sm:w-235 sm:h-273",
                  "lg:w-291 lg:h-338"
                )}
              >
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
          </article>
          <article
            className={clsx(
              "w-343 sm:w-696 lg:w-996 rounded-4xl border bg-background-secondary",
              "border-background-primary"
            )}
          >
            <div
              className={clsx(
                "flex flex-col-reverse gap-40 sm:flex-row justify-around items-center",
                "px-54 pb-48 sm:pb-81"
              )}
            >
              <div className="flex flex-col gap-16">
                <div>
                  <Image
                    src={"/landing/mockup/mockup-sub-02.svg"}
                    alt="mockup-sub02"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="text-2xl">
                  간단하게 멤버들을<br></br>초대해요
                </div>
              </div>
              <div
                className={clsx(
                  "relative",
                  "w-232 h-269",
                  "sm:w-235 sm:h-273",
                  "lg:w-291 lg:h-338"
                )}
              >
                <Image
                  src={"/landing/mockup/mockup-02.svg"}
                  fill
                  alt="mockup02"
                />
              </div>
            </div>
          </article>
          {/* 이미지 부분 간격이 안 맞습니다 여려분의 의견이 필요합니다. */}
          <article
            className={clsx(
              "w-343 sm:w-696 lg:w-996 rounded-4xl border bg-black",
              "border-background-primary"
            )}
          >
            <div
              className={clsx(
                "flex flex-col gap-40 sm:flex-row justify-around items-center",
                "pb-81"
              )}
            >
              <div
                className={clsx(
                  "relative",
                  "w-232 h-269",
                  "sm:w-235 sm:h-273",
                  "lg:w-291 lg:h-338"
                )}
              >
                <Image
                  src={"/landing/mockup/mockup-03.svg"}
                  fill
                  alt="mockup03"
                />
              </div>
              <div className="flex flex-col gap-16">
                <div>
                  <Image
                    src={"/landing/mockup/mockup-sub-03.svg"}
                    alt="mockup-sub03"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="text-2xl">
                  할 일도 간편하게<br></br>체크해요
                </div>
              </div>
            </div>
          </article>
        </section>
        {/* Landing bottom */}
        <section
          className={clsx(
            "pt-230 h-1080",
            "bg-[url(/landing/bottom/size=small.png)] sm:bg-[url(/landing/bottom/size=medium.png)] lg:bg-[url(/landing/bottom/size=large.png)]",
            "bg-no-repeat bg-center bg-cover"
          )}
        >
          <div className="flex flex-col gap-24 items-center">
            <div className="text-4xl font-semibold">지금 바로 시작해보세요</div>
            <div className="text-xl font-medium">
              팀원 모두와 같은 방향, 같은 속도로 나아가는 가장 쉬운 방법
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
