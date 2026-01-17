"use server";

import { revalidatePath } from "next/cache";
import { BASE_URL } from "@/lib/api";
import { Article, GetArticles, CreateArticle } from "@/types/article";
import {
  GetArticleComments,
  CreateArticleComment,
  ArticleComment,
} from "@/types/articleComment";
import { fetchApi } from "@/utils/api";
import { REVALIDATE_TIME } from "@/constants/revalidate";
import { ApiResult } from "@/lib/types/api";

interface GetArticlesProps {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  keyword?: string;
}

interface GetArticleProps {
  articleId: number;
}

interface GetArticleCommentsProps {
  articleId: number;
  limit: number;
  cursor?: number;
}

export async function getArticles({
  page = 1,
  pageSize = 6,
  orderBy = "recent",
  keyword,
}: GetArticlesProps): Promise<ApiResult<GetArticles>> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      orderBy,
    });
    if (keyword) params.set("keyword", keyword);

    const response = await fetchApi(`${BASE_URL}/articles?${params}`, {
      next: { revalidate: REVALIDATE_TIME.ARTICLE },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "게시글을 불러오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "게시글을 불러오는데 실패했습니다.",
      };
    }

    const data = (await response.json()) as GetArticles;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 특정 게시글 페이지에 들어갔을 때 게시글 내용을 불러오는 함수
export async function getArticle({
  articleId,
}: GetArticleProps): Promise<ApiResult<Article>> {
  try {
    const response = await fetchApi(`${BASE_URL}/articles/${articleId}`, {
      method: "GET",
      next: { revalidate: REVALIDATE_TIME.ARTICLE },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "게시글을 불러오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "게시글을 불러오는데 실패했습니다.",
      };
    }

    const data = (await response.json()) as Article;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 게시글 작성
export async function postArticle(
  data: CreateArticle
): Promise<ApiResult<Article>> {
  try {
    const response = await fetchApi(`${BASE_URL}/articles`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "게시글 작성에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "게시글 작성에 실패했습니다.",
      };
    }

    const result = (await response.json()) as Article;
    revalidatePath("/boards");
    return { success: true, data: result };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 게시글 수정
export async function patchArticle(
  articleId: number,
  data: CreateArticle
): Promise<ApiResult<Article>> {
  try {
    const response = await fetchApi(`${BASE_URL}/articles/${articleId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "게시글 수정에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "게시글 수정에 실패했습니다.",
      };
    }

    const result = (await response.json()) as Article;
    revalidatePath("/boards");
    revalidatePath(`/boards/${articleId}`);
    return { success: true, data: result };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 게시글 삭제
export async function deleteArticle(
  articleId: number
): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(`${BASE_URL}/articles/${articleId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "게시글 삭제에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "게시글 삭제에 실패했습니다.",
      };
    }

    revalidatePath("/boards");
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 게시글 댓글 불러오기
export async function getArticleComments({
  articleId,
  limit,
  cursor,
}: GetArticleCommentsProps): Promise<ApiResult<GetArticleComments>> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set("cursor", String(cursor));

    const response = await fetchApi(
      `${BASE_URL}/articles/${articleId}/comments?${params}`,
      {
        next: { revalidate: REVALIDATE_TIME.ARTICLE_COMMENT },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "댓글을 불러오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "댓글을 불러오는데 실패했습니다.",
      };
    }

    const data = (await response.json()) as GetArticleComments;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 댓글 작성
export async function postComment(
  articleId: number,
  data: CreateArticleComment
): Promise<ApiResult<ArticleComment>> {
  try {
    const response = await fetchApi(
      `${BASE_URL}/articles/${articleId}/comments`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "댓글 작성에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "댓글 작성에 실패했습니다.",
      };
    }

    const result = (await response.json()) as ArticleComment;
    revalidatePath(`/boards/${articleId}`);
    return { success: true, data: result };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 댓글 삭제
export async function deleteComment(
  commentId: number
): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(`${BASE_URL}/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "댓글 삭제에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "댓글 삭제에 실패했습니다.",
      };
    }

    revalidatePath("/boards");
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 게시글 좋아요
export async function postLike(articleId: number): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(`${BASE_URL}/articles/${articleId}/like`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "좋아요 추가에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "좋아요 추가에 실패했습니다.",
      };
    }

    revalidatePath(`/boards/${articleId}`);
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}

// 게시글 좋아요 취소
export async function deleteLike(articleId: number): Promise<ApiResult<void>> {
  try {
    const response = await fetchApi(`${BASE_URL}/articles/${articleId}/like`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "좋아요 취소에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "좋아요 취소에 실패했습니다.",
      };
    }

    revalidatePath(`/boards/${articleId}`);
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "서버 오류가 발생했습니다.",
    };
  }
}
