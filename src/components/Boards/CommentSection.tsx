"use client";

import clsx from "clsx";
import Button from "../Common/Button/Button";
import Comment from "./Comment";
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
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface CommentFormData {
  content: string;
}

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  const [commentList, setCommentList] = useState(comments.list);
  const [cursor, setCursor] = useState<number | undefined>(comments.nextCursor);
  const [hasNext, setHasNext] = useState(!!comments.nextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 댓글 작성 후 버튼을 누르면 처리되는 함수입니다.
  const onSubmit = async (data: CommentFormData) => {
    // 중복 클릭 방지
    if (isSubmitting) return;

    // 비로그인이면 로그인 페이지로 이동합니다.
    if (!isLogin) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const newComment = await postComment(articleId, {
        content: data.content,
      });
      setCommentList((prev) => [newComment, ...prev]);

      reset();
      onCommentAdd();
      toast.success("등록되었습니다!");
    } catch (error) {
      console.log("댓글 등록 오류:", error);
      toast.error("댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
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
        <div className="flex flex-col gap-8">
          <InputBox
            placeholder="댓글을 입력해주세요"
            {...register("content", {
              required: "댓글을 입력해주세요.",
              minLength: {
                value: 1,
                message: "댓글은 최소 1글자 이상 입력해야합니다.",
              },
              maxLength: {
                value: 200,
                message: "댓글은 최대 200글자까지 입력 가능합니다.",
              },
            })}
            width="1200px"
            maxHeight="104px"
          />
          {errors.content && (
            <p className="text-status-danger text-sm">
              {errors.content.message}
            </p>
          )}
        </div>
        <div className="self-end">
          <Button
            label="등록"
            onClick={handleSubmit(onSubmit)}
            size="xSmall"
            className="w-74 sm:w-184 sm:h-46 sm:text-lg"
            loading={isSubmitting}
          />
        </div>
      </div>
      <div className="border-b border-b-text-primary/10"></div>
      {/* 등록된 댓글 전시 영역 */}
      <div>{renderComment()}</div>
      {/* 무한 페이지 */}
      <div ref={bottomRef} />
    </section>
  );
}

export default CommentSection;
