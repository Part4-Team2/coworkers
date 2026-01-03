import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import TabContainer from "@/components/Tasklist/Tab/TabContainer";
import ListAddButtonContainer from "@/containers/tasklist/ListAddButtonContainer";
import TaskAddButtonContainer from "@/containers/tasklist/TaskAddButtonContainer";

const tabsMock = [
  {
    id: "1",
    title: "법인 설립",
    content: <div>법인 설립 탭 내용</div>,
  },
  {
    id: "2",
    title: "법인 등록",
    content: <div>법인 등록 탭 내용</div>,
  },
  {
    id: "3",
    title: "정기 주총",
    content: <div>정기 주총 탭 내용</div>,
  },
  {
    id: "4",
    title: "기타",
    content: <div>기타 탭 내용</div>,
  },
];

export default function TaskListPage() {
  return (
    <div className="relative max-w-[1200px] mx-auto my-0 sm: px-24">
      <div className="flex flex-col gap-24">
        <div className="text-xl font-bold mt-40">할 일</div>
        <div className="flex justify-between">
          <div className="flex gap-12 items-center">
            <div className="text-lg font-medium">5월 18일 (월)</div>
            <div className="flex gap-4">
              <SVGIcon icon="btnArrowLeft" size="xxs" />
              <SVGIcon icon="btnArrowRight" size="xxs" />
            </div>
            <SVGIcon icon="btnCalendar" size="md" />
          </div>
          <ListAddButtonContainer />
        </div>
        <TabContainer tabs={tabsMock} defaultActiveId="2" />
      </div>
      <div className="fixed bottom-50 right-50 z-50 right-[max(1.5rem,calc(50%-600px+1.5rem))]">
        <TaskAddButtonContainer />
      </div>
    </div>
  );
}
