import { InputProps } from "../Input/Input";
import { ButtonProps } from "../Button/Button";

export type InputConfig = InputProps;

export interface FormProps {
  onSubmit: () => void;
  title?: string;
  profile?: React.ReactNode;
  input?: InputProps | InputProps[];
  option?: React.ReactNode;
  button?: ButtonProps;
  centered?: boolean; // default true: vertical center
  topOffsetClassName?: string; // e.g., "pt-[140px]" when centered is false
  optionAlign?: "start" | "center" | "end";
}
