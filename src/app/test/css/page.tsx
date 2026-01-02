"use client";

import { useState } from "react";

type TextSize =
  | "4xl"
  | "3xl"
  | "2xl"
  | "xl"
  | "2lg"
  | "lg"
  | "md"
  | "sm"
  | "xs";
type FontWeight = "regular" | "medium" | "semibold" | "bold";
type ColorCategory =
  | "brand"
  | "point"
  | "background"
  | "interaction"
  | "border"
  | "text"
  | "status"
  | "icon";

const textSizes: TextSize[] = [
  "4xl",
  "3xl",
  "2xl",
  "xl",
  "2lg",
  "lg",
  "md",
  "sm",
  "xs",
];
const fontWeights: FontWeight[] = ["regular", "medium", "semibold", "bold"];

const colorCategories: Record<ColorCategory, string[]> = {
  brand: ["primary", "secondary", "tertiary", "gradient"],
  point: ["purple", "blue", "cyan", "pink", "rose", "orange", "yellow"],
  background: ["primary", "secondary", "tertiary", "inverse"],
  interaction: ["inactive", "hover", "pressed", "focus"],
  border: ["primary"],
  text: ["primary", "secondary", "tertiary", "default", "inverse", "disabled"],
  status: ["danger"],
  icon: ["primary", "inverse", "brand"],
};

// CSS 변수 반환 함수
const getColorVariable = (category: string, variant: string) => {
  return `var(--color-${category}-${variant})`;
};

