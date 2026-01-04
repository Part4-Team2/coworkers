"use client";

import Avatar from "@/components/Common/Avatar/Avatar";
import ButtonFloating from "@/components/Common/Button/ButtonFloating";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import InputReply from "@/components/Tasklist/InputReply";
import Reply from "@/components/Tasklist/Reply";
import clsx from "clsx";
import { useState } from "react";

const handleXButton = () => {};

const handleKebabButton = () => {};

export default function TaskDetailsContainer() {
  const [isComplete, setIsComplete] = useState(false);

  const handleCompleteTaskButton = () => {
    setIsComplete((prev) => !prev);
  };
  return (
    <div className="flex flex-col gap-16 p-40">
      <SVGIcon icon="x" onClick={handleXButton} />
      {isComplete && (
        <div className="flex items-center gap-6">
          <SVGIcon icon="check" size="xxs" />
          <span className="text-xs font-medium text-brand-tertiary">완료</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h3 className={clsx("text-xl font-bold", isComplete && "line-through")}>
          법인 설립 비용 안내 드리기
        </h3>
        <SVGIcon icon="kebabLarge" onClick={handleKebabButton} />
      </div>
      <div className="flex items-center">
        <Avatar altText="안해나 프로필" size="large" />
        <span className="ml-12 text-md font-medium">안해나</span>
        <span className="ml-auto text-text-secondary text-md font-regular">
          2025.05.30
        </span>
      </div>
      {!isComplete && (
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
      )}

      <div className="min-h-200">
        필수 정보 10분 입력하면 3일 안에 법인 설립이 완료되는 법인 설립 서비스의
        장점에 대해 상세하게 설명드리기
      </div>
      <InputReply />
      <Reply />
      <div className="fixed bottom-50 z-50 right-[max(1.5rem,calc(50%-600px+1.5rem))]">
        {isComplete ? (
          <ButtonFloating
            label="완료 취소하기"
            icon={<SVGIcon icon="check" size="xxs" />}
            variant="outlined"
            size="large"
            onClick={handleCompleteTaskButton}
          />
        ) : (
          <ButtonFloating
            label="완료 하기"
            icon={<SVGIcon icon="checkOne" size="xxs" />}
            variant="solid"
            size="large"
            onClick={handleCompleteTaskButton}
          />
        )}{" "}
      </div>
    </div>
  );
}
