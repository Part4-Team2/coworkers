import { FrequencyType } from "./schemas";

// 리스트용 Task (목록 조회 API 응답)
export interface TaskListItem {
  id: number;
  name: string;
  description?: string;
  commentCount: number;
  frequency: FrequencyType;
  date: string;
  doneAt?: string;
  displayIndex: number;
  recurringId: number;
}

// 상세 화면 Task
export interface TaskDetail extends TaskListItem {
  updatedAt: string;
  deletedAt?: string;
  writer: {
    image: string | null;
    nickname: string;
    id: number;
  };
  doneBy?: Array<{
    user: {
      image: string;
      nickname: string;
      id: number;
    };
  }>;
  weekDays?: number[];
  monthDay?: number;
}
