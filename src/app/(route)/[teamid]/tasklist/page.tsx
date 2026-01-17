import TaskListPageContainer from "@/containers/tasklist/TaskListContainer";
import { getGroup } from "@/lib/api/group";
import { Metadata } from "next";

type TaskListPageProps = {
  params: Promise<{ teamid: string }>;
  searchParams: Promise<{ tab: string; date?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ teamid: string }>;
}): Promise<Metadata> {
  const { teamid: groupId } = await params;

  const taskListsResponse = await getGroup(groupId);
  const teamName = taskListsResponse.success ? taskListsResponse.data.name : "";

  return {
    title: `${teamName}팀의 할 일 리스트`,
    description: `${teamName}팀의 할 일 리스트를 확인할 수 있는 페이지입니다.`,
    openGraph: {
      title: `${teamName}팀의 할 일 리스트`,
      description: `${teamName}팀의 할 일 리스트를 확인할 수 있는 페이지입니다.`,
    },
  };
}

export default async function TaskListPage({
  params,
  searchParams,
}: TaskListPageProps) {
  const { teamid: groupId } = await params;
  const { date, tab } = await searchParams;
  return (
    <>
      <TaskListPageContainer
        groupId={groupId}
        selectedTaskListId={tab}
        selectedDate={date}
      />
    </>
  );
}
