import React from "react";
import clsx from "clsx";

export type ButtonVariant = "solid" | "outlined";

export type ButtonSize = "large" | "medium";

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  className?: string;
  width?: string;
  icon?: React.ReactNode; // Changed to React.ReactNode to allow more flexible icon content
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

const sizeClass: Record<ButtonSize, string> = {
  large: "h-46 text-15 px-18",
  medium: "h-38 text-14 px-18",
};

const defaultMinWidth: Record<ButtonSize, string> = {
  large: "83px",
  medium: "69px",
};

const variantClass: Record<ButtonVariant, string> = {
  solid:
    "bg-brand-primary text-inverse transition-colors duration-200 hover:bg-interaction-hover active:bg-interaction-pressed disabled:bg-interaction-inactive",
  outlined:
    "bg-white text-brand-primary transition-colors duration-200 border border-brand-primary hover:border-interaction-hover hover:text-interaction-hover active:border-interaction-pressed active:text-interaction-pressed disabled:border-interaction-inactive disabled:text-interaction-inactive",
};

const ButtonFloating: React.FC<ButtonProps> = ({
  label,
  variant = "solid",
  size = "medium",
  full,
  width,
  className,
  icon,
  disabled,
  onClick,
  type = "button",
}) => {
  const base = clsx(
    "inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition-transform duration-75 active:translate-y-1 whitespace-nowrap",
    className
  );
  const disabledCls = clsx(disabled ? "cursor-not-allowed" : "cursor-pointer");

  // full이면 w-full, width prop이 있으면 그 값 사용 (고정 width)
  // width prop이 없으면 min-width만 설정하여 텍스트 길이에 따라 자동으로 커지도록 함
  // maxWidth를 100%로 설정하여 부모 영역을 벗어나지 않도록 함
  const widthStyle = full
    ? undefined
    : width
      ? { width, maxWidth: "100%" }
      : { minWidth: defaultMinWidth[size], maxWidth: "100%" };

  return (
    <button
      className={clsx(
        base,
        full && "w-full",
        sizeClass[size],
        variantClass[variant],
        disabledCls
      )}
      style={widthStyle}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon ? (
        <span
          className={clsx(
            "mr-2 inline-flex items-center justify-center rounded-full text-[12px] font-bold"
          )}
        >
          {icon}
        </span>
      ) : null}
      {label}
    </button>
  );
};

export default ButtonFloating;
