"use server";

import { BASE_URL } from "@/constants/api";
import { Article, GetArticles, CreateArticle } from "@/types/article";
import {
  GetArticleComments,
  CreateArticleComment,
} from "@/types/articleComment";
import { fetchApi } from "@/utils/api";

// 자유게시판 페이지에 쓰이는 props
interface GetArticlesProps {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  keyword?: string;
}

// 게시글 클릭했을 때 필요한 props
interface GetArticleProps {
  articleId: number;
}

// 게시글 클릭했을 때 댓글이 있는지 필요한 props
interface GetArticleCommentsProps {
  articleId: number;
  limit: number;
  cursor?: number;
}

// 게시글(들)을 불러오는 함수
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
  if (keyword) params.set("keyword", keyword);

  const response = await fetchApi(`${BASE_URL}/articles?${params}`);
  return response.json();
}

// 특정 게시글 페이지에 들어갔을 때 게시글 내용을 불러오는 함수
export async function getArticle({
  articleId,
}: GetArticleProps): Promise<Article> {
  console.log(articleId);
  const response = await fetchApi(`${BASE_URL}/articles/${articleId}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("게시글 갖고오기 실패");
  return response.json();
}

// 게시글 작성
export async function postArticle(data: CreateArticle) {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("게시글 올리기 오류");
  return response.json();
}

// 게시글 삭제
export async function deletePostArticle(articleId: number) {
  const response = await fetchApi(`${BASE_URL}/articles/${articleId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("게시글 삭제 오류");
  return response.json();
}

// 게시글 댓글 불러오기
export async function getArticleComments({
  articleId,
  limit = 3,
  cursor,
}: GetArticleCommentsProps): Promise<GetArticleComments> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", String(cursor));

  const response = await fetchApi(
    `${BASE_URL}/articles/${articleId}/comments?${params}`
  );
  return response.json();
}

// 댓글 작성
export async function postComment(
  articleId: number,
  data: CreateArticleComment
) {
  const response = await fetchApi(
    `${BASE_URL}/articles/${articleId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) throw new Error("댓글 올리기 오류");
  return response.json();
}

// 댓글 삭제
export async function deleteComment(commentId: number) {
  const response = await fetchApi(`${BASE_URL}/comment/${commentId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("댓글 삭제 오류");
  return response.json();
}
