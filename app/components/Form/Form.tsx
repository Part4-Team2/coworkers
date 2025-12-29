import { FormProps, InputConfig } from "./types";
import FormTitle from "./FormTitle";
import Input from "../Input/Input";
import Button from "../Button/Button";

export default function Form({
  onSubmit,
  title,
  profile,
  input,
  option,
  button,
  centered = true,
  topOffsetClassName = "",
  optionAlign = "center",
}: FormProps) {
  const hasProfile = Boolean(profile);
  const hasInput = Boolean(input);
  const hasTitle = Boolean(title);
  const hasOption = Boolean(option);

  const renderInput = (inputConfig: InputConfig, index?: number) => {
    const key = index !== undefined ? `input-${index}` : "input";

    return (
      <div key={key} className="w-full">
        <Input full {...(inputConfig as InputConfig)} />
      </div>
    );
  };

  const containerClass = centered
    ? "min-h-screen w-full flex items-center justify-center"
    : `w-full flex justify-center ${topOffsetClassName}`.trim();

  return (
    <div className={containerClass}>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-800 sm:px-16 flex flex-col items-center"
      >
        {hasTitle && (
          <div className="text-center mb-80">
            <FormTitle>{title}</FormTitle>
          </div>
        )}

        {hasProfile && <div className="w-full">{profile}</div>}

        {hasInput && (
          <div className="w-full flex flex-col items-center gap-24 mt-24">
            {Array.isArray(input)
              ? input.map((inp, idx) => renderInput(inp, idx))
              : input && renderInput(input)}
          </div>
        )}

        {hasOption && (
          <div
            className={`mt-12 w-full flex ${
              optionAlign === "start"
                ? "justify-start"
                : optionAlign === "end"
                  ? "justify-end"
                  : "justify-center"
            }`}
          >
            {option}
          </div>
        )}

        {button && (
          <div className="mt-40 w-full flex justify-center">
            <Button full {...button} onSubmit={onSubmit} />
          </div>
        )}
      </form>
    </div>
  );
}
