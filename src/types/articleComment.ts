// api response 확인 이후 타입이 변경될 수 있습니다.

export interface ArticleComment {
  writer: {
    image?: string;
    nickname: string;
    id: number;
  };
  updatedAt: string;
  createdAt: string;
  content: string;
  id: number;
}

export interface GetArticleComments {
  nextCursor: number;
  list: ArticleComment[];
}

export interface CreateArticleComment {
  content: string;
}
