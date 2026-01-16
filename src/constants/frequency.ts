import { FrequencyType } from "@/types/schemas";

export const frequencyToEnum = {
  ["한 번"]: FrequencyType.ONCE,
  ["매일"]: FrequencyType.DAILY,
  ["주 반복"]: FrequencyType.WEEKLY,
  ["월 반복"]: FrequencyType.MONTHLY,
} as const;

export const enumToFrequency = {
  [FrequencyType.ONCE]: "한 번",
  [FrequencyType.DAILY]: "매일",
  [FrequencyType.WEEKLY]: "주 반복",
  [FrequencyType.MONTHLY]: "월 반복",
} as const;
