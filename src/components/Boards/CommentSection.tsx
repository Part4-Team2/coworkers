"use client";

import clsx from "clsx";
import Button from "../Common/Button/Button";
import Comment from "./Comment";
import InputBox from "../Common/Input/InputBox";
import { ArticleComment } from "@/types/articleComment";

interface Pageprops {
  comments: ArticleComment[];
}

function CommentSection({ comments }: Pageprops) {
  // 댓글 작성 후 버튼을 누르면 처리되는 함수입니다.
  const handleCommentClick = () => {
    console.log("댓글 버튼 작동");
  };

  // 등록된 댓글 개수에 따라 나오는 UI가 다릅니다.
  const renderComment = () => {
    if (comments.length > 0) {
      return (
        <>
          {comments.map((comment) => (
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
            width="1200px"
            maxHeight="104px"
          />
        </div>
        <div className="self-end">
          <Button label="등록" onClick={handleCommentClick} width="184px" />
        </div>
      </div>
      <div className="border-b border-b-text-primary/10"></div>
      {/* 등록된 댓글 전시 영역 */}
      <div>{renderComment()}</div>
    </section>
  );
}

export default CommentSection;
