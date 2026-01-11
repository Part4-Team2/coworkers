// api response 확인 이후 타입이 변경될 수 있습니다.

export interface Article {
  updatedAt: string;
  createdAt: string;
  likeCount: number;
  writer: {
    nickname: string;
    id: number;
  };
  image?: string;
  title: string;
  id: number;
  commentCount: number;
  isLiked: boolean;
  content: string;
}

export interface GetArticles {
  totalCount: number;
  list: Article[];
}

export interface CreateArticle {
  image?: string | null;
  content: string;
  title: string;
}
