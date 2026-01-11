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

export const formatListHeaderDate = (isoDate: string) => {
  const dateObj = new Date(isoDate);
  return dateObj.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Seoul",
  });
};
