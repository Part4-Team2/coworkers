import clsx from "clsx";
import ArticleClient from "@/components/Boards/ArticleClient";
import { notFound } from "next/navigation";
import { getArticleComments, getArticle } from "@/lib/api/boards";

const COMMENT_LIMIT = 3;

async function ArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  const id = Number(articleId);

  if (Number.isNaN(id)) notFound();

  const [articleResult, commentsResult] = await Promise.all([
    getArticle({ articleId: id }),
    getArticleComments({ articleId: id, limit: COMMENT_LIMIT }),
  ]).catch(() => {
    notFound();
  });

  if (!articleResult?.success || !commentsResult?.success) {
    console.log("게시글 불러오기 실패");
    notFound();
  }

  const article = articleResult.data;
  const comments = commentsResult.data;

  return (
    // Page Wrapper
    <div className={clsx("min-h-screen bg-background-primary")}>
      {/* Content Wrapper */}
      <ArticleClient article={article} comments={comments} />
    </div>
  );
}

export default ArticlePage;
