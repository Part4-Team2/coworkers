import { Task } from "@/types/task";

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

export const MOCK_TASKS: Task[] = [
  {
    id: "1",
    tabId: "2",
    content: "법인 설립 안내 드리기",
    writer: { nickname: "안해나", userId: "1" },
    isToggle: true,
    commentCount: 3,
    frequency: "DAILY",
    date: "2026-01-01T11:02:32.192Z",
    createdAt: "2026-01-01T11:02:32.192Z",
    doneAt: "2026-01-06T05:31:45.389Z",
    description:
      "필수 정보 10분 입력하면 3일 안에 법인 설립이 완료되는 법인 설립 서비스의 장점에 대해 상세하게 설명드리기",
  },
  {
    id: "2",
    tabId: "2",
    content: "법인 설립 혹은 변경 등기 비용 안내 드리기",
    isToggle: false,
    commentCount: 3,
    frequency: "DAILY",
    date: "2026-01-01T11:02:32.192Z",
  },
  {
    id: "3",
    tabId: "2",
    content: "입력해주신 정보를 바탕으로 등기신청서 제출하기",
    isToggle: false,
    commentCount: 3,
    frequency: "DAILY",
    date: "2026-01-01T11:02:32.192Z",
  },
  {
    id: "4",
    tabId: "1",
    content: "고객 정보에 따라 커스텀 정관 제공하기",
    writer: { nickname: "안해나", userId: "1" },
    isToggle: true,
    commentCount: 3,
    frequency: "DAILY",
    date: "2026-01-01T11:02:32.192Z",
    doneAt: "2026-01-05T05:31:45.389Z",
  },
  {
    id: "5",
    tabId: "1",
    content: "법인 인감도장, 등기서류, 인감증명서 발급하기",
    writer: { nickname: "안해나", userId: "1" },
    isToggle: true,
    commentCount: 3,
    frequency: "DAILY",
    date: "2026-01-01T11:02:32.192Z",
    doneAt: "2026-01-05T05:31:45.389Z",
  },
];
