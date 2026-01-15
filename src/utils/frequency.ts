import { enumToFrequency } from "@/constants/frequency";

export const getFrequencyText = (freq?: string) =>
  enumToFrequency[freq as keyof typeof enumToFrequency] ?? "-";
