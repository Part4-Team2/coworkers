"use client";

import Avatar from "@/components/Common/Avatar/Avatar";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import InputReply from "@/components/Tasklist/InputReply";
import Reply from "@/components/Tasklist/Reply";

const handleXButton = () => {};

const handleKebabButton = () => {};

export default function TaskDetailsPage() {
  return (
    <div className="flex flex-col gap-16 p-40">
      <SVGIcon icon="x" onClick={handleXButton} />
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">법인 설립 비용 안내 드리기</h3>
        <SVGIcon icon="kebabLarge" onClick={handleKebabButton} />
      </div>
      <div className="flex items-center">
        <Avatar altText="안해나 프로필" size="large" />
        <span className="ml-12 text-md font-medium">안해나</span>
        <span className="ml-auto text-text-secondary text-md font-regular">
          2025.05.30
        </span>
      </div>
      <div className="flex items-center gap-10 text-text-default text-xs font-regular">
        <div className="flex items-center gap-6">
          <SVGIcon icon="calendar" size="xxs" />
          <span>2024년 7월 29일</span>
        </div>
        <div className="w-px h-8 bg-background-tertiary" />
        <div className="flex items-center gap-6">
          <SVGIcon icon="iconTime" size="xxs" />
          <span>오후 3:30</span>
        </div>
        <div className="w-px h-8 bg-background-tertiary " />
        <div className="flex items-center gap-6">
          <SVGIcon icon="iconRepeat" size="xxs" />
          <span>매일 반복</span>
        </div>
      </div>
      <div className="min-h-200">
        필수 정보 10분 입력하면 3일 안에 법인 설립이 완료되는 법인 설립 서비스의
        장점에 대해 상세하게 설명드리기
      </div>
      <InputReply />
      <Reply />
    </div>
  );
}
