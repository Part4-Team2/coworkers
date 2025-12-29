import React, { useMemo, useState } from "react";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";
import type { IconMapTypes } from "@/app/components/SVGIcon/iconMap";

export type InputVariant = "default" | "error";

export type InputSize = "large" | "small";

export type InputProps = Omit<
  React.ComponentPropsWithRef<"input">,
  "size" | "prefix" | "color" | "ref"
> & {
  label?: string;
  labelClassName?: string;
  message?: string;
  variant?: InputVariant;
  showError?: boolean;
  rightIcon?: IconMapTypes;
  onRightIconClick?: () => void;
  rightElement?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  allowPasswordToggle?: boolean;
  size?: InputSize;
  full?: boolean;
  width?: string;
  ref?: React.Ref<HTMLInputElement>;
};

const sizeClass: Record<InputSize, string> = {
  large: "h-46 text-md px-16",
  small: "h-40 text-sm px-16",
};

const defaultWidth: Record<InputSize, string> = {
  large: "460px",
  small: "332px",
};

export default function Input({
  ref,
  label,
  labelClassName,
  message,
  variant,
  showError,
  rightIcon,
  onRightIconClick,
  rightElement,
  clearable,
  onClear,
  allowPasswordToggle,
  size = "large",
  disabled,
  className,
  full,
  width,
  type = "text",
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const derivedType = useMemo(() => {
    if (type === "password" && allowPasswordToggle) {
      return showPassword ? "text" : "password";
    }
    return type;
  }, [type, allowPasswordToggle, showPassword]);

  const hasTrailing = Boolean(
    rightIcon ||
    rightElement ||
    (type === "password" && allowPasswordToggle) ||
    clearable
  );

  const baseWrapper =
    "relative flex items-center rounded-lg transition-colors duration-200 border bg-background-secondary text-text-primary";

  // variant가 toggle니면 toggle, error니면 error, 나머지는 default
  const effectiveVariant =
    variant === "error" || showError ? "error" : "default";

  const borderClass = disabled
    ? "border-border-primary"
    : effectiveVariant === "error"
      ? "border-status-danger"
      : isFocused
        ? "border-interaction-focus"
        : "border-border-primary";

  const hoverClass =
    effectiveVariant !== "error" && !disabled
      ? "hover:border-interaction-hover"
      : "";

  const disabledCls = disabled
    ? "text-text-disabled bg-background-tertiary border-border-primary cursor-not-allowed"
    : "";

  // 기본 width는 size에 따라, full이면 w-full, width prop이 있으면 그 값 사용
  // maxWidth를 100%로 설정하여 부모 영역을 벗어나지 않도록 함
  const widthStyle = full
    ? undefined
    : width
      ? { width, maxWidth: "100%" }
      : { width: defaultWidth[size], maxWidth: "100%" };

  const inputPaddingRight = hasTrailing ? "pr-12" : "pr-4";

  const showClear = Boolean(clearable && !disabled && rest.value);
  const showPwdToggle = Boolean(type === "password" && allowPasswordToggle);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={full ? "w-full" : ""} style={widthStyle}>
      {label && (
        <label
          className={`mb-2 block text-md text-text-primary pb-3 ${labelClassName ?? ""}`}
        >
          {label}
        </label>
      )}
      <div
        className={`${baseWrapper} ${sizeClass[size]} ${borderClass} ${hoverClass} ${disabledCls} ${className ?? ""}`.trim()}
      >
        <input
          ref={ref}
          type={derivedType}
          disabled={disabled}
          className={`w-full bg-transparent outline-none ${disabled ? "placeholder:text-text-disabled text-text-disabled" : ""} "placeholder:text-text-default" ${inputPaddingRight}`}
          {...rest}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Clear button */}
        {showClear && (
          <button
            type="button"
            aria-label="clear input"
            className="flex items-center justify-center text-icon-primary hover:text-text-tertiary transition-colors"
            onClick={onClear}
            tabIndex={-1}
          >
            <SVGIcon icon="x" size="md" />
          </button>
        )}

        {/* Right element (custom component) - highest priority */}
        {rightElement && !showPwdToggle && !showClear && !rightIcon && (
          <div className="flex items-center justify-center">{rightElement}</div>
        )}

        {/* Right icon action (if provided and no password toggle) */}
        {rightIcon && !showPwdToggle && !showClear && !rightElement && (
          <button
            type="button"
            aria-label="input action"
            className="flex items-center justify-center text-icon-primary hover:text-text-tertiary transition-colors"
            onClick={onRightIconClick}
            tabIndex={-1}
          >
            <SVGIcon icon={rightIcon} size="md" />
          </button>
        )}

        {/* Password toggle */}
        {showPwdToggle && !showClear && (
          <button
            type="button"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            className="flex items-center justify-center text-icon-primary hover:text-text-tertiary transition-colors"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            <SVGIcon
              icon={showPassword ? "visibilityOn" : "visibilityOff"}
              size="md"
            />
          </button>
        )}
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
