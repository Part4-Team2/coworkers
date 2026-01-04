"use client";

import clsx from "clsx";
import Button from "@/components/Common/Button/Button";
import Input from "@/components/Common/Input/Input";
import InputBox from "@/components/Common/Input/InputBox";
import { useState } from "react";

function WriteArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [articleImage, setArticleImage] = useState("");

  // 게시글 작성하고 등록하면 작동하는 함수입니다.
  const handleSubmitClick = () => {
    console.log("Submit Button");
  };

  return (
    // Page Wrapper
    <div className="min-h-screen bg-background-primary">
      {/* Content Wrapper */}
      <div
        className={clsx(
          "max-w-1200 mx-auto py-56 text-text-primary",
          "px-20 lg:px-0"
        )}
      >
        <main className="flex flex-col gap-40">
          <section className="flex justify-between items-center">
            <span className="text-xl">게시글 쓰기</span>
            <Button label="등록" width="184px" onClick={handleSubmitClick} />
          </section>
          <div className="border-b border-b-text-primary/10"></div>
          {/* 제목 영역 */}
          <section className="flex flex-col gap-16">
            <div id="title" className="flex gap-6">
              <span className="text-brand-tertiary">*</span>제목
            </div>
            <Input
              placeholder="제목을 입력해주세요."
              width="1200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </section>
          {/* 내용 영역 */}
          <section className="flex flex-col gap-16">
            <div className="flex gap-6">
              <span className="text-brand-tertiary">*</span>내용
            </div>
            <InputBox
              placeholder="내용을 입력해주세요."
              maxHeight="240px"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              full
            />
          </section>
          {/* 이미지 영역 */}
          <section>
            <div>이미지</div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default WriteArticle;
