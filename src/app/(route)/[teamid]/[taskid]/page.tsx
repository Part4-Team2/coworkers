import TaskDetailsContainer from "@/containers/tasklist/tasks/TaskDetailsContainer";
import { Metadata } from "next";

// 추후 동적 메타태그로 변경
export const metadata: Metadata = {
  title: "{taskTitle} 상세 보기",
  description: "'{taskTitle}' 에 대한 내용을 상세하게 볼 수 있는 페이지입니다.",
  openGraph: {
    title: "{taskTitle} 상세 보기",
    description:
      "'{taskTitle}' 에 대한 내용을 상세하게 볼 수 있는 페이지입니다.",
  },
};

// API로 데이터 불러올 예정

export default function TaskDetailsPage() {
  return <TaskDetailsContainer />;
}
