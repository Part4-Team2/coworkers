"use client";

import { useState } from "react";
import Header from "@/app/components/Header/Header";

import Dropdown from "@/app/components/Dropdown/Dropdown";
import Button from "@/app/components/Button/Button";

// Dropdown 컴포넌트는 배열을 받습니다.
const TEST: string[] = ["1번 선택지", "2번 선택지", "3번 선택지"];

export default function DropdownPage() {
  const [test, setTest] = useState(TEST[0]);

  return (
    <div>
      <Header />
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Dropdown options={TEST} onSelect={setTest} size="md" value={test} />
        <Button label="z-index test" />
      </div>
    </div>
  );
}
