"use client";

import Button from "@/components/Common/Button/Button";
import ButtonFloating from "@/components/Common/Button/ButtonFloating";
import { useState } from "react";

type ButtonVariant =
  | "solid"
  | "outlined"
  | "outlinedSecondary"
  | "danger"
  | "gradient"
  | "unselected";
type ButtonSize = "large" | "xSmall";
type ButtonFloatingVariant = "solid" | "outlined";
type ButtonFloatingSize = "large" | "medium";

export default function ButtonStorybookPage() {
  // Button 커스터마이징
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("solid");
  const [buttonSize, setButtonSize] = useState<ButtonSize>("large");
  const [buttonLabel, setButtonLabel] = useState("커스텀 버튼");
  const [buttonFull, setButtonFull] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonWidth, setButtonWidth] = useState("");
  const [buttonWidthInput, setButtonWidthInput] = useState("");

  // ButtonFloating 커스터마이징
  const [floatingVariant, setFloatingVariant] =
    useState<ButtonFloatingVariant>("solid");
  const [floatingSize, setFloatingSize] = useState<ButtonFloatingSize>("large");
  const [floatingLabel, setFloatingLabel] = useState("플로팅 버튼");
  const [floatingFull, setFloatingFull] = useState(false);
  const [floatingDisabled, setFloatingDisabled] = useState(false);
  const [floatingWidth, setFloatingWidth] = useState("");
  const [floatingWidthInput, setFloatingWidthInput] = useState("");

  const handleButtonClick = () => {};

  const handleFloatingClick = () => {};

  const applyButtonWidth = () => {
    setButtonWidth(buttonWidthInput);
  };

  const applyFloatingWidth = () => {
    setFloatingWidth(floatingWidthInput);
  };

  return (
    <div className="min-h-screen bg-[#3f4147] px-6 py-8 text-[#e7ebf2]">
      {/* Button */}
      <section className="mb-10">
        <h1 className="mb-6 text-2xl font-bold">Button </h1>

        <div className="grid grid-cols-3 gap-6">
          {/* 컨트롤 패널 */}
          <div className="col-span-1 rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold">Props 제어</h3>

            {/* Label */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Label</label>
              <input
                type="text"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="버튼 텍스트"
              />
            </div>

            {/* Variant */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Variant
              </label>
              <select
                value={buttonVariant}
                onChange={(e) =>
                  setButtonVariant(e.target.value as ButtonVariant)
                }
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                <option value="solid">solid</option>
                <option value="outlined">outlined</option>
                <option value="outlinedSecondary">outlinedSecondary</option>
                <option value="danger">danger</option>
                <option value="gradient">gradient</option>
                <option value="unselected">unselected</option>
              </select>
            </div>

            {/* Size */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Size (large: 332px, xSmall: 74px)
              </label>
              <select
                value={buttonSize}
                onChange={(e) => setButtonSize(e.target.value as ButtonSize)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                <option value="large">large</option>
                <option value="xSmall">xSmall</option>
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
                  value={buttonWidthInput}
                  onChange={(e) => setButtonWidthInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      applyButtonWidth();
                    }
                  }}
                  className="flex-1 rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                  placeholder="예: 400px"
                />
                <button
                  onClick={applyButtonWidth}
                  className="rounded bg-brand-primary px-3 py-2 text-xs font-semibold text-white hover:bg-interaction-hover transition-colors"
                >
                  적용
                </button>
              </div>
              {buttonWidth && (
                <p className="mt-1 text-xs text-brand-secondary">
                  적용됨: {buttonWidth}
                </p>
              )}
            </div>

            {/* Full */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="buttonFull"
                checked={buttonFull}
                onChange={(e) => setButtonFull(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-brand-primary"
              />
              <label
                htmlFor="buttonFull"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                Full Width
              </label>
            </div>

            {/* Disabled */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="buttonDisabled"
                checked={buttonDisabled}
                onChange={(e) => setButtonDisabled(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-status-danger"
              />
              <label
                htmlFor="buttonDisabled"
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
              <h3 className="mb-4 text-lg font-semibold">Preview</h3>
              <div className="flex min-h-[100px] items-center justify-center rounded bg-[#2a2d32] p-4">
                <Button
                  label={buttonLabel}
                  variant={buttonVariant}
                  size={buttonSize}
                  full={buttonFull}
                  width={buttonWidth || undefined}
                  disabled={buttonDisabled}
                  onClick={handleButtonClick}
                />
              </div>
            </div>

            {/* 코드 표시 */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold">Code</h3>
              <pre className="overflow-auto rounded bg-[#2a2d32] p-3 text-xs text-[#a8b0c0]">
                {`<Button
  label="${buttonLabel}"
  variant="${buttonVariant}"
  size="${buttonSize}"
  ${buttonFull ? "full" : ""}
  ${buttonWidth ? `width="${buttonWidth}"` : ""}
  ${buttonDisabled ? "disabled" : ""}
  onClick={handleClick}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ButtonFloating */}
      <section className="mt-12">
        <h1 className="mb-6 text-2xl font-bold">ButtonFloating </h1>

        <div className="grid grid-cols-3 gap-6">
          {/* 컨트롤 패널 */}
          <div className="col-span-1 rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold">Props 제어</h3>

            {/* Label */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Label</label>
              <input
                type="text"
                value={floatingLabel}
                onChange={(e) => setFloatingLabel(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="버튼 텍스트"
              />
            </div>

            {/* Variant */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Variant
              </label>
              <select
                value={floatingVariant}
                onChange={(e) =>
                  setFloatingVariant(e.target.value as ButtonFloatingVariant)
                }
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                <option value="solid">solid</option>
                <option value="outlined">outlined</option>
              </select>
            </div>

            {/* Size */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Size (large: 83px, medium: 69px)
              </label>
              <select
                value={floatingSize}
                onChange={(e) =>
                  setFloatingSize(e.target.value as ButtonFloatingSize)
                }
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                <option value="large">large</option>
                <option value="medium">medium</option>
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
                  value={floatingWidthInput}
                  onChange={(e) => setFloatingWidthInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      applyFloatingWidth();
                    }
                  }}
                  className="flex-1 rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                  placeholder="예: 400px"
                />
                <button
                  onClick={applyFloatingWidth}
                  className="rounded bg-brand-primary px-3 py-2 text-xs font-semibold text-white hover:bg-interaction-hover transition-colors"
                >
                  적용
                </button>
              </div>
              {floatingWidth && (
                <p className="mt-1 text-xs text-brand-secondary">
                  적용됨: {floatingWidth}
                </p>
              )}
            </div>

            {/* Full */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="floatingFull"
                checked={floatingFull}
                onChange={(e) => setFloatingFull(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-brand-primary"
              />
              <label
                htmlFor="floatingFull"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                Full Width
              </label>
            </div>

            {/* Disabled */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="floatingDisabled"
                checked={floatingDisabled}
                onChange={(e) => setFloatingDisabled(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-status-danger"
              />
              <label
                htmlFor="floatingDisabled"
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
              <h3 className="mb-4 text-lg font-semibold">Preview</h3>
              <div className="flex min-h-[100px] items-center justify-center rounded bg-[#2a2d32] p-4">
                <ButtonFloating
                  label={floatingLabel}
                  variant={floatingVariant}
                  size={floatingSize}
                  full={floatingFull}
                  width={floatingWidth || undefined}
                  disabled={floatingDisabled}
                  onClick={handleFloatingClick}
                />
              </div>
            </div>

            {/* 코드 표시 */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold">Code</h3>
              <pre className="overflow-auto rounded bg-[#2a2d32] p-3 text-xs text-[#a8b0c0]">
                {`<ButtonFloating
  label="${floatingLabel}"
  variant="${floatingVariant}"
  size="${floatingSize}"
  ${floatingFull ? "full" : ""}
  ${floatingWidth ? `width="${floatingWidth}"` : ""}
  ${floatingDisabled ? "disabled" : ""}
  onClick={handleClick}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Button 가이드 */}
      <section className="mt-12 mb-10">
        <h2 className="mb-6 text-2xl font-bold">Button Guide</h2>

        {/* Variant Guide */}
        <div className="mb-10">
          <h3 className="mb-4 text-xl font-semibold">Variant Guide</h3>
          <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
            {/* Large Size Variants */}
            <div className="mb-8">
              <h4 className="mb-4 text-lg font-medium text-[#a8b0c0]">
                Size: large
              </h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">solid</p>
                  <Button label="Solid 버튼" variant="solid" size="large" />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">outlined</p>
                  <Button
                    label="Outlined 버튼"
                    variant="outlined"
                    size="large"
                  />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">
                    outlinedSecondary
                  </p>
                  <Button
                    label="Outlined Secondary"
                    variant="outlinedSecondary"
                    size="large"
                  />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">danger</p>
                  <Button label="Danger 버튼" variant="danger" size="large" />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">gradient</p>
                  <Button
                    label="Gradient 버튼"
                    variant="gradient"
                    size="large"
                  />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">unselected</p>
                  <Button
                    label="Unselected 버튼"
                    variant="unselected"
                    size="large"
                  />
                </div>
              </div>
            </div>

            {/* xSmall Size Variants */}
            <div>
              <h4 className="mb-4 text-lg font-medium text-[#a8b0c0]">
                Size: xSmall
              </h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">solid</p>
                  <Button label="Solid" variant="solid" size="xSmall" />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">outlined</p>
                  <Button label="Outlined" variant="outlined" size="xSmall" />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">
                    outlinedSecondary
                  </p>
                  <Button
                    label="Outlined Sec"
                    variant="outlinedSecondary"
                    size="xSmall"
                  />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">danger</p>
                  <Button label="Danger" variant="danger" size="xSmall" />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">gradient</p>
                  <Button label="Gradient" variant="gradient" size="xSmall" />
                </div>
                <div>
                  <p className="mb-3 text-sm text-[#a8b0c0]">unselected</p>
                  <Button
                    label="Unselected"
                    variant="unselected"
                    size="xSmall"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Size Guide */}
        <div className="mb-10">
          <h3 className="mb-4 text-xl font-semibold">Size Guide</h3>
          <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
            <div className="space-y-4">
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">
                  large (최소 332px)
                </p>
                <Button label="Large 버튼" size="large" />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">
                  xSmall (최소 74px)
                </p>
                <Button label="xSmall 버튼" size="xSmall" />
              </div>
            </div>
          </div>
        </div>

        {/* 특수 기능 */}
        <div className="mb-10">
          <h3 className="mb-4 text-xl font-semibold">특수 기능</h3>
          <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">Full Width</p>
                <Button label="Full Width 버튼" full />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">
                  Custom Width (더 작게: 200px)
                </p>
                <Button label="Custom Width" width="200px" />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">
                  Custom Width (더 크게: 500px)
                </p>
                <Button label="Custom Width" width="500px" />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">Disabled</p>
                <Button label="Disabled 버튼" disabled />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">
                  텍스트 길이에 따른 자동 크기 조절
                </p>
                <Button label="짧은 텍스트" />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">긴 텍스트 예시</p>
                <Button label="이것은 매우 긴 버튼 텍스트입니다" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ButtonFloating 가이드 */}
      <section className="mt-12 mb-10">
        <h2 className="mb-6 text-2xl font-bold">ButtonFloating Guide</h2>

        {/* Variant Guide */}
        <div className="mb-10">
          <h3 className="mb-4 text-xl font-semibold">Variant Guide</h3>
          <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">solid</p>
                <ButtonFloating label="Solid 버튼" variant="solid" />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">outlined</p>
                <ButtonFloating label="Outlined 버튼" variant="outlined" />
              </div>
            </div>
          </div>
        </div>

        {/* Size Guide */}
        <div className="mb-10">
          <h3 className="mb-4 text-xl font-semibold">Size Guide</h3>
          <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
            <div className="space-y-4">
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">large (최소 83px)</p>
                <ButtonFloating label="Large 버튼" size="large" />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">
                  medium (최소 69px)
                </p>
                <ButtonFloating label="Medium 버튼" size="medium" />
              </div>
            </div>
          </div>
        </div>

        {/* 특수 기능 */}
        <div className="mb-10">
          <h3 className="mb-4 text-xl font-semibold">특수 기능</h3>
          <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">Full Width</p>
                <ButtonFloating label="Full Width 버튼" full />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">
                  Custom Width (더 작게: 100px)
                </p>
                <ButtonFloating label="Custom" width="100px" />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">
                  Custom Width (더 크게: 300px)
                </p>
                <ButtonFloating label="Custom Width" width="300px" />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">Disabled</p>
                <ButtonFloating label="Disabled 버튼" disabled />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">With Icon</p>
                <ButtonFloating label="아이콘 버튼" icon="+" />
              </div>
              <div>
                <p className="mb-3 text-sm text-[#a8b0c0]">
                  텍스트 길이에 따른 자동 크기 조절
                </p>
                <ButtonFloating label="긴 텍스트 버튼 예시" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
