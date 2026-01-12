// 임시 적용
export interface Comment {
  id: number;
  content: string;
  user: { id: number; nickname: string; image: string | null };
}
