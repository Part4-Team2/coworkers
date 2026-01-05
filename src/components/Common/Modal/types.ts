import { ReactNode } from "react";
import { IconMapTypes } from "../SVGIcon/iconMap";
import { InputProps } from "../Input/Input";
import { InputBoxProps } from "../Input/InputBox";

export interface ButtonConfig {
  label: string;
  onClick: () => void;
  variant?: "danger";
  disabled?: boolean;
  loading?: boolean;
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export type InputConfig = Omit<InputProps, "ref">;

export interface InputBoxConfig extends Omit<InputBoxProps, "ref"> {
  type: "textarea";
}

export type ModalInputConfig = InputConfig | InputBoxConfig;

export interface IconConfig {
  name: IconMapTypes;
  size?: number;
  className?: string;
}

export interface AvatarConfig {
  imageUrl?: string;
  altText: string;
  size?: "small" | "large" | "xlarge";
}

export interface ModalHeaderProps {
  title?: string | ReactNode;
  description?: string | string[];
  icon?: ReactNode | IconConfig;
  avatar?: AvatarConfig;
}

export interface ModalFooterProps {
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;

  // 헤더
  title?: string | ReactNode;
  description?: string | string[];
  icon?: ReactNode | IconConfig;
  avatar?: AvatarConfig;

  // Input (
  input?: ModalInputConfig | ModalInputConfig[];

  // 콘텐츠
  children?: ReactNode;

  // 푸터
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
}
