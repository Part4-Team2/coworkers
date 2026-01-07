import TaskDetailsContainer from "@/containers/tasklist/tasks/TaskDetailsContainer";
import { MOCK_TASKS } from "@/mocks/task";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ taskid: string }>;
};

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

export default async function TaskDetailsPage({ params }: Props) {
  const { taskid } = await params;

  const task = MOCK_TASKS.find((t) => t.id === taskid);

  if (!task) {
    notFound();
  }
  return <TaskDetailsContainer task={task} />;
}
