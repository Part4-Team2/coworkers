"use client";

import { useState } from "react";
import SVGIcon from "../../Common/SVGIcon/SVGIcon";
import { CommentResponse } from "@/lib/types/comment";
import { createComment } from "@/lib/api/comment";

type InputReplyProps = {
  taskId: number | string;
  onCreate?: (newComment: CommentResponse) => void;
};

export default function InputReply({ taskId, onCreate }: InputReplyProps) {
  const [commentText, setCommentText] = useState("");
  const isActive = commentText.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActive) return;

    try {
      const result = await createComment(String(taskId), commentText.trim());

      if (!result.success || !result.data) {
        alert("댓글 생성 실패");
        return;
      }

      // UI 업데이트 콜백 실행
      onCreate?.(result.data);

      // 입력창 초기화
      setCommentText("");
    } catch (err) {
      console.error(err);
      alert("댓글 생성 중 오류가 발생했습니다.");
    }
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
