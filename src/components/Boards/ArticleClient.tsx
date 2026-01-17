"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import ArticleHeader from "./ArticleHeader";
import CommentSection from "./CommentSection";
import ArticleLike from "./ArticleLike";
import ArticleImage from "./ArticleImage";
import { Article } from "@/types/article";
import { postLike, deleteLike } from "@/lib/api/boards";
import { useState } from "react";
import { useHeaderStore } from "@/store/headerStore";
import { GetArticleComments } from "@/types/articleComment";
import { toast } from "react-toastify";

interface Pageprops {
  article: Article;
  comments: GetArticleComments;
}

function ArticleClient({ article, comments }: Pageprops) {
  const router = useRouter();
  const userId = useHeaderStore((state) => state.userId);
  const isLogin = useHeaderStore((state) => state.isLogin);
  const [likeCount, setLikeCount] = useState(article.likeCount);
  const [isLike, setIsLike] = useState(article.isLiked);
  const [commentCount, setCommentCount] = useState(article.commentCount);

  // 게시글 좋아요 반영하는 함수입니다. 상태에 따라 갈라집니다.
  const handleLikeClick = async () => {
    if (!isLogin) {
      router.push("/login");
      return;
    }

    if (isLike === false) {
      try {
        await postLike(article.id);
        toast.success("좋아요 성공!");
        setLikeCount((prev) => prev + 1);
        setIsLike((prev) => !prev);
      } catch (error) {
        console.error("좋아요 추가 오류", error);
        toast.error("좋아요 추가에 실패했습니다.");
      }
    } else {
      try {
        await deleteLike(article.id);
        toast.success("좋아요가 취소되었습니다.");
        setLikeCount((prev) => prev - 1);
        setIsLike((prev) => !prev);
      } catch (error) {
        console.error("좋아요 삭제 오류", error);
        toast.error("좋아요 취소에 실패했습니다.");
      }
    }
  };

  return (
    <main
      className={clsx(
        "max-w-1200 w-full mx-auto",
        "flex flex-col gap-80",
        "px-16 sm:px-24"
      )}
    >
      {/* 게시글 영역 */}
      <section className={clsx("flex flex-col gap-16 py-24")}>
        {/* 게시글 제목 영역 */}
        <ArticleHeader
          article={article}
          commentCount={commentCount}
          currentUserId={userId}
          likeCount={likeCount}
          isLike={isLike}
          toggleLike={handleLikeClick}
        />
        {/* 게시글 본문 영역 */}
        <div className={clsx("text-text-secondary text-base", "break-all")}>
          {article.content}
        </div>
        {/* 게시글 이미지 영역 */}
        {article.image && (
          <div className="mt-24">
            <ArticleImage image={article.image} size="large" />
          </div>
        )}
      </section>
      {/* 게시글 좋아요 클릭 영역 */}
      <ArticleLike onLikeClick={handleLikeClick} isLike={isLike} />
      {/* 댓글 영역 */}
      <CommentSection
        articleId={article.id}
        comments={comments}
        onCommentAdd={() => setCommentCount((prev) => prev + 1)}
        onCommentDelete={() => setCommentCount((prev) => prev - 1)}
      />
    </main>
  );
}

export default ArticleClient;
