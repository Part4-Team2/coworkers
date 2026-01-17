export interface FormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  title?: string;
  children?: React.ReactNode;
  centered?: boolean; // default true: vertical center
  topOffsetClassName?: string; // e.g., "pt-140" when centered is false
}
