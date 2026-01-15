import { FrequencyType } from "@/types/schemas";
import { TaskDetail, TaskListItem } from "@/types/task";
export interface TaskRecurringCreateDto {
  MonthlyRecurringCreateBody: {
    name: string;
    description?: string;
    startDate: string;
    frequencyType: string; // [MONTHLY]
    monthDay: number;
  };
  WeeklyRecurringCreateBody: {
    name: string;
    description?: string;
    startDate: string;
    frequencyType: string; // [WEEKLY]
    weekDays: number[];
  };
  DailyRecurringCreateBody: {
    name: string;
    description?: string;
    startDate: string;
    frequencyType: string; // [DAILY]
  };
  OnceRecurringCreateBody: {
    name: string;
    description?: string;
    startDate: string;
    frequencyType: string; // [ONCE]
  };
}

// (POST body 분기 타입 정확하게)
export type CreateTaskRequestBody =
  | TaskRecurringCreateDto["MonthlyRecurringCreateBody"]
  | TaskRecurringCreateDto["WeeklyRecurringCreateBody"]
  | TaskRecurringCreateDto["DailyRecurringCreateBody"]
  | TaskRecurringCreateDto["OnceRecurringCreateBody"];

export interface TaskCreateResponse {
  recurring: TaskDetail;
}

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

export type TaskDeletePayload = Pick<TaskListItem, "id" | "recurringId">;
