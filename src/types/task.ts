// api response 확인 이후 타입이 변경될 수 있습니다.

export interface Task {
  id: string;
  isToggle?: boolean;
  onToggle?: (id: string) => void;
  content: string;
  onClickKebab?: (id: string) => void;
  variant?: "simple" | "detailed";
  // Metadata (tasklist 페이지용)
  commentCount?: number;
  frequency?: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  date?: string; // 시간 포함
  tabId?: string;
  writer?: { nickname: string; userId: "1" };
  createdAt?: string;
  doneAt?: string;
  description?: string;
}
