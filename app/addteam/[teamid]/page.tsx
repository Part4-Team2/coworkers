"use client";

import { useState } from "react";
import Member from "./components/member";
import Report from "./components/Report";

// 임시 데이터
const mockMembers = [
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

export default function TeamPage() {
  const [members] = useState(mockMembers);

  const handleInviteMember = () => {
    // 멤버 초대
    console.log("새로운 멤버 초대하기");
  };

  const handleMemberMenuClick = (memberId: number) => {
    // 멤버 메뉴 클릭
    console.log("Member menu clicked:", memberId);
  };

  return (
    <div className="w-full bg-background-primary min-h-screen py-40">
      <div className="max-w-1200 mx-auto px-16 lg:px-24">
        {" "}
        {/* 리포트 영역 */}
        <Report
          progressPercentage={25}
          todayTaskCount={20}
          completedTaskCount={5}
        />
        {/* 멤버 영역 */}
        <div className="flex items-center justify-between mb-24">
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
