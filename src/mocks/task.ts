export const mockComment = [
  {
    id: "1",
    content: "법인 설립 서비스 관련 링크 첨부 드려요 https://www.codeit.kr",
    userName: "우지은",
    createdAt: "20분 전", // 시간 포맷팅 2026-01-03T16:26:39.888Z
  },
  {
    id: "2",
    content: "",
  },
];

export const mockTask = {
  title: "법인 설립 비용 안내 드리기",
  writer: { nickname: "안해나" },
  description:
    "필수 정보 10분 입력하면 3일 안에 법인 설립이 완료되는 법인 설립 서비스의 장점에 대해 상세하게 설명드리기",
  createdAt: "2025.05.30",
  date: "2024년 7월 29일",
  // api 설정 이후 time 삭제, date로 time까지 렌더링할 수 있도록 수정
  time: "오후 3:30",
  frequency: "매일 반복",
};
