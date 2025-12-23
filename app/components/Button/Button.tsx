import React from "react";

export type ButtonVariant =
  | "solid"
  | "outlined"
  | "outlinedSecondary"
  | "danger";

export type ButtonSize = "large" | "xSmall";

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  width?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

const sizeClass: Record<ButtonSize, string> = {
  large: "h-[46px] text-lg px-[18px] min-w-[332px]",
  xSmall: "h-[32px] text-xs px-[14px] min-w-[74px]",
};

const variantClass: Record<ButtonVariant, string> = {
  solid:
    "bg-brand-primary text-inverse transition-colors duration-200 hover:bg-interaction-hover active:bg-interaction-pressed disabled:bg-interaction-inactive",
  outlined:
    "bg-white text-brand-primary transition-colors duration-200 border border-brand-primary hover:border-interaction-hover hover:text-interaction-hover active:border-interaction-pressed active:text-interaction-pressed disabled:border-interaction-inactive disabled:text-interaction-inactive",
  outlinedSecondary:
    "bg-white text-text-default transition-colors duration-200 border border-text-secondary disabled:text-text-disabled",
  danger:
    "bg-status-danger text-inverse transition-colors duration-200 hover:bg-red-700 active:bg-red-800 disabled:bg-interaction-inactive",
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
  const base =
    "inline-flex rounded-[10px] items-center justify-center font-semibold tracking-[-0.01em] transition-transform duration-75 active:translate-y-[1px] whitespace-nowrap";
  const widthClass = full ? "w-full" : "";
  const disabledCls = disabled ? "cursor-not-allowed" : "cursor-pointer";

  // 동적 width는 style prop으로 처리
  const style = !full && width ? { width } : undefined;

  // sm + outlined 조합일 때 배경 투명하게
  const bgOverride =
    size === "xSmall" && variant === "outlined" ? "!bg-transparent" : "";

  return (
    <button
      className={`${base} ${widthClass} ${sizeClass[size]} ${variantClass[variant]} ${bgOverride} ${disabledCls}`.trim()}
      style={style}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
};

export default Button;
