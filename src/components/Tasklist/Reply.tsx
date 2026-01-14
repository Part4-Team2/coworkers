"use client";

import ReplyItem from "./ReplyItem";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getComments } from "@/lib/api/comment";
import { CommentResponse } from "@/lib/types/comment";

export default function Reply() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("task");

  const [comments, setComments] = useState<CommentResponse>([]);

  useEffect(() => {
    if (!taskId) return;

    getComments(taskId).then((res) => {
      if (res.success) {
        console.log(res.data);
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

  if (!comments.length) {
    return (
      <div className="mt-16 text-text-secondary text-sm">
        아직 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div>
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
