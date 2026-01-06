import DoneListContainer from "@/containers/myhistory/DoneListContainer";

export default function MyHisoryPage() {
  return (
    <>
      <h1 className="text-xl font-bold mb-24">마이 히스토리</h1>

      <div>
        <DoneListContainer />
      </div>
    </>
  );
}
