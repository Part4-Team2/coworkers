"use client";

import ReplyItem from "./ReplyItem";
import { useEffect, useState } from "react";
import { getComments } from "@/lib/api/comment";
import { CommentResponse } from "@/lib/types/comment";
import InputReply from "./InputReply";

type ReplyProps = {
  taskId: number | string;
};
export default function Reply({ taskId }: ReplyProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);

  useEffect(() => {
    if (!taskId) return;

    getComments(String(taskId)).then((res) => {
      if (res.success) {
        setComments(res.data);
      }
    });
  }, [taskId]);

  const handleUpdate = (id: number, newContent: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, content: newContent, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const handleRemove = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAdd = (comment: CommentResponse) => {
    setComments((prev) => [...prev, comment]);
  };

  if (!comments.length) {
    return (
      <div className="mt-16 text-text-secondary text-sm">
        아직 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div>
      <InputReply taskId={taskId} onCreate={handleAdd} />

      {comments.map((comment) => (
        <ReplyItem
          key={comment.id}
          comment={comment}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
