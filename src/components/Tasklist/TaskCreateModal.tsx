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
import { formatDate, formatTime } from "@/utils/date";
import { frequencyToEnum } from "@/constants/frequency";
import { FrequencyType } from "@/types/schemas";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { postTasks } from "@/lib/api/task";
import { getFrequencyText } from "@/utils/frequency";
import { CreateTaskRequestBody } from "@/lib/types/taskTest";

interface TaskCreateModalProps {
  groupId: string;
  taskListId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

interface CreateTaskForm {
  name: string;
  description?: string;
  startDate: Date;
  startTime: Date;
  frequencyType: FrequencyType;
}

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function TaskCreateModal({
  groupId,
  taskListId,
  isOpen,
  onClose,
  onTaskCreated,
}: TaskCreateModalProps) {
  const router = useRouter();

  const today = new Date();
  const defaultTime = new Date();
  defaultTime.setHours(9, 0, 0, 0); // fix

  const { register, setValue, watch, handleSubmit } = useForm<CreateTaskForm>({
    defaultValues: {
      name: "",
      description: "",
      startDate: today,
      startTime: defaultTime,
      frequencyType: FrequencyType.ONCE,
    },
  });

  const watchName = watch("name");
  const watchStartDate = watch("startDate");
  const watchStartTime = watch("startTime");
  const watchFrequency = watch("frequencyType");
  const watchDescription = watch("description");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [weekDays, setWeekDays] = useState<number[]>([]); // 0~6
  const [monthDay, setMonthDay] = useState<number | null>(null);

  const onSubmit = async (form: CreateTaskForm) => {
    const merged = new Date(
      form.startDate.setHours(
        form.startTime.getHours(),
        form.startTime.getMinutes(),
        0,
        0
      )
    );

    let body: CreateTaskRequestBody;

    switch (form.frequencyType) {
      case FrequencyType.WEEKLY:
        if (weekDays.length === 0) {
          alert("요일을 선택해주세요");
          return;
        }

        body = {
          name: form.name,
          description: form.description,
          startDate: merged.toISOString(),
          frequencyType: FrequencyType.WEEKLY,
          weekDays: weekDays, // 0~6 배열
        };
        break;

      case FrequencyType.MONTHLY:
        if (!monthDay) {
          alert("날짜를 선택해주세요");
          return;
        }

        body = {
          name: form.name,
          description: form.description,
          startDate: merged.toISOString(),
          frequencyType: FrequencyType.MONTHLY,
          monthDay: monthDay, // 1~31 숫자
        };
        break;

      case FrequencyType.DAILY:
        body = {
          name: form.name,
          description: form.description,
          startDate: merged.toISOString(),
          frequencyType: FrequencyType.DAILY,
        };
        break;

      case FrequencyType.ONCE:
        body = {
          name: form.name,
          description: form.description,
          startDate: merged.toISOString(),
          frequencyType: FrequencyType.ONCE,
        };
        break;

      default:
        alert("알 수 없는 반복 유형입니다.");
        return;
    }

    const response = await postTasks(Number(groupId), Number(taskListId), body);

    if (!response || "error" in response) {
      alert(response?.error || "할 일 생성 실패");
      return;
    }

    onClose();

    setValue("name", "");
    setValue("description", "");
    setValue("frequencyType", FrequencyType.ONCE);

    // date 초기화는 새로운 Date 로 해야 반영됨
    const newToday = new Date();
    const newDefaultTime = new Date();
    newDefaultTime.setHours(9, 0, 0, 0);

    setValue("startDate", newToday);
    setValue("startTime", newDefaultTime);

    if (onTaskCreated) {
      onTaskCreated();
    }
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
              value={watchName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue("name", e.target.value)
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
                  placeholder={formatDate(today.toISOString())}
                  readOnly
                  value={formatDate(watchStartDate.toISOString())}
                  onClick={() => {
                    setShowDatePicker(!showDatePicker);
                    // setShowTimePicker(false);
                  }}
                  className="cursor-pointer"
                />

                {showDatePicker && (
                  <div className="absolute top-full mt-8 z-50">
                    <div className="bg-background-secondary rounded-xl p-16 border-1 border-interaction-hover">
                      <DatePicker
                        selected={watchStartDate}
                        onChange={(date: Date | null) => {
                          if (!date) return;
                          setValue("startDate", date);
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
                  value={formatTime(watchStartTime.toISOString())}
                  onClick={() => {
                    setShowTimePicker(!showTimePicker);
                    // setShowDatePicker(false);
                  }}
                  className="cursor-pointer"
                />

                {showTimePicker && (
                  <div className="absolute top-full mt-8 right-0 z-50">
                    <div className="flex gap-14 bg-background-secondary rounded-xl p-16 border-1 border-interaction-hover">
                      {/* 오전/오후 */}
                      <div className="flex flex-col gap-8">
                        <Button
                          label="오전"
                          width="78px"
                          variant={
                            watchStartTime.getHours() < 12
                              ? "solid"
                              : "unselected"
                          }
                          onClick={() => {
                            const newTime = new Date(watchStartTime);
                            if (newTime.getHours() >= 12)
                              newTime.setHours(newTime.getHours() - 12);
                            setValue("startTime", newTime);
                          }}
                        />
                        <Button
                          label="오후"
                          width="78px"
                          variant={
                            watchStartTime.getHours() >= 12
                              ? "solid"
                              : "unselected"
                          }
                          onClick={() => {
                            const newTime = new Date(watchStartTime);
                            if (newTime.getHours() < 12)
                              newTime.setHours(newTime.getHours() + 12);
                            setValue("startTime", newTime);
                          }}
                        />
                      </div>

                      {/* 시간 목록 */}
                      <div className="h-[152px] w-[220px] rounded-xl bg-[#18212f] overflow-y-auto custom-scrollbar pr-2">
                        {Array.from({ length: 24 }, (_, i) => [i, i + 0.5])
                          .flat()
                          .map((hour) => {
                            const hours = Math.floor(hour);
                            const minutes = (hour % 1) * 60;

                            const isAM = watchStartTime.getHours() < 12;
                            const timeIsAM = hours < 12;
                            if (isAM !== timeIsAM) return null;

                            const displayHours = hours % 12 || 12;
                            const displayMinutes = minutes
                              .toString()
                              .padStart(2, "0");

                            const isSelected =
                              watchStartTime.getHours() === hours &&
                              watchStartTime.getMinutes() === minutes;

                            return (
                              <button
                                key={`${hours}-${minutes}`}
                                type="button"
                                onClick={() => {
                                  const newTime = new Date(watchStartTime);
                                  newTime.setHours(hours, minutes, 0, 0);
                                  setValue("startTime", newTime);
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
              options={Object.keys(frequencyToEnum)}
              onSelect={(label: string) => {
                setValue(
                  "frequencyType",
                  frequencyToEnum[label as keyof typeof frequencyToEnum]
                );
              }}
              trigger="text"
              size="md"
              value={getFrequencyText(watchFrequency)}
            />

            {/* WEEKLY UI */}
            {watchFrequency === FrequencyType.WEEKLY && (
              <div className="flex mt-8 justify-between text-md font-medium">
                {WEEK_LABELS.map((label, idx) => (
                  <Button
                    key={idx}
                    label={label}
                    variant={weekDays.includes(idx) ? "solid" : "unselected"}
                    size="large"
                    width="44px"
                    onClick={() => {
                      setWeekDays((prev) =>
                        prev.includes(idx)
                          ? prev.filter((d) => d !== idx)
                          : [...prev, idx]
                      );
                    }}
                  />
                ))}
              </div>
            )}

            {/* MONTHLY UI */}
            {watchFrequency === FrequencyType.MONTHLY && (
              <div className="mt-8 ml-12">
                <Dropdown
                  options={Array.from({ length: 31 }, (_, i) => `${i + 1}일`)}
                  onSelect={(label) => {
                    const day = Number(label.replace("일", ""));
                    setMonthDay(day);
                  }}
                  trigger="text"
                  size="sm"
                  value={monthDay ? `${monthDay}일` : "날짜 선택"}
                />
              </div>
            )}
          </section>
          <section>
            <InputBox
              label="할 일 메모"
              labelClassName="text-lg font-medium text-text-primary mb-16"
              placeholder="메모를 입력해주세요."
              value={watchDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setValue("description", e.target.value)
              }
            />
          </section>
        </form>
      </div>
      <ModalFooter
        primaryButton={{ label: "만들기", onClick: handleSubmit(onSubmit) }}
      />
    </BaseModal>
  );
}
