import clsx from "clsx";
import Avatar from "@/components/Common/Avatar/Avatar";
import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";

import { getArticleComments, getArticle } from "@/api/boards";
import CommentSection from "@/components/Boards/CommentSection";
import ArticleHeader from "@/components/Boards/ArticleHeader";
import { notFound } from "next/navigation";

const PAGE_LIMIT = 3;

async function ArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  const id = Number(articleId);

  if (Number.isNaN(id)) notFound();

  const [article, comments] = await Promise.all([
    getArticle({ articleId: id }),
    getArticleComments({ articleId: id, limit: PAGE_LIMIT }),
  ]);

  return (
    // Page Wrapper
    <div className="min-h-screen bg-background-primary">
      {/* Content Wrapper */}
      <main
        className={clsx(
          "py-56 max-w-1200 w-full mx-auto",
          "flex flex-col gap-80",
          "px-20 lg:px-0"
        )}
      >
        {/* 게시글 영역 */}
        <section className={clsx("flex flex-col gap-16 py-24")}>
          {/* 게시글 제목 영역 */}
          <ArticleHeader title={article.title} />
          <div className="border-b border-b-text-primary/10"></div>
          {/* 작성자, 좋아요/댓글 개수 표시 영역 */}
          <div className={clsx("flex justify-between text-slate-400 text-sm")}>
            {/* 작성자, 게시글 생성일자 */}
            <div className="flex gap-16 items-center">
              <div className="flex gap-12 items-center">
                <Avatar imageUrl={undefined} altText="none" size="large" />
                <span className="text-text-primary">
                  {article?.writer?.nickname}
                </span>
              </div>
              <div className="text-text-primary/10">|</div>
              <div className="text-slate-400">{article.createdAt}</div>
            </div>
            {/* 좋아요/댓글 개수 표시 */}
            <div className="flex gap-16">
              <div className="flex gap-4 items-center">
                <SVGIcon icon="comment" size={14} />
                <span>{article.commentCount}</span>
              </div>
              <div className="flex gap-4 items-center">
                <SVGIcon icon="heart" size={14} />
                <span>
                  {article.likeCount > 9999 ? "9999+" : article.likeCount}
                </span>
              </div>
            </div>
          </div>
          {/* 게시글 본문 영역 */}
          <div className="text-text-secondary text-base">{article.content}</div>
        </section>
        {/* 댓글 영역 */}
        <CommentSection comments={comments.list} />
      </main>
    </div>
  );
}

export default ArticlePage;
