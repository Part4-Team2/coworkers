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

export interface InputConfig extends Omit<InputProps, "ref"> {
  type?: "input";
}

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
  title?: string;
  description?: string | string[];
  icon?: ReactNode | IconConfig;
  avatar?: AvatarConfig;
}

export interface ModalFooterProps {
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
}

export interface ModalProps {
  // 기본
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;

  // 헤더
  title?: string;
  description?: string | string[];
  icon?: ReactNode | IconConfig;
  avatar?: AvatarConfig;

  // Input (단일 또는 배열)
  input?: ModalInputConfig | ModalInputConfig[];

  // 콘텐츠 (완전 커스텀이 필요한 경우)
  children?: ReactNode;

  // 푸터
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
}
