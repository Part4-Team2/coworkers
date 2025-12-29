"use client";

import { useState, useCallback } from "react";
import Member from "./components/Member";
import Report from "./components/Report";
import TodoList from "./components/TodoList";
import { Todo, Member as MemberType } from "./types";

// 임시 데이터
const mockMembers: MemberType[] = [
  {
    id: 1,
    name: "우지은",
    email: "jieun@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 2,
    name: "김미희",
    email: "Mihee@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 3,
    name: "김슬아",
    email: "seula@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 4,
    name: "이동규",
    email: "dongkyu@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 5,
    name: "김단혜",
    email: "Dahye@codeit.com",
    imageUrl: undefined,
  },
  {
    id: 6,
    name: "이연지",
    email: "Yeonji@codeit.com",
    imageUrl: undefined,
  },
];

const mockTodos: Todo[] = [
  {
    id: 1,
    name: "법인 설립",
    completedCount: 3,
    totalCount: 5,
    color: "#A855F7",
  },
  {
    id: 2,
    name: "변경 등기",
    completedCount: 5,
    totalCount: 5,
    color: "#3B82F6",
  },
  {
    id: 3,
    name: "정기 주총",
    completedCount: 3,
    totalCount: 5,
    color: "#14B8A6",
  },
  {
    id: 4,
    name: "법인 설립",
    completedCount: 3,
    totalCount: 5,
    color: "#EC4899",
  },
];

export default function TeamPage() {
  const [members] = useState(mockMembers);
  const [todos] = useState(mockTodos);

  const handleInviteMember = useCallback(() => {
    // 멤버 초대
    console.log("새로운 멤버 초대하기");
  }, []);

  const handleAddTodo = useCallback(() => {
    // 할 일 목록 추가
    console.log("새로운 목록 추가하기");
  }, []);

  const handleMemberMenuClick = useCallback((memberId: number) => {
    // 멤버 메뉴 클릭
    console.log("Member menu clicked:", memberId);
  }, []);

  const handleTodoMenuClick = useCallback((todoId: number) => {
    // 할 일 메뉴 클릭
    console.log("Todo menu clicked:", todoId);
  }, []);

  return (
    <div className="w-full bg-background-primary min-h-screen py-40">
      <div className="max-w-1200 mx-auto px-16 lg:px-24">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-lg font-medium leading-lg text-text-primary">
            할 일 목록{" "}
            <span className="text-lg font-regular leading-lg text-text-default">
              ({todos.length}개)
            </span>
          </h2>
          <button
            type="button"
            onClick={handleAddTodo}
            className="text-md font-regular leading-md text-brand-primary text-right cursor-pointer active:text-interaction-pressed transition-colors"
          >
            + 새로운 목록 추가하기
          </button>
        </div>
        <TodoList todos={todos} onMenuClick={handleTodoMenuClick} />

        <div className="mt-48 lg:mt-64">
          <Report
            progressPercentage={25}
            todayTaskCount={20}
            completedTaskCount={5}
          />
        </div>

        <div className="flex items-center justify-between mb-24 mt-48 lg:mt-64">
          <h2 className="text-lg font-medium leading-lg text-text-primary">
            멤버{" "}
            <span className="text-lg font-regular leading-lg text-text-default">
              ({members.length}명)
            </span>
          </h2>
          <button
            type="button"
            onClick={handleInviteMember}
            className="text-md font-regular leading-md text-brand-primary text-right cursor-pointer active:text-interaction-pressed transition-colors"
          >
            + 새로운 멤버 초대하기
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 sm:gap-24">
          {members.map((member) => (
            <Member
              key={member.id}
              name={member.name}
              email={member.email}
              imageUrl={member.imageUrl}
              onMenuClick={() => handleMemberMenuClick(member.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
