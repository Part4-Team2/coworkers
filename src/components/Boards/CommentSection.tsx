"use client";

import clsx from "clsx";
import Button from "../Common/Button/Button";
import Comment from "./Comment";
import CommentSkeleton from "../Common/Skeleton/CommentSkeleton";
import InputBox from "../Common/Input/InputBox";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/store/headerStore";
import { GetArticleComments } from "@/types/articleComment";
import {
  getArticleComments,
  postComment,
  deleteComment,
} from "@/lib/api/boards";
import { useState } from "react";

interface Pageprops {
  articleId: number;
  comments: GetArticleComments;
  onCommentAdd: () => void;
  onCommentDelete: () => void;
}

const COMMENT_LIMIT = 3;

function CommentSection({
  articleId,
  comments,
  onCommentAdd,
  onCommentDelete,
}: Pageprops) {
  const isLogin = useHeaderStore((set) => set.isLogin);
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement | null>(null); // 아래 스크롤 감지

  const [commentList, setCommentList] = useState(comments.list);
  const [cursor, setCursor] = useState<number | undefined>(comments.nextCursor);
  const [hasNext, setHasNext] = useState(!!comments.nextCursor);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 댓글 작성 후 버튼을 누르면 처리되는 함수입니다.
  const handleCommentSubmit = async () => {
    // 비로그인이면 로그인 페이지로 이동합니다.
    if (!isLogin) {
      router.push("/login");
      return;
    }

    if (!content.trim()) {
      alert("댓글 최소 1글자 이상 입력해야합니다.");
      return;
    } // 댓글 내용 없으면 바로 리턴.

    try {
      const newComment = await postComment(articleId, { content });
      setCommentList((prev) => [newComment, ...prev]);

      setContent("");
      onCommentAdd();
    } catch (error) {
      console.log("게시글 올리기 오류:", error);
    }
  };

  // 아래로 스크롤 한 경우 새로운 댓글을 갖고옵니다.
  const fetchMoreComments = useCallback(async () => {
    if (cursor === undefined || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await getArticleComments({
        articleId,
        limit: COMMENT_LIMIT,
        cursor,
      });
      setCommentList((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        // Id 중복되는 호출을 거르는 필터입니다.
        const filtered = res.list.filter((c) => !existingIds.has(c.id));
        return [...prev, ...filtered];
      });
      setCursor(res.nextCursor ?? undefined);
      setHasNext(!!res.nextCursor);
    } catch (error) {
      console.error("댓글 불러오기 실패", error);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading, articleId]);

  // 댓글 삭제하면 삭제한 상태로 렌더링합니다.
  const deleteCommentClick = async (deleteId: number) => {
    try {
      await deleteComment(deleteId);
      setCommentList((prev) =>
        prev.filter((comment) => comment.id !== deleteId)
      );
      onCommentDelete();
    } catch (error) {
      console.error("삭제하기 오류", error);
    }
  };

  // 스크롤 감지하는 함수입니다.
  useEffect(() => {
    if (!bottomRef.current || !hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNext) {
          fetchMoreComments();
        }
      },
      { threshold: 1 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [cursor, hasNext, fetchMoreComments]);

  // 등록된 댓글 개수에 따라 나오는 UI가 다릅니다.
  const renderComment = () => {
    if (commentList.length > 0) {
      return (
        <>
          {commentList.map((comment) => (
            <div className="pb-16" key={comment.id}>
              <Comment
                commentId={comment.id}
                content={comment.content}
                createdAt={comment.createdAt}
                writerId={comment.writer.id}
                nickname={comment.writer.nickname}
                onDelete={deleteCommentClick}
              />
            </div>
          ))}
        </>
      );
    }

    return (
      <div className={clsx("mt-158 text-base text-center text-text-default")}>
        아직 작성된 댓글이 없습니다.
      </div>
    );
  };

  return (
    <section className={clsx("flex flex-col gap-40")}>
      {/* 댓글 작성 영역 */}
      <div className="flex flex-col gap-24">
        <div className="text-text-primary text-xl">댓글달기</div>
        <div>
          <InputBox
            placeholder="댓글을 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            width="1200px"
            maxHeight="104px"
          />
        </div>
        <div className="self-end">
          <Button label="등록" onClick={handleCommentSubmit} width="184px" />
        </div>
      </div>
      <div className="border-b border-b-text-primary/10"></div>
      {/* 등록된 댓글 전시 영역 */}
      <div>{renderComment()}</div>
      {/* 댓글 로딩 시 스켈레톤이 나옵니다 */}
      {isLoading && <CommentSkeleton />}
      {/* 무한 페이지 */}
      <div ref={bottomRef} />
    </section>
  );
}

export default CommentSection;
