"use client";

import { useState } from "react";
import Header from "@/components/Common/Header/Header";

import Dropdown from "@/components/Common/Dropdown/Dropdown";
import Button from "@/components/Common/Button/Button";

// Dropdown 컴포넌트는 배열을 받습니다.
const TEST: string[] = ["1번 선택지", "2번 선택지", "3번 선택지"];
const TEST2: string[] = ["수정하기", "삭제하기"];

export default function DropdownPage() {
  const [test, setTest] = useState(TEST[0]);
  const [test2, setTest2] = useState(TEST2[0]);

  return (
    <div>
      <Header />
      <div className="flex flex-col justify-center gap-20 items-center min-h-screen">
        <Dropdown
          options={TEST}
          onSelect={setTest}
          size="md"
          trigger="text"
          value={test}
          icon="toggle"
        />
        <Button label="z-index test" />
        <Dropdown
          options={TEST2}
          onSelect={setTest2}
          size="md"
          trigger="icon"
          value={test2}
          icon="kebabLarge"
        />
      </div>
    </div>
  );
}
