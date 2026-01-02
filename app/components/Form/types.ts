import { InputProps } from "../Input/Input";
import { ButtonProps } from "../Button/Button";
import {
  UseFormRegister,
  FieldErrors,
  UseFormTrigger,
  RegisterOptions,
} from "react-hook-form";

export type InputConfig = Omit<InputProps, "name"> & {
  name?: string;
  registerOptions?: RegisterOptions;
};

export interface FormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  title?: string;
  profile?: React.ReactNode;
  input?: InputConfig | InputConfig[];
  option?: React.ReactNode;
  button?: ButtonProps;
  centered?: boolean; // default true: vertical center
  topOffsetClassName?: string; // e.g., "pt-140" when centered is false
  optionAlign?: "start" | "center" | "end";
  // react-hook-form 관련 props (optional)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: FieldErrors<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger?: UseFormTrigger<any>;
}
