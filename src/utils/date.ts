export const formatDate = (isoDate: string) => {
  const dateObj = new Date(isoDate);
  return dateObj.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  });
};

export const formatTime = (isoDate: string) => {
  const dateObj = new Date(isoDate);
  return dateObj.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Seoul",
  });
};

/**
 * 로컬 타임존 기준 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
