"use client";

import React from "react";
import SVGIcon from "@/app/components/SVGIcon/SVGIcon";

export default function TestPage() {
  return (
    <div className="p-8 bg-background-primary space-y-8">
      <h1 className="text-2xl font-bold">SVGIcon 사용 가이드</h1>

      {/* 기본 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">기본</h2>
        <div className="flex items-center gap-3">
          <SVGIcon icon="check" size="md" />
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            &lt;SVGIcon icon=&quot;check&quot; size=&quot;md&quot; /&gt;
          </code>
        </div>
      </section>

      {/* 사이즈 (이름) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">사이즈 (이름)</h2>
        <div className="flex items-end gap-6">
          <div className="text-center">
            <SVGIcon icon="gear" size="xxs" />
            <p className="text-xs mt-1">xxs</p>
          </div>
          <div className="text-center">
            <SVGIcon icon="gear" size="md" />
            <p className="text-xs mt-1">md</p>
          </div>
          <div className="text-center">
            <SVGIcon icon="gear" size="xxl" />
            <p className="text-xs mt-1">xxl</p>
          </div>
        </div>
        <code className="text-sm bg-gray-100 px-2 py-1 rounded block">
          &lt;SVGIcon icon=&quot;gear&quot; size=&quot;xxs|md|xxl&quot; /&gt;
        </code>
      </section>

      {/* 사이즈 (숫자) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">사이즈 (숫자)</h2>
        <div className="flex items-center gap-3">
          <SVGIcon icon="alert" size={64} />
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            &lt;SVGIcon icon=&quot;alert&quot; size={64} /&gt;
          </code>
        </div>
      </section>

      {/* 색상 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">색상</h2>
        <div className="flex items-center gap-4">
          <SVGIcon icon="user" size="lg" style={{ color: "#3b82f6" }} />
          <SVGIcon icon="user" size="lg" className="text-red-500" />
        </div>
        <code className="text-sm bg-gray-100 px-2 py-1 rounded block">
          &lt;SVGIcon icon=&quot;user&quot; size=&quot;lg&quot;
          style=&#123;&#123; color: &quot;#3b82f6&quot; &#125;&#125; /&gt;
        </code>
        <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-2">
          &lt;SVGIcon icon=&quot;user&quot; size=&quot;lg&quot;
          className=&quot;text-red-500&quot; /&gt;
        </code>
      </section>

      {/* 모든 아이콘 (각 1회) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">모든 아이콘</h2>
        <p className="text-sm text-gray-600">
          각 아이콘을 최소 1회 렌더링합니다.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="alert" size="md" />
            <span className="text-xs text-gray-600">alert</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="arrowLeft" size="md" />
            <span className="text-xs text-gray-600">arrowLeft</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="arrowRight" size="md" />
            <span className="text-xs text-gray-600">arrowRight</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="calendar" size="md" />
            <span className="text-xs text-gray-600">calendar</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="check" size="md" />
            <span className="text-xs text-gray-600">check</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="checkOne" size="md" />
            <span className="text-xs text-gray-600">checkOne</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="checkboxActive" size="md" />
            <span className="text-xs text-gray-600">checkboxActive</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="checkboxDefault" size="md" />
            <span className="text-xs text-gray-600">checkboxDefault</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="comment" size="md" />
            <span className="text-xs text-gray-600">comment</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="done" size="md" />
            <span className="text-xs text-gray-600">done</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="gear" size="md" />
            <span className="text-xs text-gray-600">gear</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="gnbMenu" size="md" />
            <span className="text-xs text-gray-600">gnbMenu</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="iconCalendar" size="md" />
            <span className="text-xs text-gray-600">iconCalendar</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="iconRepeat" size="md" />
            <span className="text-xs text-gray-600">iconRepeat</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="iconTime" size="md" />
            <span className="text-xs text-gray-600">iconTime</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="image" size="md" />
            <span className="text-xs text-gray-600">image</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="img" size="md" />
            <span className="text-xs text-gray-600">img</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="kebabLarge" size="md" />
            <span className="text-xs text-gray-600">kebabLarge</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="kebabSmall" size="md" />
            <span className="text-xs text-gray-600">kebabSmall</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="list" size="md" />
            <span className="text-xs text-gray-600">list</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="plus" size="md" />
            <span className="text-xs text-gray-600">plus</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="progressDone" size="md" />
            <span className="text-xs text-gray-600">progressDone</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="progressOngoing" size="md" />
            <span className="text-xs text-gray-600">progressOngoing</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="repairLarge" size="md" />
            <span className="text-xs text-gray-600">repairLarge</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="repairMedium" size="md" />
            <span className="text-xs text-gray-600">repairMedium</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="repairSmall" size="md" />
            <span className="text-xs text-gray-600">repairSmall</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="time" size="md" />
            <span className="text-xs text-gray-600">time</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="toggle" size="md" />
            <span className="text-xs text-gray-600">toggle</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="user" size="md" />
            <span className="text-xs text-gray-600">user</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="visibilityOff" size="md" />
            <span className="text-xs text-gray-600">visibilityOff</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="visibilityOn" size="md" />
            <span className="text-xs text-gray-600">visibilityOn</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border rounded">
            <SVGIcon icon="x" size="md" />
            <span className="text-xs text-gray-600">x</span>
          </div>
        </div>
      </section>
    </div>
  );
}