export default function CSSStorybookPage() {
  // Typography
  const [selectedSize, setSelectedSize] = useState<TextSize>("md");
  const [selectedWeight, setSelectedWeight] = useState<FontWeight>("regular");
  const [sampleText, setSampleText] = useState("Typography Sample");

  // Colors
  const [selectedColorCategory, setSelectedColorCategory] =
    useState<ColorCategory>("brand");
  const [selectedColorVariant, setSelectedColorVariant] = useState("primary");

  const currentColorVariants =
    colorCategories[selectedColorCategory as ColorCategory] || [];

  const getTextClass = () => {
    const sizeMap: Record<TextSize, string> = {
      "4xl": "text-4xl",
      "3xl": "text-3xl",
      "2xl": "text-2xl",
      xl: "text-xl",
      "2lg": "text-2lg",
      lg: "text-lg",
      md: "text-md",
      sm: "text-sm",
      xs: "text-xs",
    };

    const weightMap: Record<FontWeight, string> = {
      regular: "font-regular",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    return `${sizeMap[selectedSize]} ${weightMap[selectedWeight]}`;
  };

  // Category 변경 시 Variant가 해당 Category에 없으면 첫 번째 값으로 리셋
  const handleCategoryChange = (newCategory: ColorCategory) => {
    setSelectedColorCategory(newCategory);
    const newVariants = colorCategories[newCategory] || [];
    if (!newVariants.includes(selectedColorVariant)) {
      setSelectedColorVariant(newVariants[0] || "");
    }
  };

  const colorVariable = getColorVariable(
    selectedColorCategory,
    selectedColorVariant
  );
  const isGradient =
    selectedColorCategory === "brand" && selectedColorVariant === "gradient";

  return (
    <div className="min-h-screen bg-[#3f4147] px-6 py-8 text-[#e7ebf2]">
      {/* Typography Storybook */}
      <section className="mb-10">
        <h1 className="mb-6 text-2xl font-bold">Typography Storybook</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* 컨트롤 패널 */}
          <div className="col-span-1 rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold">Props 제어</h3>

            {/* Text */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Text</label>
              <input
                type="text"
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="텍스트 입력"
              />
            </div>

            {/* Size */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as TextSize)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                {textSizes.map((size) => (
                  <option key={size} value={size}>
                    text-{size}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Weight
              </label>
              <select
                value={selectedWeight}
                onChange={(e) =>
                  setSelectedWeight(e.target.value as FontWeight)
                }
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                {fontWeights.map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 미리보기 및 코드 */}
          <div className="col-span-2 space-y-4">
            {/* Preview */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
              <h3 className="mb-6 text-lg font-semibold">Preview</h3>
              <div className="flex min-h-[200px] items-center justify-center rounded bg-[#2a2d32] p-4">
                <p className={getTextClass()}>{sampleText}</p>
              </div>
            </div>

            {/* 코드 표시 */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold">Code</h3>
              <pre className="overflow-auto rounded bg-[#2a2d32] p-3 text-xs text-[#a8b0c0]">
                {`<p className="${getTextClass()}">
  ${sampleText}
</p>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Color Storybook */}
      <section className="mt-12">
        <h1 className="mb-6 text-2xl font-bold">Color Storybook</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* 컨트롤 패널 */}
          <div className="col-span-1 rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold">Props 제어</h3>

            {/* Category */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Category
              </label>
              <select
                value={selectedColorCategory}
                onChange={(e) => {
                  handleCategoryChange(e.target.value as ColorCategory);
                }}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                {Object.keys(colorCategories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Variant */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Variant
              </label>
              <select
                value={selectedColorVariant}
                onChange={(e) => setSelectedColorVariant(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                {currentColorVariants.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 미리보기 및 코드 */}
          <div className="col-span-2 space-y-4">
            {/* Preview */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
              <h3 className="mb-6 text-lg font-semibold">Preview</h3>
              <div className="rounded bg-[#2a2d32] p-4">
                <div className="mb-4 space-y-2">
                  {/* Text Color */}
                  {!isGradient && (
                    <div>
                      <p className="text-xs text-[#a8b0c0] mb-2">Text Color</p>
                      <p
                        className="text-lg font-semibold"
                        style={{ color: colorVariable }}
                      >
                        Sample Text
                      </p>
                    </div>
                  )}

                  {/* Background Color */}
                  <div>
                    <p className="text-xs text-[#a8b0c0] mb-2">
                      Background Color
                    </p>
                    <div
                      className="h-16 rounded flex items-center justify-center text-white text-sm font-semibold"
                      style={{ background: colorVariable }}
                    >
                      Sample
                    </div>
                  </div>

                  {/* Border Color */}
                  {!isGradient && (
                    <div>
                      <p className="text-xs text-[#a8b0c0] mb-2">
                        Border Color
                      </p>
                      <div
                        className="border-2 h-16 rounded flex items-center justify-center text-sm font-semibold"
                        style={{ borderColor: colorVariable }}
                      >
                        Sample
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 코드 표시 */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold">Code</h3>
              <pre className="overflow-auto rounded bg-[#2a2d32] p-3 text-xs text-[#a8b0c0]">
                {isGradient
                  ? `{/* Background Color */}
<div style={{ background: "${colorVariable}" }}>
  Background
</div>`
                  : `{/* Text Color */}
<p style={{ color: "${colorVariable}" }}>
  Text
</p>

{/* Background Color */}
<div style={{ background: "${colorVariable}" }}>
  Background
</div>

{/* Border Color */}
<div style={{ borderColor: "${colorVariable}" }} className="border-2">
  Border
</div>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 전체 텍스트 크기 가이드 */}
      <section className="mt-12 mb-10">
        <h2 className="mb-6 text-2xl font-bold">Text Size Guide</h2>
        <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
          <div className="space-y-4">
            {textSizes.map((size) => (
              <div key={size} className="border-b border-[#7b63a7]/30 pb-4">
                <p className={`text-${size} font-medium mb-1`}>text-{size}</p>
                <p className="text-xs text-[#a8b0c0]">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 전체 컬러 팔레트 */}
      <section className="mt-12 mb-10">
        <h2 className="mb-6 text-2xl font-bold">Color Palette</h2>
        <div className="space-y-8">
          {Object.entries(colorCategories).map(([category, variants]) => (
            <div key={category}>
              <h3 className="mb-4 text-lg font-semibold capitalize">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {variants.map((variant) => {
                  const colorVar = getColorVariable(category, variant);
                  return (
                    <div
                      key={variant}
                      className="rounded-lg border border-[#7b63a7]/50 bg-white/5 p-4"
                    >
                      <div
                        className="h-20 rounded mb-3"
                        style={{ background: colorVar }}
                      />
                      <p className="text-xs text-[#a8b0c0] text-center">
                        {category}-{variant}
                      </p>
                      <p className="text-xs text-[#7b63a7] text-center mt-1">
                        {colorVar}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
