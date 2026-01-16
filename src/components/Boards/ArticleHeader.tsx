"use client";

import clsx from "clsx";
import SVGIcon from "../Common/SVGIcon/SVGIcon";
import Dropdown from "../Common/Dropdown/Dropdown";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArticle, postLike, deleteLike } from "@/lib/api/boards";
import { Article } from "@/types/article";

interface Props {
  article: Article;
  commentCount: number;
  currentUserId: number | null;
}

const ARTICLEDATA = ["수정하기", "삭제하기"];

function ArticleHeader({ article, commentCount, currentUserId }: Props) {
  const articleId = article.id;
  const router = useRouter();
  const isAuthor = currentUserId === article.writer.id;

  const [likeCount, setLikeCount] = useState(article.likeCount);
  const [isLike, setIsLike] = useState(article.isLiked);

  // 게시글을 삭제하는 함수입니다.
  const handleDeleteArticle = async ({ articleId }: { articleId: number }) => {
    try {
      // 현재 삭제 버튼을 누르면 재차 확인없이 바로 API 호출합니다.
      await deleteArticle(articleId);
      // API call 성공하면 자유게시판으로 이동합니다.
      alert("삭제 성공, 자유게시판으로 이동합니다.");
      router.push("/boards");
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류 발생");
    }
  };

  // 게시글 수정하기 삭제하기를 다루는 임시함수 입니다.
  const handleArticleClick = (value: string) => {
    if (value === "수정하기") {
      router.push(`/boards/${articleId}/edit`);
    }

    if (value === "삭제하기") {
      handleDeleteArticle({ articleId });
    }
  };

  // 게시글 좋아요 반영하는 함수입니다. 상태에 따라 갈라집니다.
  const handleLikeClick = async () => {
    if (isLike === false) {
      try {
        await postLike(article.id);
        alert("좋아요 추가 성공"); //Toast
        setLikeCount((prev) => prev + 1);
        setIsLike((prev) => !prev);
      } catch (error) {
        console.error("좋아요 추가 오류", error);
      }
    } else {
      try {
        await deleteLike(article.id);
        alert("좋아요 삭제 성공"); //Toast
        setLikeCount((prev) => prev - 1);
        setIsLike((prev) => !prev);
      } catch (error) {
        console.error("좋아요 삭제 오류", error);
      }
    }
  };

  return (
    <>
      {/* 게시글 제목 영역 */}
      <div className={clsx("flex justify-between")}>
        <span className="text-2lg">{article.title}</span>
        <span>
          {isAuthor && (
            <Dropdown
              options={ARTICLEDATA}
              onSelect={handleArticleClick}
              value={ARTICLEDATA[0]}
              size="md"
              trigger="icon"
              icon="kebabLarge"
              listPosition="top-full right-0"
            />
          )}
        </span>
      </div>
      <div className="border-b border-b-text-primary/10"></div>
      {/* 작성자, 좋아요/댓글 개수 표시 영역 */}
      <div className={clsx("flex justify-between text-slate-400 text-sm")}>
        {/* 작성자, 게시글 생성일자 */}
        <div className="flex gap-16 items-center">
          <div className="flex gap-12 items-center">
            <span className="text-text-primary">{article.writer.nickname}</span>
          </div>
          <div className="text-text-primary/10">|</div>
          <div className="text-slate-400">{article.createdAt.slice(0, 10)}</div>
        </div>
        {/* 좋아요/댓글 개수 표시 */}
        <div className="flex gap-16">
          <div className="flex gap-4 items-center">
            <SVGIcon icon="comment" size={14} />
            <span>{commentCount}</span>
          </div>
          <div
            className="flex gap-4 items-center cursor-pointer"
            onClick={handleLikeClick}
          >
            <SVGIcon
              icon="heart"
              size={14}
              className={clsx(isLike ? "fill-gray-500" : "")}
            />
            <span>{likeCount > 9999 ? "9999+" : likeCount}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArticleHeader;
