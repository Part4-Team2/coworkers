import { FormProps, InputConfig } from "./types";
import FormTitle from "./FormTitle";
import Input from "../Input/Input";
import Button from "../Button/Button";
import clsx from "clsx";

export default function Form({
  onSubmit,
  title,
  profile,
  input,
  option,
  button,
  centered = true,
  topOffsetClassName = "",
  optionAlign = "center",
  register,
  errors,
  trigger,
}: FormProps) {
  const hasProfile = Boolean(profile);
  const hasInput = Boolean(input);
  const hasTitle = Boolean(title);
  const hasOption = Boolean(option);

  const renderInput = (inputConfig: InputConfig, index?: number) => {
    const key = index !== undefined ? `input-${index}` : "input";
    const fieldName = inputConfig.name;

    // react-hook-form이 제공된 경우 register와 errors를 적용
    // registerOptions는 DOM 속성이 아니므로 제거
    const { registerOptions, ...restInputConfig } = inputConfig;
    let inputProps = { ...restInputConfig };

    // name이 있고 register가 제공된 경우에만 register 적용
    if (register && fieldName) {
      const registered = register(fieldName, registerOptions || {});
      inputProps = { ...inputProps, ...registered };
    }

    // errors가 있고 fieldName이 있는 경우에만 에러 적용
    if (errors && fieldName && errors[fieldName]) {
      const error = errors[fieldName];
      // 이미 variant가 설정되어 있지 않은 경우에만 error로 설정
      if (!inputProps.variant || inputProps.variant === "default") {
        inputProps.variant = "error";
      }
      inputProps.showError = true;
      // message가 이미 설정되어 있지 않은 경우에만 에러 메시지 설정
      if (
        error?.message &&
        typeof error.message === "string" &&
        !inputProps.message
      ) {
        inputProps.message = error.message;
      }
    }

    return (
      <div key={key} className="w-full">
        <Input full {...(inputProps as InputConfig)} />
      </div>
    );
  };

  return (
    <div
      className={clsx("w-full max-w-800 sm:px-16 flex flex-col items-center", {
        "min-h-screen w-full flex items-center justify-center": centered,
        "w-full flex justify-center": !centered,
      })}
    >
      <form
        onSubmit={onSubmit}
        className={clsx(
          "w-full flex flex-col items-center",
          topOffsetClassName
        )}
      >
        {hasTitle && (
          <div className="text-center mb-80">
            <FormTitle>{title}</FormTitle>
          </div>
        )}

        {hasProfile && <div className="w-full">{profile}</div>}

        {hasInput && (
          <div className="w-full flex flex-col items-center gap-24 mt-24">
            {Array.isArray(input)
              ? input.map((inp, idx) => renderInput(inp, idx))
              : input && renderInput(input)}
          </div>
        )}

        {hasOption && (
          <div
            className={clsx("mt-12 w-full flex", {
              "justify-start": optionAlign === "start",
              "justify-end": optionAlign === "end",
              "justify-center": optionAlign === "center",
            })}
          >
            {option}
          </div>
        )}

        {button && (
          <div className="mt-40 w-full flex justify-center">
            <Button full {...button} type="submit" />
          </div>
        )}
      </form>
    </div>
  );
}
