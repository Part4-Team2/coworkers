"use client";

import { useState } from "react";
import Input from "@/components/Common/Input/Input";
import InputBox from "@/components/Common/Input/InputBox";
import Button from "@/components/Common/Button/Button";
import type { InputVariant, InputSize } from "@/components/Common/Input/Input";

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

  // InputBox 커스터마이징
  const [inputBoxValue, setInputBoxValue] = useState("");
  const [inputBoxLabel, setInputBoxLabel] = useState("");
  const [inputBoxPlaceholder, setInputBoxPlaceholder] =
    useState("내용을 입력하세요");
  const [inputBoxMessage, setInputBoxMessage] = useState("");
  const [inputBoxDisabled, setInputBoxDisabled] = useState(false);
  const [inputBoxShowError, setInputBoxShowError] = useState(false);
  const [inputBoxFull, setInputBoxFull] = useState(false);
  const [inputBoxWidth, setInputBoxWidth] = useState("");
  const [inputBoxWidthInput, setInputBoxWidthInput] = useState("");
  const [inputBoxMinHeight, setInputBoxMinHeight] = useState("120px");
  const [inputBoxMaxHeight, setInputBoxMaxHeight] = useState("");

  const applyInputWidth = () => {
    setInputWidth(inputWidthInput);
  };

  const applyInputBoxWidth = () => {
    setInputBoxWidth(inputBoxWidthInput);
  };

  return (
    <div className="min-h-screen bg-[#3f4147] px-6 py-8 text-[#e7ebf2]">
      {/* Input Storybook */}
      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-bold">Input Storybook</h2>

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
                <option value="error">error</option>
              </select>
            </div>

            {/* Size */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Size (large: 460px, small: 332px)
              </label>
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
                Clearable (value: not empty)
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
                Password Toggle (type: password)
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
                    full={inputFull}
                    width={inputWidth}
                  />
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
  onChange={(e) => setValue(e.target.value)}${inputDisabled ? "\n  disabled" : ""}${inputShowError ? "\n  showError" : ""}${inputClearable ? `\n  clearable\n  onClear={() => setValue("")}` : ""}${inputPasswordToggle ? "\n  allowPasswordToggle" : ""}${inputFull ? "\n  full" : ""}${inputWidth ? `\n  width="${inputWidth}"` : ""}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* InputBox Storybook */}
      <section className="mt-12 mb-10">
        <h1 className="mb-6 text-2xl font-bold">InputBox Storybook</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* 컨트롤 패널 */}
          <div className="col-span-1 rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4 max-h-[800px] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold">Props 제어</h3>

            {/* Value */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Value</label>
              <textarea
                value={inputBoxValue}
                onChange={(e) => setInputBoxValue(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="InputBox 값"
                rows={3}
              />
            </div>

            {/* Label */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Label</label>
              <input
                type="text"
                value={inputBoxLabel}
                onChange={(e) => setInputBoxLabel(e.target.value)}
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
                value={inputBoxPlaceholder}
                onChange={(e) => setInputBoxPlaceholder(e.target.value)}
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
                value={inputBoxMessage}
                onChange={(e) => setInputBoxMessage(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="도움말 메시지"
              />
            </div>

            {/* Min Height */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Min Height
              </label>
              <input
                type="text"
                value={inputBoxMinHeight}
                onChange={(e) => setInputBoxMinHeight(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="예: 120px"
              />
            </div>

            {/* Max Height */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Max Height
              </label>
              <input
                type="text"
                value={inputBoxMaxHeight}
                onChange={(e) => setInputBoxMaxHeight(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="예: 300px (비워두면 제한 없음)"
              />
            </div>

            {/* Width */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Custom Width
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputBoxWidthInput}
                  onChange={(e) => setInputBoxWidthInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      applyInputBoxWidth();
                    }
                  }}
                  className="flex-1 rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                  placeholder="예: 400px"
                />
                <button
                  onClick={applyInputBoxWidth}
                  className="rounded bg-brand-primary px-3 py-2 text-xs font-semibold text-white hover:bg-interaction-hover transition-colors"
                >
                  적용
                </button>
              </div>
              {inputBoxWidth && (
                <p className="mt-1 text-xs text-brand-secondary">
                  적용됨: {inputBoxWidth}
                </p>
              )}
            </div>

            {/* Full */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="inputBoxFull"
                checked={inputBoxFull}
                onChange={(e) => setInputBoxFull(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-brand-primary"
              />
              <label
                htmlFor="inputBoxFull"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                Full Width
              </label>
            </div>

            {/* Show Error */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="inputBoxShowError"
                checked={inputBoxShowError}
                onChange={(e) => setInputBoxShowError(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-status-danger"
              />
              <label
                htmlFor="inputBoxShowError"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                Show Error
              </label>
            </div>

            {/* Disabled */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="inputBoxDisabled"
                checked={inputBoxDisabled}
                onChange={(e) => setInputBoxDisabled(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-status-danger"
              />
              <label
                htmlFor="inputBoxDisabled"
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
                  className={`relative ${inputBoxFull ? "w-full" : "inline-block"}`}
                >
                  <InputBox
                    label={inputBoxLabel || undefined}
                    placeholder={inputBoxPlaceholder}
                    message={inputBoxMessage || undefined}
                    value={inputBoxValue}
                    onChange={(e) => setInputBoxValue(e.target.value)}
                    disabled={inputBoxDisabled}
                    showError={inputBoxShowError}
                    full={inputBoxFull}
                    width={inputBoxWidth}
                    minHeight={inputBoxMinHeight}
                    maxHeight={inputBoxMaxHeight || undefined}
                  />
                </div>
              </div>
            </div>

            {/* 코드 표시 */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold">Code</h3>
              <pre className="overflow-auto rounded bg-[#2a2d32] p-3 text-xs text-[#a8b0c0]">
                {`<InputBox
  ${inputBoxLabel ? `label="${inputBoxLabel}"` : ""}
  placeholder="${inputBoxPlaceholder}"${inputBoxMessage ? `\n  message="${inputBoxMessage}"` : ""}
  value={value}
  onChange={(e) => setValue(e.target.value)}${inputBoxDisabled ? "\n  disabled" : ""}${inputBoxShowError ? "\n  showError" : ""}${inputBoxFull ? "\n  full" : ""}${inputBoxWidth ? `\n  width="${inputBoxWidth}"` : ""}${inputBoxMinHeight !== "120px" ? `\n  minHeight="${inputBoxMinHeight}"` : ""}${inputBoxMaxHeight ? `\n  maxHeight="${inputBoxMaxHeight}"` : ""}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 전체 Variant 가이드 */}
      <section className="mt-12 mb-10">
        <h1 className="mb-6 text-4xl font-bold">Input 가이드</h1>
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
              <p className="mb-3 text-sm text-[#a8b0c0]">Disabled</p>
              <Input placeholder="비활성화 상태" disabled full />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">
                Right Element (Button)
              </p>
              <Input
                value="test"
                type="password"
                rightElement={
                  <Button
                    label="검색"
                    variant="solid"
                    size="xSmall"
                    onClick={() => alert("검색 클릭!")}
                  />
                }
                disabled
                full
              />
            </div>
          </div>
        </div>
      </section>

      {/* InputBox 가이드 */}
      <section className="mt-12 mb-10">
        <h2 className="mb-6 text-4xl font-bold">InputBox 가이드</h2>
        <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">
                기본 InputBox (343px)
              </p>
              <InputBox placeholder="내용을 입력하세요" />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">긴 내용 스크롤 예시</p>
              <InputBox
                placeholder="내용을 입력하세요"
                defaultValue="내용이 길면 이 영역 내부에서 스크롤이 발생합니다. 내용이 길면 이 영역 내부에서 스크롤이 발생합니다. 내용이 길면 이 영역 내부에서 스크롤이 발생합니다. 내용이 길면 이 영역 내부에서 스크롤이 발생합니다. 내용이 길면 이 영역 내부에서 스크롤이 발생합니다. 내용이 길면 이 영역 내부에서 스크롤이 발생합니다. 내용이 길면 이 영역 내부에서 스크롤이 발생합니다. 내용이 길면 이 영역 내부에서 스크롤이 발생합니다. 내용이 길면 이 영역 내부에서 스크롤이 발생합니다. 내용이 길면 이 영역 내부에서 스크롤이 발생합니다."
                readOnly
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">
                커스텀 Width (더 작게: 200px)
              </p>
              <InputBox placeholder="내용을 입력하세요" width="200px" />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">
                커스텀 Width (더 크게: 500px)
              </p>
              <InputBox placeholder="내용을 입력하세요" width="500px" />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">Full Width</p>
              <InputBox placeholder="내용을 입력하세요" full />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">에러 상태</p>
              <InputBox
                placeholder="에러 상태"
                message="에러 메시지입니다."
                showError
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-[#a8b0c0]">Disabled</p>
              <InputBox placeholder="비활성화 상태" disabled />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
