"use client";

import { useState } from "react";
import SVGIcon from "../Common/SVGIcon/SVGIcon";

export default function InputReply() {
  const [commentText, setCommentText] = useState("");
  const isActive = commentText.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActive) return;

    // TODO: api 호출로 댓글 제출
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-start border-y border-y-border-primary py-13"
    >
      <textarea
        placeholder="댓글을 달아주세요"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="flex-1 resize-none field-sizing-content placeholder-text-default text-text-primary text-md font-regular"
      ></textarea>
      <button type="submit" disabled={!isActive}>
        <SVGIcon icon={isActive ? "btnEnterActive" : "btnEnterDefault"} />
      </button>
    </form>
  );
}
