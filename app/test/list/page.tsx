"use client";

import List from "@/app/components/List/List";

export default function ListTestPage() {
  return (
    <div>
      <List
        id="1"
        isToggle={false}
        onToggle={(id) => console.log(id)}
        content="회의 준비하기"
        onClickKebab={(id) => console.log(id)}
        variant="simple"
      />
      <br />
      <List
        id="2"
        isToggle={false}
        onToggle={(id) => console.log(id)}
        content="회의 준비하기 테스트"
        onClickKebab={(id) => console.log(id)}
        variant="detailed"
        commentCount={3}
        frequency="DAILY"
        date="2025-12-28T18:00:00.000Z"
      />
    </div>
  );
}
