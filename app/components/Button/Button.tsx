import React from "react";

export type ButtonVariant =
  | "solid"
  | "outlined"
  | "outlinedSecondary"
  | "danger"
  | "gradient";

export type ButtonSize = "large" | "xSmall";

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  width?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onSubmit?: React.FormEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

const sizeClass: Record<ButtonSize, string> = {
  large: "h-46 text-lg px-18",
  xSmall: "h-32 text-xs px-14",
};

const defaultMinWidth: Record<ButtonSize, string> = {
  large: "332px",
  xSmall: "74px",
};

const variantClass: Record<ButtonVariant, string> = {
  solid:
    "bg-brand-primary text-text-inverse transition-colors duration-200 hover:bg-interaction-hover active:bg-interaction-pressed disabled:bg-interaction-inactive",
  outlined:
    "bg-white text-brand-primary transition-colors duration-200 border border-brand-primary hover:border-interaction-hover hover:text-interaction-hover active:border-interaction-pressed active:text-interaction-pressed disabled:border-interaction-inactive disabled:text-interaction-inactive",
  outlinedSecondary:
    "bg-white text-text-default transition-colors duration-200 border border-text-secondary disabled:text-text-disabled",
  danger:
    "bg-status-danger text-text-inverse transition-colors duration-200 hover:bg-red-700 active:bg-red-800 disabled:bg-interaction-inactive",
  gradient:
    "bg-gradient-to-r from-brand-primary to-brand-tertiary text-text-inverse transition-all duration-200 hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed",
};

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "solid",
  size = "large",
  full,
  width,
  disabled,
  onClick,
  type = "button",
}) => {
  const base = `inline-flex ${variant === "gradient" ? "rounded-[32px]" : "rounded-[12px]"} items-center justify-center font-semibold tracking-[-0.01em] transition-transform duration-75 active:translate-y-[1px] whitespace-nowrap`;
  const disabledCls = disabled ? "cursor-not-allowed" : "cursor-pointer";

  // full이면 w-full, width prop이 있으면 그 값 사용 (고정 width)
  // width prop이 없으면 min-width만 설정하여 텍스트 길이에 따라 자동으로 커지도록 함
  // maxWidth를 100%로 설정하여 부모 영역을 벗어나지 않도록 함
  const widthStyle = full
    ? undefined
    : width
      ? { width, maxWidth: "100%" }
      : { minWidth: defaultMinWidth[size], maxWidth: "100%" };

  // sm + outlined 조합일 때 배경 투명하게
  const bgOverride =
    size === "xSmall" && variant === "outlined" ? "!bg-transparent" : "";

  return (
    <button
      className={`${base} ${full ? "w-full" : ""} ${sizeClass[size]} ${
        variantClass[variant]
      } ${bgOverride} ${disabledCls}`.trim()}
      style={widthStyle}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
};

export default Button;
