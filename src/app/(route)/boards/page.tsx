import clsx from "clsx";
import BoardClient from "./BoardClient";
import { Suspense } from "react";

function BoardPage() {
  return (
    <Suspense
      fallback={
        <div className={clsx("min-h-screen flex justify-center")}>로딩중</div>
      }
    >
      <BoardClient />
    </Suspense>
  );
}

export default BoardPage;
