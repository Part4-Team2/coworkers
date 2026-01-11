// api response 확인 이후 타입이 변경될 수 있습니다.

export interface Task {
  id: number;
  name: string;
  commentCount?: number;
  date?: string;
  deletedAt?: string | null;
  description?: string;
  displayIndex?: number;
  doneAt?: string | null;
  doneBy?: {
    id: number;
    nickname: string;
    image: string | null;
  } | null;
  // TODO: 전체 api 명세가 안정된 후 "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY"로 좁힘
  frequency?: string;
  recurringId?: number;
  updatedAt?: string;
  user?: {
    id: number;
    nickname: string;
    image: string | null;
  } | null;
  writer?: {
    id: number;
    nickname: string;
    image: string | null;
  };
}
