"use client";

import SVGIcon from "@/app/components/SVGIcon/SVGIcon";
import { IconMap, IconSizes } from "@/app/components/SVGIcon/iconMap";
import type {
  IconMapTypes,
  IconSizeTypes,
} from "@/app/components/SVGIcon/iconMap";
import { useState } from "react";

type IconNameType = IconMapTypes;
type IconSizeNameType = IconSizeTypes;

const iconNames = Object.keys(IconMap) as IconNameType[];
const sizeNames = Object.keys(IconSizes) as IconSizeNameType[];

export default function IconStorybookPage() {
  const [selectedIcon, setSelectedIcon] = useState<IconNameType>("check");
  const [selectedSize, setSelectedSize] = useState<IconSizeNameType>("md");
  const [customSize, setCustomSize] = useState<string>("");

  return (
    <div className="min-h-screen bg-[#3f4147] px-6 py-8 text-[#e7ebf2]">
      {/* Icon  */}
      <section className="mb-10">
        <h1 className="mb-6 text-2xl font-bold">SVGIcon Storybook</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* 컨트롤 패널 */}
          <div className="col-span-1 rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold">Props 제어</h3>

            {/* Icon Name */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">Icon</label>
              <select
                value={selectedIcon}
                onChange={(e) =>
                  setSelectedIcon(e.target.value as IconNameType)
                }
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                {iconNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size (Named) */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Size (Named)
              </label>
              <select
                value={selectedSize}
                onChange={(e) =>
                  setSelectedSize(e.target.value as IconSizeNameType)
                }
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
              >
                {sizeNames.map((name) => (
                  <option key={name} value={name}>
                    {name} ({IconSizes[name]}px)
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Size (Numeric) */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Custom Size (숫자)
              </label>
              <input
                type="number"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="예: 64"
                min="8"
                max="256"
              />
              {customSize && (
                <p className="mt-1 text-xs text-brand-secondary">
                  적용: {customSize}px
                </p>
              )}
            </div>
          </div>

          {/* 미리보기 및 코드 */}
          <div className="col-span-2 space-y-4">
            {/* Preview */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
              <h3 className="mb-6 text-lg font-semibold">Preview</h3>
              <div className="flex min-h-[200px] items-center justify-center rounded bg-[#2a2d32] p-4">
                <SVGIcon
                  icon={selectedIcon}
                  size={
                    customSize ? (Number(customSize) as number) : selectedSize
                  }
                />
              </div>
            </div>

            {/* 코드 표시 */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold">Code</h3>
              <pre className="overflow-auto rounded bg-[#2a2d32] p-3 text-xs text-[#a8b0c0]">
                {`<SVGIcon
  icon="${selectedIcon}"
  size=${customSize ? `{${customSize}}` : `"${selectedSize}"`}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 아이콘 전체 가이드 */}
      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">전체 아이콘 목록</h2>
        <div className="grid grid-cols-4 gap-4 rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {iconNames.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 rounded border border-[#7b63a7]/50 bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setSelectedIcon(name)}
              title={`클릭하면 선택됩니다: ${name}`}
            >
              <SVGIcon icon={name} size="md" />
              <span className="text-xs text-[#a8b0c0] text-center break-words">
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 사이즈 가이드 */}
      <section className="mt-12 mb-10">
        <h2 className="mb-6 text-2xl font-bold">사이즈 가이드</h2>
        <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {sizeNames.map((name) => (
              <div key={name} className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center rounded bg-[#2a2d32] p-4">
                  <SVGIcon icon="check" size={name} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-[#a8b0c0]">{IconSizes[name]}px</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
