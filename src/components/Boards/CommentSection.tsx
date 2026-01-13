"use client";

import clsx from "clsx";
import Button from "../Common/Button/Button";
import Comment from "./Comment";
import InputBox from "../Common/Input/InputBox";
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
}

function CommentSection({ articleId, comments, onCommentAdd }: Pageprops) {
  const [commentList, setCommentList] = useState(comments.list);
  const [cursor, setCursor] = useState<number | undefined>(comments.nextCursor);
  const [hasNext, setHasNext] = useState(!!comments.nextCursor); // cursor 존재 여부로 다음 댓글 fetching합니다.
  const [content, setContent] = useState("");

  // 댓글 작성 후 버튼을 누르면 처리되는 함수입니다.
  const handleCommentSubmit = async () => {
    if (!content.trim()) return; // 댓글 내용 없으면 바로 리턴.

    try {
      await postComment(articleId, { content });
      setContent("");
      onCommentAdd();
      await fetchComments();
    } catch (error) {
      console.log("게시글 올리기 오류:", error);
    }
  };

  // 댓글 달면 갱신된 댓글 리스트를 갖고옵니다.
  const fetchComments = async () => {
    const data = await getArticleComments({
      articleId,
      limit: 3,
    });

    setCommentList(data.list);
    setCursor(data.nextCursor);
  };

  // 댓글이 3개 넘는 경우에 새로운 댓글을 갖고옵니다.
  const fetchMoreComments = async () => {
    if (!cursor) {
      setHasNext(false);
      return;
    }

    const res = await getArticleComments({
      articleId,
      limit: 3,
      cursor,
    });

    setCommentList((prev) => [...prev, ...res.list]);
    if (!res.nextCursor) setHasNext(false);
  };

  // 댓글 삭제하면 삭제한 상태로 렌더링합니다.
  const deleteCommentClick = async (deleteId: number) => {
    console.log("Delete Comment");
    try {
      await deleteComment(deleteId);
      setCommentList((prev) =>
        prev.filter((comment) => comment.id !== deleteId)
      );
    } catch (error) {
      console.error("삭제하기 오류", error);
    }
  };

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
                avatarImageUrl={comment.writer.image}
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
      {/* 댓글 더 갖고오기 버튼 */}
      {hasNext && (
        <div className={clsx("flex justify-center")}>
          <button
            className={clsx("cursor-pointer")}
            onClick={fetchMoreComments}
          >
            ...더 보기
          </button>
        </div>
      )}
    </section>
  );
}

export default CommentSection;
