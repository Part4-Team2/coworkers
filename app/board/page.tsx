"use client";

import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import BoardInput from "./components/BoardInput";

function BoardPage() {
  const [inputVal, setInputVal] = useState("");

  return (
    <div className="min-h-screen flex justify-center items-center">
      <BoardInput
        value={inputVal}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputVal(e.target.value)
        }
      />
    </div>
  );
}

export default BoardPage;
