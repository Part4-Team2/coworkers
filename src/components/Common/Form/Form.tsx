import { FormProps } from "./types";
import FormTitle from "./FormTitle";
import clsx from "clsx";

export default function Form({
  onSubmit,
  title,
  children,
  centered = true,
  topOffsetClassName = "",
}: FormProps) {
  const hasTitle = Boolean(title);

  return (
    <div
      className={clsx("w-full max-w-800 sm:px-16 flex flex-col items-center", {
        "min-h-screen w-full flex items-center justify-center": centered,
        "w-full flex justify-center": !centered,
      })}
    >
      <form
        onSubmit={onSubmit}
        className={clsx(
          "w-full flex flex-col items-center",
          topOffsetClassName
        )}
      >
        {hasTitle && (
          <div className="text-center mb-80">
            <FormTitle>{title}</FormTitle>
          </div>
        )}

        {children}
      </form>
    </div>
  );
}
