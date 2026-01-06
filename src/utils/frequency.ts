export const getFrequencyText = (freq?: string) => {
  const frequencyMap = {
    ONCE: "한 번만",
    DAILY: "매일 반복",
    WEEKLY: "매주 반복",
    MONTHLY: "매월 반복",
  };
  return frequencyMap[freq as keyof typeof frequencyMap] ?? "-";
};
