import { useState } from "react";
import Input from "@/components/Common/Input/Input";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import InputBox from "@/components/Common/Input/InputBox";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@/components/Common/Button/Button";
import { BaseModal } from "@/components/Common/Modal";
import ModalHeader from "@/components/Common/Modal/ModalHeader";
import ModalFooter from "@/components/Common/Modal/ModalFooter";

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREQ_OPTION: string[] = ["한 번", "매일", "주 반복", "월 반복"];

const today = new Date();
const defaultTime = new Date();
defaultTime.setHours(15, 0, 0, 0); // fix

export default function TaskCreateModal({
  isOpen,
  onClose,
}: TaskCreateModalProps) {
  // list 컴포넌트 frequency 타입 재사용 가능한지 확인

  const [taskTitle, setTaskTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>(today);
  const [isDateTouched, setIsDateTouched] = useState(false);
  const [startTime, setStartTime] = useState<Date>(defaultTime);
  const [isTimeTouched, setIsTimeTouched] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dropdownOption, setDropdownOption] = useState(FREQ_OPTION[0]);
  const [taskMemo, setTaskMemo] = useState("");
  // const selectedStartDate = useMemo(() => isDateTouched ? format(startDate) : "",[startDate, isDateTouched])
  // 리스트에서 쓰는 로직이랑 비교
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCreateButton = () => {
    // 할일 생성 로직(api 연동) 추후 추가
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="px-16 py-32">
      <ModalHeader title="할 일 만들기" />
      <div className="text-center text-text-default text-md font-medium pt-16 pb-24">
        할 일은 실제로 행동 가능한 작업 중심으로 <br /> 작성해주시면 좋습니다.
      </div>

      {/* 커스텀 콘텐츠 영역 */}
      <div className="h-[400px] overflow-y-auto custom-scrollbar">
        <form className="flex flex-col gap-24 mb-32 mr-12">
          <section>
            <Input
              label="할 일 제목"
              labelClassName="text-lg font-medium text-text-primary mb-16"
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
              <div className="flex-[2] min-w-0 relative">
                <Input
                  label="시작 날짜"
                  labelClassName="sr-only"
                  placeholder={formatDate(today)}
                  readOnly
                  value={isDateTouched ? formatDate(startDate) : ""}
                  onClick={() => {
                    setShowDatePicker(!showDatePicker);
                    setShowTimePicker(false);
                  }}
                  className="cursor-pointer"
                />

                {showDatePicker && (
                  <div className="absolute top-full mt-8 z-50">
                    <div className="bg-background-secondary rounded-xl p-16 border-1 border-interaction-hover">
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => {
                          if (!date) return;
                          setStartDate(date);
                          setIsDateTouched(true);
                          setShowDatePicker(false);
                        }}
                        inline
                        formatWeekDay={(day) => day.substring(0, 3)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-[1] min-w-0 relative">
                <Input
                  label="시작 시간"
                  labelClassName="sr-only"
                  placeholder="오후 3:00"
                  readOnly
                  value={isTimeTouched ? formatTime(startTime) : ""}
                  onClick={() => {
                    setShowTimePicker(!showTimePicker);
                    setShowDatePicker(false);
                  }}
                  className="cursor-pointer"
                />

                {showTimePicker && (
                  <div className="absolute top-full mt-8 right-0 z-50">
                    <div className="flex gap-14 bg-background-secondary rounded-xl p-16 border-1 border-interaction-hover">
                      <div className="flex flex-col gap-8">
                        <Button
                          label="오전"
                          width="78px"
                          variant={
                            startTime.getHours() < 12 ? "solid" : "unselected"
                          }
                          onClick={() => {
                            const newTime = new Date(startTime);
                            if (newTime.getHours() >= 12) {
                              newTime.setHours(newTime.getHours() - 12);
                            }
                            setStartTime(newTime);
                            setIsTimeTouched(true);
                          }}
                        />
                        <Button
                          label="오후"
                          width="78px"
                          variant={
                            startTime.getHours() >= 12 ? "solid" : "unselected"
                          }
                          onClick={() => {
                            const newTime = new Date(startTime);
                            if (newTime.getHours() < 12) {
                              newTime.setHours(newTime.getHours() + 12);
                            }
                            setStartTime(newTime);
                            setIsTimeTouched(true);
                          }}
                        />
                      </div>
                      {/* 시간목록 - 커스텀 */}
                      <div className="h-[152px] w-[220px] rounded-xl bg-[#18212f] overflow-y-auto custom-scrollbar pr-2">
                        {Array.from({ length: 24 }, (_, i) => [i, i + 0.5])
                          .flat()
                          .map((hour) => {
                            const hours = Math.floor(hour);
                            const minutes = (hour % 1) * 60;

                            // 현재 오전/오후에 맞는 시간만 표시
                            const isAM = startTime.getHours() < 12;
                            const timeIsAM = hours < 12;
                            if (isAM !== timeIsAM) return null;

                            const displayHours = hours % 12 || 12;
                            const displayMinutes = minutes
                              .toString()
                              .padStart(2, "0");

                            const isSelected =
                              startTime &&
                              startTime.getHours() === hours &&
                              startTime.getMinutes() === minutes;

                            return (
                              <button
                                key={`${hours}-${minutes}`}
                                type="button"
                                onClick={() => {
                                  const newTime = new Date(startTime);
                                  newTime.setHours(hours, minutes, 0, 0);
                                  setStartTime(newTime);
                                  setIsTimeTouched(true);
                                  setShowTimePicker(false);
                                }}
                                className={clsx(
                                  "w-full text-left pl-16 py-10 rounded-lg",
                                  isSelected
                                    ? "bg-interaction-primary text-brand-primary"
                                    : "text-text-default hover:bg-interaction-hover"
                                )}
                              >
                                {displayHours}:{displayMinutes}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
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
              trigger="text"
              size="md"
              value={dropdownOption}
            />
          </section>
          <section>
            <InputBox
              label="할 일 메모"
              labelClassName="text-lg font-medium text-text-primary mb-16"
              placeholder="메모를 입력해주세요."
              value={taskMemo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTaskMemo(e.target.value)
              }
            />
          </section>
        </form>
      </div>
      <ModalFooter
        primaryButton={{ label: "만들기", onClick: handleCreateButton }}
      />
    </BaseModal>
  );
}
