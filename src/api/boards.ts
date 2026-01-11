import { BASE_URL } from "@/constants/api";
import {
  GetArticleComments,
  CreateArticleComment,
} from "@/types/articleComment";
import { Article, GetArticles, CreateArticle } from "@/types/article";

// 자유게시판 페이지에 쓰이는 props입니다.
interface GetArticlesProps {
  page?: number; // 페이지 번호
  pageSize?: number; // 페이지 당 게시글 수
  orderBy?: string; // 게시글 정렬 기준
  keyword?: string; // 검색 키워드
}

// 게시글 클릭했을 때 필요한 props입니다.
interface GetArticleProps {
  articleId: number; // 게시글 고유 번호
}

// 게시글 클릭했을 때 댓글이 있는지 필요한 props입니다.
interface GetArticleCommentsProps {
  articleId: number;
  limit: number;
  cursor?: number;
}

// 게시글(들)을 불러오는 함수입니다.
export async function getArticles({
  page = 1,
  pageSize = 6,
  orderBy = "recent",
  keyword,
}: GetArticlesProps): Promise<GetArticles> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    orderBy,
  });

  if (keyword) {
    params.set("keyword", keyword);
  }

  const query = params.toString();
  const response = await fetch(`${BASE_URL}/articles?${query}`);
  return response.json();
}

// 특정 게시글 페이지에 들어갔을 때 게시글 내용을 불러오는 함수입니다.
export async function getArticle({
  articleId,
}: GetArticleProps): Promise<Article> {
  const response = await fetch(`${BASE_URL}/articles/${articleId}`);
  return response.json();
}

// 게시글 버튼을 눌렀을 때 작동하는 함수입니다.
export async function postArticle(data: CreateArticle) {
  const response = await fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("게시글 올리기 오류");

  return response.json();
}

// export async function patchPostArticle(){}

// 게시글 삭제하는 함수입니다.
export async function deletePostArticle(articleId: number) {
  const response = await fetch(`${BASE_URL}/articles/${articleId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("게시글 삭제 오류.");

  return response.json();
}

// 특정 게시글 페이지에 들어갔을 때 게시글 댓글을 불러오는 함수입니다.
export async function getArticleComments({
  articleId,
  limit = 3,
  cursor,
}: GetArticleCommentsProps): Promise<GetArticleComments> {
  const params = new URLSearchParams({
    limit: String(limit),
  });

  if (cursor) params.set("cursor", String(cursor));

  const response = await fetch(
    `${BASE_URL}/articles/${articleId}/comments?${params}`
  );
  return response.json();
}

// 특정 게시글 페이지에 댓글을 작성하고 올릴 때 작동하는 함수입니다.
export async function postComment(
  articleId: number,
  data: CreateArticleComment
) {
  const response = await fetch(`${BASE_URL}/articles/${articleId}/comments`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("댓글 올리기 오류");

  return response.json();
}

// export async function patchComment () {}

// 댓글을 삭제하는 함수입니다.
export async function deleteComment(commentId: number) {
  const response = await fetch(`${BASE_URL}/comment/${commentId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("댓글 삭제 오류");

  return response.json();
}
