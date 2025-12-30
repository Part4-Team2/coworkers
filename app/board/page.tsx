"use client";

import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import BoardInput from "./components/BoardInput";
import BestArticle from "./components/BestArticle";

function BoardPage() {
  const [inputVal, setInputVal] = useState("");

  return (
    <div
      className={clsx(
        "min-h-screen flex flex-col gap-20 justify-center items-center"
      )}
    >
      <BoardInput
        value={inputVal}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputVal(e.target.value)
        }
      />
      <BestArticle />
    </div>
  );
}

export default BoardPage;
