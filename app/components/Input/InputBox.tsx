import React, { useState } from "react";

export type InputBoxProps = Omit<
  React.ComponentPropsWithRef<"textarea">,
  "size" | "color"
> & {
  label?: string;
  message?: string;
  showError?: boolean;
  full?: boolean;
  width?: string;
  minHeight?: string;
  maxHeight?: string;
};

export default function InputBox({
  ref,
  label,
  message,
  showError,
  disabled,
  className,
  full,
  width,
  minHeight = "120px",
  maxHeight,
  onFocus,
  onBlur,
  ...rest
}: InputBoxProps) {
  const [isFocused, setIsFocused] = useState(false);

  const baseWrapper =
    "relative flex rounded-lg transition-colors duration-200 border bg-background-secondary text-text-primary";

  const borderClass = disabled
    ? "border-border-primary"
    : showError
      ? "border-status-danger"
      : isFocused
        ? "border-interaction-focus"
        : "border-border-primary";

  const hoverClass =
    !showError && !disabled ? "hover:border-interaction-hover" : "";

  const disabledCls = disabled
    ? "text-text-disabled bg-background-tertiary border-border-primary cursor-not-allowed"
    : "";

  // 기본 width는 343px, full이면 w-full, width prop이 있으면 그 값 사용
  // maxWidth를 100%로 설정하여 부모 영역을 벗어나지 않도록 함
  const widthStyle = full
    ? undefined
    : width
      ? { width, maxWidth: "100%" }
      : { width: "343px", maxWidth: "100%" };

  const textareaStyle = {
    minHeight,
    maxHeight,
    ...rest.style,
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={full ? "w-full" : ""} style={widthStyle}>
      {label && (
        <label className="mb-2 block text-sm text-text-secondary">
          {label}
        </label>
      )}
      <div
        className={`${baseWrapper} text-md ${borderClass} ${hoverClass} ${disabledCls} ${className ?? ""}`.trim()}
      >
        <textarea
          ref={ref}
          disabled={disabled}
          className={`w-full bg-transparent outline-none resize-none overflow-y-auto py-12 px-16 ${disabled ? "placeholder:text-text-disabled text-text-disabled" : "placeholder:text-text-default"} [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border-primary [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent`}
          style={textareaStyle}
          {...rest}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {message && (
        <p
          className={`mt-2 text-xs ${
            showError ? "text-status-danger" : "text-text-default"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
