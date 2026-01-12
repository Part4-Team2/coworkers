import clsx from "clsx";
import ArticleClient from "@/components/Boards/ArticleClient";
import { notFound } from "next/navigation";
import { getArticleComments, getArticle } from "@/api/boards";

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
    <div className={clsx("min-h-screen bg-background-primary")}>
      {/* Content Wrapper */}
      <ArticleClient article={article} comments={comments} />
    </div>
  );
}

export default ArticlePage;
