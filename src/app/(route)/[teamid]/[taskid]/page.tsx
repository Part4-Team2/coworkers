import TaskDetailsContainer from "@/containers/tasklist/tasks/TaskDetailsContainer";
import { MOCK_TASKS } from "@/mocks/task";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ taskid?: string }>;
};

// 쿼리 스트링방식이 아닌 페이지에 직접 들어갔을 때(/[teamid]/[taskid])만 확인 가능
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskid } = await params;
  const task = MOCK_TASKS.find((t) => t.id === taskid);

  if (!task) {
    return {
      title: "할 일을 찾을 수 없습니다.",
    };
  }

  return {
    title: `${task.content} 상세 보기`,
    description: `'${task.content}' 에 대한 내용을 상세하게 볼 수 있는 페이지입니다.`,
    openGraph: {
      title: `${task.content} 상세 보기`,
      description: `'${task.content}' 에 대한 내용을 상세하게 볼 수 있는 페이지입니다.`,
    },
  };
}

// API로 데이터 불러올 예정

export default async function TaskDetailsPage({ params }: Props) {
  const { taskid } = await params;

  const task = MOCK_TASKS.find((t) => t.id === taskid);

  if (!task) {
    notFound();
  }
  return <TaskDetailsContainer task={task} />;
}
