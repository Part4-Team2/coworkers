"use client";

import Avatar from "@/app/components/Avatar/Avatar";
import { useState } from "react";

const AVATAR_SIZE_MAP = {
  small: 24,
  large: 32,
  xlarge: 64,
} as const;

type AvatarSize = keyof typeof AVATAR_SIZE_MAP;

export default function AvatarStorybookPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("사용자 프로필");
  const [size, setSize] = useState<AvatarSize>("xlarge");
  const [isEditable, setIsEditable] = useState(false);

  const handleEditClick = () => {
    alert("아바타 편집 클릭!");
  };

  const sampleImages = [
    "",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  ];

  return (
    <div className="min-h-screen bg-[#3f4147] px-6 py-8 text-[#e7ebf2]">
      <section className="mb-10">
        <h1 className="mb-6 text-2xl font-bold">Avatar Component</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* 컨트롤 패널 */}
          <div className="col-span-1 rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold">Props 제어</h3>

            {/* Image URL */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="이미지 URL 입력"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {sampleImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageUrl(url)}
                    className="rounded bg-[#2a2d32] px-2 py-1 text-xs text-[#a8b0c0] hover:bg-brand-primary hover:text-white transition-colors"
                  >
                    {idx === 0 ? "없음" : `샘플 ${idx}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Alt Text */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Alt Text
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full rounded bg-[#2a2d32] px-3 py-2 text-sm text-white outline-none"
                placeholder="대체 텍스트"
              />
            </div>

            {/* Size */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#a8b0c0]">
                Size: {size} ({AVATAR_SIZE_MAP[size]}px)
              </label>
              <div className="flex gap-2">
                {(Object.keys(AVATAR_SIZE_MAP) as AvatarSize[]).map(
                  (sizeKey) => (
                    <button
                      key={sizeKey}
                      onClick={() => setSize(sizeKey)}
                      className={`flex-1 rounded px-3 py-2 text-sm transition-colors ${
                        size === sizeKey
                          ? "bg-brand-primary text-white"
                          : "bg-[#2a2d32] text-[#a8b0c0] hover:bg-brand-primary hover:text-white"
                      }`}
                    >
                      {sizeKey}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Is Editable */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isEditable"
                checked={isEditable}
                onChange={(e) => setIsEditable(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-brand-primary"
              />
              <label
                htmlFor="isEditable"
                className="cursor-pointer text-sm text-[#a8b0c0]"
              >
                편집 가능 (연필 아이콘 표시)
              </label>
            </div>
          </div>

          {/* 미리보기 및 코드 */}
          <div className="col-span-2 space-y-4">
            {/* Preview */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-semibold">Preview</h3>
              <div className="flex min-h-[150px] items-center justify-center rounded bg-[#2a2d32] p-4">
                <Avatar
                  imageUrl={imageUrl || undefined}
                  altText={altText}
                  size={size}
                  isEditable={isEditable}
                  onEditClick={handleEditClick}
                />
              </div>
            </div>

            {/* 코드 표시 */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold">Code</h3>
              <pre className="overflow-auto rounded bg-[#2a2d32] p-3 text-xs text-[#a8b0c0]">
                {`<Avatar
  ${imageUrl ? `imageUrl="${imageUrl}"` : "// imageUrl 없음 → 기본 아이콘 표시"}
  altText="${altText}"
  size="${size}"
  ${
    isEditable
      ? `isEditable={true}
  onEditClick={handleEditClick}`
      : "// 편집 불가능"
  }
/>`}
              </pre>
            </div>

            {/* 사용 예시 */}
            <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold">모든 크기 비교</h3>
              <div className="flex items-end gap-6 rounded bg-[#2a2d32] p-6">
                {(Object.keys(AVATAR_SIZE_MAP) as AvatarSize[]).map(
                  (sizeKey) => (
                    <div key={sizeKey} className="text-center">
                      <Avatar
                        imageUrl={imageUrl || undefined}
                        altText={`${sizeKey} 크기`}
                        size={sizeKey}
                        isEditable={isEditable}
                        onEditClick={handleEditClick}
                      />
                      <p className="mt-2 text-xs text-[#a8b0c0]">
                        {sizeKey}
                        <br />({AVATAR_SIZE_MAP[sizeKey]}px)
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Props 설명 */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Props 설명</h2>
        <div className="overflow-hidden rounded-lg border border-dashed border-[#7b63a7] bg-white/5">
          <table className="w-full text-sm">
            <thead className="bg-[#2a2d32]">
              <tr>
                <th className="px-4 py-3 text-left text-[#a8b0c0]">Prop</th>
                <th className="px-4 py-3 text-left text-[#a8b0c0]">Type</th>
                <th className="px-4 py-3 text-left text-[#a8b0c0]">Default</th>
                <th className="px-4 py-3 text-left text-[#a8b0c0]">설명</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3f4147]">
              <tr>
                <td className="px-4 py-3 font-mono text-brand-secondary">
                  imageUrl
                </td>
                <td className="px-4 py-3 text-[#a8b0c0]">string?</td>
                <td className="px-4 py-3 text-[#a8b0c0]">-</td>
                <td className="px-4 py-3 text-[#a8b0c0]">
                  프로필 이미지 URL (없으면 기본 아이콘 표시)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-brand-secondary">
                  altText
                </td>
                <td className="px-4 py-3 text-[#a8b0c0]">string</td>
                <td className="px-4 py-3 text-[#a8b0c0]">{"사용자 프로필"}</td>
                <td className="px-4 py-3 text-[#a8b0c0]">이미지 대체 텍스트</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-brand-secondary">
                  size
                </td>
                <td className="px-4 py-3 text-[#a8b0c0]">
                  {"'small' | 'large' | 'xlarge'"}
                </td>
                <td className="px-4 py-3 text-[#a8b0c0]">{"'xlarge'"}</td>
                <td className="px-4 py-3 text-[#a8b0c0]">
                  아바타 크기 (small: 24px, large: 32px, xlarge: 64px)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-brand-secondary">
                  isEditable
                </td>
                <td className="px-4 py-3 text-[#a8b0c0]">boolean?</td>
                <td className="px-4 py-3 text-[#a8b0c0]">false</td>
                <td className="px-4 py-3 text-[#a8b0c0]">
                  편집 가능 여부 (연필 아이콘 표시)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-brand-secondary">
                  onEditClick
                </td>
                <td className="px-4 py-3 text-[#a8b0c0]">() =&gt; void</td>
                <td className="px-4 py-3 text-[#a8b0c0]">-</td>
                <td className="px-4 py-3 text-[#a8b0c0]">
                  편집 버튼 클릭 핸들러
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 디자인 노트 */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold">디자인 노트</h2>
        <div className="rounded-lg border border-dashed border-[#7b63a7] bg-white/5 p-4">
          <ul className="space-y-2 text-sm text-[#a8b0c0]">
            <li>• 아바타는 항상 원형(rounded-full)입니다</li>
            <li>• 이미지가 없을 때 기본 image 아이콘이 표시됩니다</li>
            <li>
              • isEditable이 true일 때 아바타 전체가 클릭 가능한 버튼이 됩니다
            </li>
            <li>
              • 연필 아이콘은 고정 크기(파일 크기)로 오른쪽 하단에 표시됩니다
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
