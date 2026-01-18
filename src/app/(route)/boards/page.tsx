import { trace } from "@opentelemetry/api";
import { getArticles } from "@/lib/api/boards";
import BoardClient from "./BoardClient";
import { createMetadata } from "@/components/Common/Metadata/Metadata";

export const metadata = createMetadata({
  title: "자유게시판",
  description: "동료들과 자유롭게 이야기를 나눠보세요.",
  url: "/boards",
  alt: "Coworkers - 자유게시판",
});

interface BoardPageProps {
  searchParams: Promise<{
    page?: string;
    orderBy?: string;
    keyword?: string;
  }>;
}

async function BoardPage({ searchParams }: BoardPageProps) {
  const tracer = trace.getTracer("board-page");

  return tracer.startActiveSpan("BoardPage", async (span) => {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const orderBy = params.orderBy || "recent";
    const keyword = params.keyword || "";

    span.setAttribute("page", page);
    span.setAttribute("orderBy", orderBy);
    if (keyword) span.setAttribute("keyword", keyword);

    const startTime = Date.now();
    const result = await getArticles({
      page,
      pageSize: 6,
      orderBy,
      keyword: keyword || undefined,
    });
    const responseTime = Date.now() - startTime;

    span.setAttribute("response.time_ms", responseTime);
    span.setAttribute("cache.hit", responseTime < 10);

    if (result.success) {
      span.setAttribute("articles.count", result.data.list.length);
      span.setAttribute("articles.totalCount", result.data.totalCount);
      console.log(
        `[BoardPage] ${responseTime < 10 ? "🟢 CACHE HIT" : "🔴 CACHE MISS"} - ${responseTime}ms | page=${page}, orderBy=${orderBy}${keyword ? `, keyword=${keyword}` : ""}`
      );
      span.end();
      return <BoardClient initialData={result.data} />;
    } else {
      span.setAttribute("error", true);
      console.error(`[BoardPage] ❌ ERROR - ${result.error}`);
      span.end();
      return <BoardClient />;
    }
  });
}

export default BoardPage;
