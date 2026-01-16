import clsx from "clsx";
import ArticleClient from "@/components/Boards/ArticleClient";
import { notFound } from "next/navigation";
import { getArticleComments, getArticle } from "@/lib/api/boards";

const PAGE_LIMIT = 3;

async function ArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  const id = Number(articleId);

  if (Number.isNaN(id)) notFound();

  let article, comments;

  try {
    [article, comments] = await Promise.all([
      getArticle({ articleId: id }),
      getArticleComments({ articleId: id, limit: PAGE_LIMIT }),
    ]);
  } catch (error) {
    console.log("게시글 불러오기 실패", error);
    notFound();
  }

  return (
    // Page Wrapper
    <div className={clsx("min-h-screen bg-background-primary")}>
      {/* Content Wrapper */}
      <ArticleClient article={article} comments={comments} />
    </div>
  );
}

export default ArticlePage;
