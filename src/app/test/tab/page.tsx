import TabContainer from "@/components/Tasklist/Tab/TabContainer";

const tabs = [
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

export default function TabTestPage() {
  return (
    <div>
      <TabContainer tabs={tabs} defaultActiveId="2" />
    </div>
  );
}
