import { useEffect, useRef, useState } from "react";
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
import { useForm } from "react-hook-form";
import { patchTask, postTasks } from "@/lib/api/task";
import { getFrequencyText } from "@/utils/frequency";
import {
  CreateTaskRequestBody,
  TaskPatchResponse,
  UpdateTaskRequestBody,
} from "@/lib/types/task";
import { TaskDetail } from "@/types/task";

interface TaskCreateModalProps {
  groupId: string;
  taskListId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: (newTask: TaskDetail) => void;
  onTaskUpdated?: (updatedTask: TaskPatchResponse) => void;
  taskToEdit?: TaskDetail;
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
  onTaskUpdated,
  taskToEdit,
}: TaskCreateModalProps) {
  const today = new Date();
  const defaultTime = new Date();
  defaultTime.setHours(9, 0, 0, 0); // fix

  const { setValue, watch, handleSubmit } = useForm<CreateTaskForm>({
    defaultValues: {
      name: taskToEdit?.name || "",
      description: taskToEdit?.description || "",
      startDate: taskToEdit ? new Date(taskToEdit.date) : today,
      startTime: taskToEdit ? new Date(taskToEdit.date) : defaultTime,
      frequencyType: taskToEdit?.frequency || FrequencyType.ONCE,
    },
  });

  useEffect(() => {
    if (!taskToEdit) return;

    setValue("name", taskToEdit.name || "");
    setValue("description", taskToEdit.description || "");

    const dateObj = new Date(taskToEdit.date);
    setValue("startDate", dateObj);
    setValue("startTime", dateObj);
    setValue("frequencyType", taskToEdit.frequency);
  }, [taskToEdit, setValue]);

  const watchName = watch("name");
  const watchStartDate = watch("startDate");
  const watchStartTime = watch("startTime");
  const watchFrequency = watch("frequencyType");
  const watchDescription = watch("description");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [weekDays, setWeekDays] = useState<number[]>(() => {
    if (taskToEdit?.frequency === FrequencyType.WEEKLY) {
      return taskToEdit.weekDays ?? [];
    }
    return [];
  });
  const [monthDay, setMonthDay] = useState<number | undefined>(() => {
    if (taskToEdit?.frequency === FrequencyType.MONTHLY) {
      return taskToEdit.monthDay ?? new Date(taskToEdit.date).getDate();
    }
    return undefined;
  });

  const timePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node)
      ) {
        setShowTimePicker(false);
      }
    }

    if (showTimePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimePicker]);

  const onSubmit = async (form: CreateTaskForm) => {
    const merged = new Date(form.startDate);
    merged.setHours(
      form.startTime.getHours(),
      form.startTime.getMinutes(),
      0,
      0
    );

    // 수정 모드
    if (taskToEdit) {
      const updateBody: UpdateTaskRequestBody = {
        name: form.name,
        description: form.description,
      };

      const result = await patchTask(
        Number(groupId),
        Number(taskListId),
        taskToEdit.id,
        updateBody
      );

      if ("error" in result) {
        alert(result.message);
        return;
      }

      onTaskUpdated?.(result);
      onClose();
      return;
    }

    // 생성 모드
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
          weekDays: weekDays,
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
          monthDay: monthDay,
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
      alert(response.message || "할 일 생성 실패");
      return;
    }

    // 낙관적 업데이트(생성된 태스크를 부모 컴포넌트에 전달)
    if (onTaskCreated && response.recurring) {
      const newTask: TaskDetail = {
        id: response.recurring.id,
        name: response.recurring.name,
        description: response.recurring.description,
        commentCount: 0, // 새로 생성되었으므로 0
        frequency: form.frequencyType,
        date: merged.toISOString(),
        displayIndex: 0, // 새로 생성되었으므로 초기값
        recurringId: response.recurring.id,
        updatedAt: response.recurring.updatedAt,
        writer: {
          id: 0,
          nickname: "-",
          image: null,
        }, // 기본값 (서버에서 안 줄 수 있음)
        weekDays:
          form.frequencyType === FrequencyType.WEEKLY ? weekDays : undefined,
        monthDay:
          form.frequencyType === FrequencyType.MONTHLY
            ? (monthDay ?? undefined)
            : undefined,
      };

      onTaskCreated(newTask);
    } else {
    }

    setValue("name", "");
    setValue("description", "");
    setValue("frequencyType", FrequencyType.ONCE);
    setWeekDays([]);
    setMonthDay(undefined);

    // date 초기화는 새로운 Date 로 해야 반영됨
    const newToday = new Date();
    const newDefaultTime = new Date();
    newDefaultTime.setHours(9, 0, 0, 0);

    setValue("startDate", newToday);
    setValue("startTime", newDefaultTime);

    onClose();
  };

  // 반복 설정은 수정하지 못하도록 막고(api 불가), 이름과 설명만 수정 가능하게
  const isEditMode = !!taskToEdit;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="px-16 py-32">
      <ModalHeader title={isEditMode ? "할 일 수정하기" : "할 일 만들기"} />
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
          {!isEditMode && (
            <>
              <section>
                <h3 className="text-lg font-medium text-text-primary mb-16">
                  시작 날짜 및 시간
                </h3>
                <div className="flex gap-8 relative">
                  <div className="flex-[2] min-w-0">
                    <Input
                      label="시작 날짜"
                      labelClassName="sr-only"
                      placeholder={formatDate(today.toISOString())}
                      readOnly
                      value={formatDate(watchStartDate.toISOString())}
                      onClick={() => {
                        setShowDatePicker(!showDatePicker);
                      }}
                      className="cursor-pointer"
                    />

                    {showDatePicker && (
                      <div className="absolute sm:w-full top-full mt-8 z-50 border border-interaction-hover bg-background-secondary rounded-xl">
                        <div className="p-8 shadow-xl">
                          <DatePicker
                            selected={watchStartDate}
                            onChange={(date: Date | null) => {
                              if (!date) return;
                              setValue("startDate", date);
                              setShowDatePicker(false);
                            }}
                            inline
                            formatWeekDay={(day) => day.substring(0, 3)}
                            onClickOutside={() => setShowDatePicker(false)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-[1] min-w-0">
                    <Input
                      label="시작 시간"
                      labelClassName="sr-only"
                      placeholder="오후 3:00"
                      readOnly
                      value={formatTime(watchStartTime.toISOString())}
                      onClick={() => {
                        setShowTimePicker(!showTimePicker);
                      }}
                      className="cursor-pointer"
                    />

                    {showTimePicker && (
                      <div
                        ref={timePickerRef}
                        className="absolute top-full sm:w-full mt-8 right-0 z-50"
                      >
                        <div className="flex gap-14 w-auto bg-background-secondary rounded-xl p-12 border-1 border-interaction-hover shadow-xl">
                          {/* 오전/오후 */}
                          <div className="flex flex-col gap-8">
                            <Button
                              label="오전"
                              className="text-md"
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
                              className="text-md"
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
                          <div className="h-[152px] w-[220px] rounded-xl bg-[#18212f] overflow-hidden py-8">
                            <div className="h-full overflow-y-auto custom-scrollbar pl-16 mr-8">
                              {Array.from({ length: 24 }, (_, i) => [
                                i,
                                i + 0.5,
                              ])
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
                                        const newTime = new Date(
                                          watchStartTime
                                        );
                                        newTime.setHours(hours, minutes, 0, 0);
                                        setValue("startTime", newTime);
                                        setShowTimePicker(false);
                                      }}
                                      className={clsx(
                                        "w-full py-10 text-left rounded-lg font-regular",
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
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
          <section
            className={clsx(isEditMode && "pointer-events-none opacity-50")}
          >
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
        primaryButton={{
          label: isEditMode ? "수정하기" : "만들기",
          onClick: handleSubmit(onSubmit),
        }}
      />
    </BaseModal>
  );
}
