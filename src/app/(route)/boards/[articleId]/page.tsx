import clsx from "clsx";
import ArticleClient from "@/components/Boards/ArticleClient";
import { notFound } from "next/navigation";
import { getArticleComments, getArticle } from "@/lib/api/boards";

// UX 요구 때문에 임시로 100개 갖고오게 설정, 추후에 댓글이 많아지면 무한 스크롤로 쉽게 바꾸기 위해 열어둔 상태입니다.
const COMMENT_LIMIT = 100;

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
      // 지금 UX 요구 때문에 임시로 100개 갖고오게 설정, 추후에 댓글이 많아지면 무한 스크롤로 쉽게 바꾸기 위해 열어둔 상태입니다.
      getArticleComments({ articleId: id, limit: COMMENT_LIMIT }),
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
