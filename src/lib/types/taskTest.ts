import { FrequencyType } from "@/types/schemas";
import { TaskRecurringCreateDto } from "./task";

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
  writer: Array<{
    image: string | null;
    nickname: string;
    id: number;
  }>;
  doneBy?: Array<{
    user: {
      image: string;
      nickname: string;
      id: number;
    };
  }>;
}

// (POST body 분기 타입 정확하게)
export type CreateTaskRequestBody =
  | TaskRecurringCreateDto["MonthlyRecurringCreateBody"]
  | TaskRecurringCreateDto["WeeklyRecurringCreateBody"]
  | TaskRecurringCreateDto["DailyRecurringCreateBody"]
  | TaskRecurringCreateDto["OnceRecurringCreateBody"];

// PATCH 응답
export interface TaskPatchResponse {
  displayIndex: number;
  writerId: number;
  userId: number;
  deletedAt?: string;
  frequency: FrequencyType;
  description?: string;
  name: string;
  recurringId: number;
  updatedAt: string;
  doneAt?: string;
  date: string;
  id: number;
}

export interface UpdateTaskRequestBody {
  name?: string;
  description?: string;
  done?: boolean;
}
