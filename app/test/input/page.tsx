"use client";

import { useState } from "react";
import Input from "@/app/components/Input/Input";
import Dropdown from "@/app/components/Dropdown/Dropdown";
import type { InputVariant, InputSize } from "@/app/components/Input/Input";
import type { DropdownItem } from "@/app/components/Dropdown/Dropdown";

export default function InputStorybookPage() {
  // Input 커스터마이징
  const [inputVariant, setInputVariant] = useState<InputVariant>("default");
  const [inputSize, setInputSize] = useState<InputSize>("large");
  const [inputValue, setInputValue] = useState("");
  const [inputLabel, setInputLabel] = useState("레이블");
  const [inputPlaceholder, setInputPlaceholder] =
    useState("플레이스홀더를 입력하세요.");
  const [inputMessage, setInputMessage] = useState("");
  const [inputType, setInputType] = useState<"text" | "password">("text");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputShowError, setInputShowError] = useState(false);
  const [inputClearable, setInputClearable] = useState(false);
  const [inputPasswordToggle, setInputPasswordToggle] = useState(false);
  const [inputFull, setInputFull] = useState(false);
  const [inputWidth, setInputWidth] = useState("");
  const [inputWidthInput, setInputWidthInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownItems: DropdownItem[] = [
    { id: "option1", label: "옵션 1" },
    { id: "option2", label: "옵션 2" },
    { id: "option3", label: "옵션 3" },
    { id: "option4", label: "옵션 4" },
  ];

  const applyInputWidth = () => {
    setInputWidth(inputWidthInput);
  };

  return (
    <div className="min-h-screen bg-[#3f4147] px-6 py-8 text-[#e7ebf2]">
      {/* Input Storybook */}
      <section className="mb-10">
        <h1 className="mb-6 text-2xl font-bold">Input Storybook</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* 컨트롤 패널 */}
          <div className="col-span-1 rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4 max-h-[800px] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold">Props 제어</h3>

            {/* Value */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Value</label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="Input 값"
              />
            </div>

            {/* Label */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Label</label>
              <input
                type="text"
                value={inputLabel}
                onChange={(e) => setInputLabel(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="레이블"
              />
            </div>

            {/* Placeholder */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Placeholder
              </label>
              <input
                type="text"
                value={inputPlaceholder}
                onChange={(e) => setInputPlaceholder(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="플레이스홀더"
              />
            </div>

            {/* Message */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Message
              </label>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="도움말 메시지"
              />
            </div>

            {/* Variant */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Variant
              </label>
              <select
                value={inputVariant}
                onChange={(e) =>
                  setInputVariant(e.target.value as InputVariant)
                }
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                <option value="default">default</option>
                <option value="toggle">toggle</option>
                <option value="error">error</option>
              </select>
            </div>

            {/* Size */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Size</label>
              <select
                value={inputSize}
                onChange={(e) => setInputSize(e.target.value as InputSize)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                <option value="large">large</option>
                <option value="small">small</option>
              </select>
            </div>

            {/* Type */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Type</label>
              <select
                value={inputType}
                onChange={(e) =>
                  setInputType(e.target.value as "text" | "password")
                }
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                <option value="text">text</option>
                <option value="password">password</option>
              </select>
            </div>

            {/* Width */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Custom Width
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputWidthInput}
                  onChange={(e) => setInputWidthInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      applyInputWidth();
                    }
                  }}
                  className="flex-1 rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                  placeholder="예: 400px"
                />
                <button
                  onClick={applyInputWidth}
                  className="rounded bg-brand-primary px-3 py-2 text-xs font-semibold text-white hover:bg-interaction-hover transition-colors"
                >
                  적용
                </button>
              </div>
              {inputWidth && (
                <p className="mt-1 text-xs text-brand-secondary">
                  적용됨: {inputWidth}
                </p>
              )}
            </div>

            {/* Full */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="inputFull"
                checked={inputFull}
                onChange={(e) => setInputFull(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-brand-primary"
              />
              <label
                htmlFor="inputFull"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                Full Width
              </label>
            </div>

            {/* Clearable */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="inputClearable"
                checked={inputClearable}
                onChange={(e) => setInputClearable(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-brand-primary"
              />
              <label
                htmlFor="inputClearable"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                Clearable
              </label>
            </div>

            {/* Password Toggle */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="inputPasswordToggle"
                checked={inputPasswordToggle}
                onChange={(e) => setInputPasswordToggle(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-brand-primary"
              />
              <label
                htmlFor="inputPasswordToggle"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                Password Toggle
              </label>
            </div>

            {/* Show Error */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="inputShowError"
                checked={inputShowError}
                onChange={(e) => setInputShowError(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-status-danger"
              />
              <label
                htmlFor="inputShowError"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                Show Error
              </label>
            </div>

            {/* Disabled */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="inputDisabled"
                checked={inputDisabled}
                onChange={(e) => setInputDisabled(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-status-danger"
              />
              <label
                htmlFor="inputDisabled"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                Disabled
              </label>
            </div>
          </div>

          {/* 미리보기 및 코드 */}
          <div className="col-span-2 space-y-4">
            {/* Preview */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
              <h3 className="mb-6 text-lg font-semibold">Preview</h3>
              <div className="rounded bg-[#2a2d32] p-8">
                <div
                  className={`relative ${inputFull ? "w-full" : "inline-block"}`}
                >
                  <Input
                    label={inputLabel}
                    placeholder={inputPlaceholder}
                    message={inputMessage}
                    variant={inputVariant}
                    size={inputSize}
                    type={inputType}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={inputDisabled}
                    showError={inputShowError}
                    clearable={inputClearable}
                    onClear={() => setInputValue("")}
                    allowPasswordToggle={inputPasswordToggle}
                    isDropdownOpen={isDropdownOpen}
                    onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                    full={inputFull}
                    width={inputWidth}
                  />
                  {isDropdownOpen && inputVariant === "toggle" && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10 w-full">
                      <Dropdown items={dropdownItems} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 코드 표시 */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold">Code</h3>
              <pre className="overflow-auto rounded bg-[#2a2d32] p-3 text-xs text-[#a8b0c0]">
                {`<Input
  label="${inputLabel}"
  placeholder="${inputPlaceholder}"${inputMessage ? `\n  message="${inputMessage}"` : ""}
  variant="${inputVariant}"
  size="${inputSize}"
  type="${inputType}"
  value={value}
  onChange={(e) => setValue(e.target.value)}${inputDisabled ? "\n  disabled" : ""}${inputShowError ? "\n  showError" : ""}${inputClearable ? `\n  clearable\n  onClear={() => setValue("")}` : ""}${inputPasswordToggle ? "\n  allowPasswordToggle" : ""}${inputVariant === "toggle" ? `\n  isDropdownOpen={isOpen}\n  onDropdownToggle={() => setIsOpen(!isOpen)}` : ""}${inputFull ? "\n  full" : ""}${inputWidth ? `\n  width="${inputWidth}"` : ""}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 전체 Variant 가이드 */}
      <section className="mt-12 mb-10">
        <h2 className="mb-6 text-2xl font-bold">Variant Guide</h2>
        <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">default</p>
              <Input
                placeholder="기본 상태 (hover/focus 자동 적용)"
                variant="default"
                full
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">toggle</p>
              <div className="relative">
                <Input
                  placeholder="토글 상태"
                  variant="toggle"
                  isDropdownOpen
                  onDropdownToggle={() => {}}
                  full
                />
                <div className="absolute top-full left-0 right-0 mt-2 z-10 w-full">
                  <Dropdown items={dropdownItems} />
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">error</p>
              <Input
                placeholder="에러 상태"
                variant="error"
                message="에러 메시지입니다."
                showError
                full
              />
            </div>
          </div>
        </div>
      </section>

      {/* 전체 Size 가이드 */}
      <section className="mt-12 mb-10">
        <h2 className="mb-6 text-2xl font-bold">Size Guide</h2>
        <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
          <div className="space-y-4">
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">large (46px)</p>
              <Input placeholder="Large 사이즈" size="large" full />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">small (40px)</p>
              <Input placeholder="Small 사이즈" size="small" full />
            </div>
          </div>
        </div>
      </section>

      {/* 특수 기능 가이드 */}
      <section className="mt-12 mb-10">
        <h2 className="mb-6 text-2xl font-bold">특수 기능</h2>
        <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">Clearable</p>
              <Input
                placeholder="텍스트 입력 후 삭제 가능"
                clearable
                onClear={() => {}}
                defaultValue="텍스트 예시"
                full
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">Password Toggle</p>
              <Input
                placeholder="비밀번호 입력"
                type="password"
                allowPasswordToggle
                defaultValue="password123"
                full
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">
                Dropdown Toggle (variant=&quot;toggle&quot;)
              </p>
              <Input
                placeholder="드롭다운 열기"
                variant="toggle"
                isDropdownOpen={false}
                onDropdownToggle={() => {}}
                full
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">Disabled</p>
              <Input placeholder="비활성화 상태" disabled full />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
