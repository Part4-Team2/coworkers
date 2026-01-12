"use client";

import clsx from "clsx";
import Button from "../Common/Button/Button";
import Comment from "./Comment";
import InputBox from "../Common/Input/InputBox";
import { ArticleComment } from "@/types/articleComment";
import { getArticleComments, postComment } from "@/api/boards";
import { useState } from "react";

interface Pageprops {
  articleId: number;
  comments: ArticleComment[];
  onCommentAdd: () => void;
}

function CommentSection({ articleId, comments, onCommentAdd }: Pageprops) {
  const [commentList, setCommentList] = useState(comments);
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
                nickname={comment.writer.nickname}
                avatarImageUrl={comment.writer.image}
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
    </section>
  );
}

export default CommentSection;
