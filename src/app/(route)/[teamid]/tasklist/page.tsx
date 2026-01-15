import { getGroup } from "@/lib/api/group";
import TabContainer from "@/components/Tasklist/Tab/TabContainer";
import ConditionalTaskAddButton from "@/containers/tasklist/ConditionalTaskAddButton";
import DateNavigatorContainer from "@/containers/tasklist/DateNavigatorContainer";
import ListAddButtonContainer from "@/containers/tasklist/ListAddButtonContainer";
import TaskListContainer from "@/containers/tasklist/TaskListContainer";
import { Metadata } from "next";

type TaskListPageProps = {
  params: Promise<{ teamid: string }>;
  searchParams: Promise<{ tab?: string; date?: string }>;
};

interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

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

  // 리스트 페이지 헤더 날짜
  const baseDate = date ?? new Date().toISOString();

  // 모든 할일 목록 가져오기 (법인 설립, 법인 등기 등)
  const taskListsResponse = await getGroup(groupId);

  // 에러 났을 때 UI (TODO: 해당 사항에 대해 팀 컨벤션 정하기)
  if (!taskListsResponse || "error" in taskListsResponse) {
    return (
      <div className="p-24">
        <h1 className="text-xl font-bold text-red-500">데이터 로드 실패</h1>
        <p>
          {taskListsResponse?.error ||
            "할 일 목록 및 정보를 불러올 수 없습니다."}
        </p>
      </div>
    );
  }

  // 목록이 있을 때, 목록의 할 일 리스트 가져오기
  const taskLists = taskListsResponse.data.taskLists;

  if (taskLists.length === 0) {
    return (
      <div className="p-24">
        <p className="text-text-default text-center">
          아직 할 일 목록이 없습니다. 새로운 목록을 추가해주세요.
        </p>
      </div>
    );
  }

  // 현재 선택된 탭 결정 + 어떤 content에 tasks를 넣을지 결정(데이터)
  // (쿼리스트링 tab 값에 맞는 탭(이전 페이지에서 클릭한 데이터랑 연결) ?? api taskLists값의 내 첫번째 데이터
  const activeTabId = tab ?? taskLists[0].id.toString();

  // 활성 탭에만 데이터 전달
  const tabs: TabItem[] = taskLists.map((list) => ({
    id: list.id.toString(),
    title: list.name,
    content: (
      <TaskListContainer
        groupId={Number(groupId)}
        listId={list.id.toString()}
        baseDate={baseDate}
      />
    ),
  }));

  return (
    <div className="relative max-w-[1200px] mx-auto my-0 sm:px-24 px-16 mb-80">
      <div className="flex flex-col gap-24">
        <div className="text-xl font-bold mt-40">할 일</div>

        <div className="flex justify-between">
          <DateNavigatorContainer baseDate={baseDate} />
          <ListAddButtonContainer groupId={groupId} />
        </div>
        {/* defaultActiveId={activeTabId} 는 수정될 수 있음 */}
        <TabContainer tab={tabs} defaultActiveId={activeTabId} />
      </div>
      <ConditionalTaskAddButton groupId={groupId} taskListId={activeTabId} />
    </div>
  );
}
