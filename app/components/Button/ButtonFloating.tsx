import React from "react";

export type ButtonVariant = "solid" | "outlined";

export type ButtonSize = "large" | "medium";

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  width?: string;
  icon?: React.ReactNode; // Changed to React.ReactNode to allow more flexible icon content
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

const sizeClass: Record<ButtonSize, string> = {
  large: "h-[46px] text-[15px] px-[18px] min-w-[83px]",
  medium: "h-[38px] text-[14px] px-[18px] min-w-[69px]",
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
  icon,
  disabled,
  onClick,
  type = "button",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition-transform duration-75 active:translate-y-[1px] whitespace-nowrap";
  const widthClass = full ? "w-full" : "";
  const disabledCls = disabled ? "cursor-not-allowed" : "cursor-pointer";

  // 동적 width는 style prop으로 처리
  const style = !full && width ? { width } : undefined;

  return (
    <button
      className={`${base} ${widthClass} ${sizeClass[size]} ${variantClass[variant]} ${disabledCls}`.trim()}
      style={style}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon ? (
        <span
          className={`mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-bold`}
        >
          {icon}
        </span>
      ) : null}
      {label}
    </button>
  );
};

export default ButtonFloating;
