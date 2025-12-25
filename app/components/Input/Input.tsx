import React, { forwardRef, useMemo, useState } from "react";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";
import type { IconMapTypes } from "@/app/components/SVGIcon/iconMap";

export type InputVariant = "default" | "toggle" | "error";

export type InputSize = "large" | "small";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix" | "color"
> {
  label?: string;
  message?: string;
  variant?: InputVariant;
  showError?: boolean;
  rightIcon?: IconMapTypes;
  onRightIconClick?: () => void;
  rightElement?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  allowPasswordToggle?: boolean;
  allowDropdownToggle?: boolean;
  onDropdownToggle?: () => void;
  isDropdownOpen?: boolean;
  size?: InputSize;
  full?: boolean;
  width?: string;
}

const sizeClass: Record<InputSize, string> = {
  large: "h-[46px] text-md px-[16px]",
  small: "h-[40px] text-sm px-[16px]",
};

const defaultWidth: Record<InputSize, string> = {
  large: "460px",
  small: "332px",
};

// forwardRef는 ref 전달을 위해, function Input은 디버깅과 개발자 도구 표시를 위해 사용
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    message,
    variant,
    showError,
    rightIcon,
    onRightIconClick,
    rightElement,
    clearable,
    onClear,
    allowPasswordToggle,
    allowDropdownToggle,
    onDropdownToggle,
    isDropdownOpen,
    size = "large",
    disabled,
    className,
    full,
    width,
    type = "text",
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // variant가 toggle이면 자동으로 dropdown 기능 활성화
  const isToggleVariant = variant === "toggle";
  const effectiveDropdownToggle = isToggleVariant || allowDropdownToggle;
  const effectiveReadOnly = isToggleVariant ? true : rest.readOnly;

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
    clearable ||
    effectiveDropdownToggle
  );

  const baseWrapper =
    "relative flex items-center rounded-[10px] transition-colors duration-200 border bg-background-secondary text-text-primary";

  // variant가 toggle니면 toggle, error니면 error, 나머지는 default
  const effectiveVariant =
    variant === "toggle"
      ? "toggle"
      : variant === "error" || showError
        ? "error"
        : "default";

  const borderClass = disabled
    ? "border-border-primary"
    : effectiveVariant === "error"
      ? "border-status-danger"
      : effectiveVariant === "toggle" && isDropdownOpen
        ? "border-interaction-focus"
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
        <label className="mb-2 block text-sm text-text-secondary">
          {label}
        </label>
      )}
      <div
        className={`${baseWrapper} ${sizeClass[size]} ${borderClass} ${hoverClass} ${disabledCls} ${effectiveDropdownToggle ? "cursor-pointer" : ""} ${className ?? ""}`.trim()}
        onClick={effectiveDropdownToggle ? onDropdownToggle : undefined}
      >
        <input
          ref={ref}
          type={derivedType}
          disabled={disabled}
          readOnly={effectiveReadOnly}
          className={`w-full bg-transparent outline-none ${disabled ? "placeholder:text-text-disabled text-text-disabled" : ""} ${effectiveDropdownToggle ? "placeholder:text-text-primary cursor-pointer" : "placeholder:text-text-default"} ${inputPaddingRight}`}
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

        {/* Dropdown toggle icon (display only, click handled by wrapper) */}
        {effectiveDropdownToggle &&
          !showClear &&
          !showPwdToggle &&
          !rightIcon &&
          !rightElement && (
            <div
              className="flex items-center justify-center text-icon-primary pointer-events-none"
              aria-hidden="true"
            >
              <SVGIcon
                icon={"toggle"}
                size="md"
                className={
                  isDropdownOpen
                    ? "rotate-180 transition-transform"
                    : "transition-transform"
                }
              />
            </div>
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
});

export default Input;
