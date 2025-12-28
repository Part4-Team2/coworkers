import { useState } from "react";
import Input from "@/app/components/Input/Input";
import Modal from "@/app/components/Modal/Modal";
import Dropdown from "@/app/components/Dropdown/Dropdown";
import InputBox from "@/app/components/Input/InputBox";

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskCreateModal({
  isOpen,
  onClose,
}: TaskCreateModalProps) {
  // list 컴포넌트 frequency 타입 재사용 가능한지 확인
  const FREQ_OPTION: string[] = ["한 번", "매일", "주 반복", "월 반복"];

  const [taskTitle, setTaskTitle] = useState("");
  const [dropdownOption, setDropdownOption] = useState(FREQ_OPTION[0]);
  const [taskMemo, setTaskMemo] = useState("");

  const handleCreateButton = () => {
    // 할일 생성 로직(api 연동) 추후 추가
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="할 일 만들기"
      description={[
        "할 일은 실제로 행동 가능한 작업 중심으로",
        "작성해주시면 좋습니다.",
      ]}
      primaryButton={{
        label: "만들기",
        onClick: handleCreateButton,
      }}
    >
      {/* 커스텀 콘텐츠 영역 */}
      <form className="flex flex-col gap-24">
        <section>
          {/* input 컴포넌트 라벨 관련 의견조율 후 수정할 것 */}
          <h3 className="text-lg font-medium text-text-primary mb-16">
            할 일 제목
          </h3>
          <Input
            label="할 일 제목"
            placeholder="할 일 제목을 입력해주세요."
            variant="default"
            size="large"
            type="text"
            value={taskTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTaskTitle(e.target.value)
            }
          />
        </section>
        <section>
          <h3 className="text-lg font-medium text-text-primary mb-16">
            시작 날짜 및 시간
          </h3>
          <div className="flex gap-8">
            <div className="flex-[2] min-w-0">
              <Input
                label="시작 날짜"
                labelClassName="sr-only"
                placeholder="시작 날짜(생성 날짜 기본값)"
              />
            </div>
            <div className="flex-[1] min-w-0">
              <Input
                label="시작 시간"
                labelClassName="sr-only"
                placeholder="시작 시간(오전 9:00 기본값)"
              />
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-lg font-medium text-text-primary mb-16">
            반복 설정
          </h3>
          <Dropdown
            options={FREQ_OPTION}
            onSelect={setDropdownOption}
            size="md"
            value={dropdownOption}
          />
        </section>
        <section>
          <h3 className="text-lg font-medium text-text-primary mb-16">
            할 일 메모
          </h3>
          <InputBox
            placeholder="메모를 입력해주세요."
            value={taskMemo}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setTaskMemo(e.target.value)
            }
          />
        </section>
      </form>
    </Modal>
  );
}
