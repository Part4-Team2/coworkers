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
import { getFrequencyText } from "@/utils/frequency";
import { TaskForEdit } from "@/lib/types/task";
import { toast } from "react-toastify";

export interface CreateTaskForm {
  name: string;
  description?: string;
  startDate: Date;
  startTime: Date;
  frequencyType: "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";
  weekDays?: number[];
  monthDay?: number;
}
interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTaskForm) => void; // 부모가 처리
  taskToEdit?: TaskForEdit | null; // 수정이면 Task 전달
}

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function TaskCreateModal({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
}: TaskCreateModalProps) {
  const today = new Date();
  const defaultTime = new Date();
  defaultTime.setHours(9, 0, 0, 0); // fix

  const isEditMode = !!taskToEdit;

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid },
  } = useForm<CreateTaskForm>({
    defaultValues: {
      name: "",
      description: "",
      startDate: today,
      startTime: defaultTime,
      frequencyType: "ONCE",
    },
    mode: "onChange",
  });

  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [monthDay, setMonthDay] = useState<number | undefined>(undefined);

  // 생성 모드로 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen && !taskToEdit) {
      const freshDefaultTime = new Date();
      freshDefaultTime.setHours(9, 0, 0, 0);

      reset({
        name: "",
        description: "",
        startDate: new Date(),
        startTime: freshDefaultTime,
        frequencyType: "ONCE",
      });
      setWeekDays([]);
      setMonthDay(undefined);
    }
  }, [isOpen]);

  // 수정 모드일 때 데이터 채우기
  useEffect(() => {
    if (taskToEdit) {
      reset({
        name: taskToEdit.name,
        description: taskToEdit.description,
        startDate: new Date(taskToEdit.date),
        startTime: new Date(taskToEdit.date),
        frequencyType: taskToEdit.frequency,
      });
      setWeekDays(taskToEdit.weekDays ?? []);
      setMonthDay(taskToEdit.monthDay ?? new Date(taskToEdit.date).getDate());
    }
  }, [taskToEdit, reset]);

  const watchStartDate = watch("startDate");
  const watchStartTime = watch("startTime");
  const watchFrequency = watch("frequencyType");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const timePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!timePickerRef.current?.contains(e.target as Node)) {
        setShowTimePicker(false);
      }
    };

    if (showTimePicker) {
      document.addEventListener("mousedown", close);
    }
    return () => document.removeEventListener("mousedown", close);
  }, [showTimePicker]);

  const submitHandler = async (form: CreateTaskForm) => {
    try {
      // 유효성 검사
      if (
        form.frequencyType === "WEEKLY" &&
        (!weekDays || weekDays.length === 0)
      ) {
        toast.error("주 반복을 선택하려면 최소 하나의 요일을 선택해주세요.");
        return;
      }

      if (form.frequencyType === "MONTHLY" && !monthDay) {
        toast.error("월 반복을 선택하려면 날짜를 선택해주세요.");
        return;
      }

      // 날짜와 시간을 정확하게 병합
      const year = form.startDate.getFullYear();
      const month = form.startDate.getMonth();
      const date = form.startDate.getDate();
      const hours = form.startTime.getHours();
      const minutes = form.startTime.getMinutes();

      const merged = new Date(year, month, date, hours, minutes, 0, 0);
      const utcMerged = new Date(
        merged.getTime() - merged.getTimezoneOffset() * 60000
      );

      await onSubmit({
        ...form,
        startDate: utcMerged,
        startTime: utcMerged,
        weekDays,
        monthDay,
      });

      toast.success(
        isEditMode ? "할 일이 수정되었습니다!" : "할 일이 생성되었습니다!"
      );
      onClose();
      reset();
    } catch (error) {
      toast.error("할일 생성/수정에 실패했습니다.");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="px-16 py-32">
      <ModalHeader title={isEditMode ? "할 일 수정하기" : "할 일 만들기"} />
      <div className="text-center text-text-default text-md font-medium pt-16 pb-24">
        할 일은 실제로 행동 가능한 작업 중심으로 <br /> 작성해주시면 좋습니다.
      </div>

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
              {...register("name", {
                required: "제목은 필수입니다.",
                minLength: {
                  value: 1,
                  message: "제목은 최소 1글자 이상 입력해주세요.",
                },
                maxLength: {
                  value: 100,
                  message: "제목은 최대 100자까지 입력 가능합니다.",
                },
              })}
            />
            {errors.name && (
              <p className="text-status-danger text-xs mt-4 ml-4">
                {errors.name.message}
              </p>
            )}
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
                            minDate={new Date()}
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
                      value={formatTime(watchStartTime)}
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
                                const newTime = new Date(
                                  watchStartDate.getFullYear(),
                                  watchStartDate.getMonth(),
                                  watchStartDate.getDate(),
                                  watchStartTime.getHours() >= 12
                                    ? watchStartTime.getHours() - 12
                                    : watchStartTime.getHours(),
                                  watchStartTime.getMinutes()
                                );
                                setValue("startTime", newTime, {
                                  shouldDirty: true,
                                });
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
                                const newTime = new Date(
                                  watchStartDate.getFullYear(),
                                  watchStartDate.getMonth(),
                                  watchStartDate.getDate(),
                                  watchStartTime.getHours() < 12
                                    ? watchStartTime.getHours() + 12
                                    : watchStartTime.getHours(),
                                  watchStartTime.getMinutes()
                                );
                                setValue("startTime", newTime, {
                                  shouldDirty: true,
                                });
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
                                          watchStartDate.getFullYear(),
                                          watchStartDate.getMonth(),
                                          watchStartDate.getDate(),
                                          hours,
                                          minutes
                                        );
                                        setValue("startTime", newTime, {
                                          shouldDirty: true,
                                        });
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
              onSelect={(label) => {
                const enumValue =
                  frequencyToEnum[label as keyof typeof frequencyToEnum];
                setValue("frequencyType", enumValue);

                // 선택에 따라 추가 필드 초기화
                if (enumValue === "WEEKLY") {
                  setWeekDays([]);
                } else if (enumValue === "MONTHLY") {
                  setMonthDay(watchStartDate.getDate());
                } else {
                  setWeekDays([]);
                  setMonthDay(undefined);
                }
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
                      setWeekDays(
                        weekDays.includes(idx)
                          ? weekDays.filter((d) => d !== idx)
                          : [...weekDays, idx]
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
              {...register("description", {
                maxLength: {
                  value: 1000,
                  message: "매모는 최대 1000자까지 입력 가능합니다.",
                },
              })}
            />
            {errors.description && (
              <p className="text-status-danger text-xs mt-4 ml-4">
                {errors.description.message}
              </p>
            )}
          </section>
        </form>
      </div>

      <ModalFooter
        primaryButton={{
          label: isEditMode ? "수정하기" : "만들기",
          onClick: handleSubmit(submitHandler),
          disabled: !isValid,
        }}
      />
    </BaseModal>
  );
}
