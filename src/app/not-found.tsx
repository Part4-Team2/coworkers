"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import Button from "@/components/Common/Button/Button";

// 404 페이지 입니다. 문구는 추후에 필요에 따라 변경 가능합니다.
function NotFound() {
  const Router = useRouter();

  const handleHomeClick = () => {
    Router.push("/");
  };

  return (
    // Page Wrapper
    <div className="min-h-screen">
      {/* Content Wrapper */}
      <main className="max-x-1920 mx-auto">
        <section
          className={clsx(
            "flex flex-col justify-between items-center",
            "py-84 h-640 sm:h-940 lg:h-1080",
            "bg-[url(/landing/main/size-small.png)] sm:bg-[url(/landing/main/size-medium.png)] lg:bg-[url(/landing/main/size-large.png)]",
            "bg-no-repeat bg-cover lg:bg-center"
          )}
        >
          <div className="flex flex-col gap-50 items-center">
            <span className="text-4xl">Not Found</span>
            <span className="text-xl text-center">
              존재하지 않은 주소를 입력하셨거나,<br></br>요청하신 페이지의
              주소가<br className="sm:hidden"></br> 변경 or 삭제되어 찾을 수
              없습니다.
            </span>
          </div>
          <Button
            label="홈으로 돌아가기"
            variant="gradient"
            onClick={handleHomeClick}
          />
        </section>
      </main>
    </div>
  );
}

export default NotFound;
