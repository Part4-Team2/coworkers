## API 및 에러 처리 가이드

### 📁 파일 구조

```
src/
├── lib/
│   ├── api/
│   │   ├── group.ts          # ✅ 리팩토링 완료 (예시)
│   │   └── ...               # 🔄 리팩토링 예정
│   └── types/
│       └── api.ts            # API 공통 타입
├── utils/
│   ├── error.ts              # 에러 처리 유틸리티 (Toast 함수, TOAST_DEFAULT_CONFIG)
│   └── pendingToast.ts       # 페이지 이동 간 토스트 (displayPendingToast 헬퍼)
├── providers/
│   ├── ToastProvider.tsx     # Toast 전역 설정 (dark theme, bottom-center)
│   └── StoreHydrationProvider.tsx  # Zustand persist hydration 전역 트리거
├── components/
│   └── Common/
│       └── Loading/
│           └── Loading.tsx   # 공통 로딩 컴포넌트
└── app/
    ├── layout.tsx            # StoreHydrationProvider 적용
    ├── loading.tsx           # 공통 Loading 컴포넌트 사용
    └── global-error.tsx      # 앱 레벨 에러 (최후 방어선)
```

---

## 🔧 핵심 패턴

### 1. API 함수 작성 (Server Action)

**파일: `src/lib/api/example.ts`**

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";
import { ApiResult } from "@/lib/types/api";

// 응답 타입 정의
export type ExampleResponse = {
  id: number;
  name: string;
  createdAt: string;
};

/**
 * 예시 데이터 조회
 */
export async function getExample(
  id: string
): Promise<ApiResult<ExampleResponse>> {
  try {
    const response = await fetchApi(`${BASE_URL}/examples/${id}`, {
      next: { tags: [`example-${id}`] },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "데이터를 가져오는데 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "데이터를 가져오는데 실패했습니다.",
        code: error.code,
      };
    }

    const data = (await response.json()) as ExampleResponse;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 예시 데이터 생성/수정
 */
export async function createExample(
  name: string
): Promise<ApiResult<ExampleResponse>> {
  try {
    const response = await fetchApi(`${BASE_URL}/examples`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "생성에 실패했습니다.",
      }));
      return {
        success: false,
        error: error.message || "생성에 실패했습니다.",
        code: error.code,
      };
    }

    const data = (await response.json()) as ExampleResponse;
    revalidatePath("/examples"); // 캐시 무효화
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
    };
  }
}
```

---

### 2. Client에서 API 호출 및 Toast 사용

#### 2.1. 같은 페이지에서 Toast 표시

```typescript
import { createExample } from "@/lib/api/example";
import { showSuccessToast, showErrorToast } from "@/utils/error";

const handleSubmit = async (data: FormData) => {
  const result = await createExample(data);

  if (result.success) {
    showSuccessToast("생성되었습니다!");
  } else {
    showErrorToast(result.error);
  }
};
```

#### 2.2. 페이지 이동 후 Toast 표시

```typescript
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setPendingToast, displayPendingToast } from "@/utils/pendingToast";
import { showErrorToast } from "@/utils/error";

// 페이지 마운트 시 pending 토스트 표시
useEffect(() => {
  displayPendingToast();
}, []);

const handleUpdate = async (data: FormData) => {
  const result = await updateExample(data);

  if (result.success) {
    setPendingToast("success", "수정되었습니다!");
    router.push("/list");
  } else {
    showErrorToast(result.error);
  }
};
```

**패턴 설명:**

- `setPendingToast()`: 페이지 이동 **전에** 메시지 저장 (sessionStorage)
- `displayPendingToast()`: 새 페이지 마운트 시 저장된 메시지 표시 및 자동 삭제
- 페이지 이동 없이 즉시 표시할 때는 `showSuccessToast()` 등 직접 호출

---

### 3. Zustand Persist Hydration 처리

#### 전역 Hydration (권장)

**이미 `app/layout.tsx`에 적용됨:**

```typescript
// src/app/layout.tsx
import StoreHydrationProvider from "@/providers/StoreHydrationProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <StoreHydrationProvider>
          <ToastProvider />
          <Header />
          {children}
        </StoreHydrationProvider>
      </body>
    </html>
  );
}
```

#### Container에서 Hydration 체크

**패턴 1: 서버에서 데이터를 받는 페이지 (TeamIdContainer)**

```typescript
// 서버에서 props로 모든 데이터를 받는 경우
// isHydrated 체크 불필요 - 바로 렌더링
export default function TeamIdContainer({ teamId, teamName, members, taskLists }: Props) {
  const teams = useHeaderStore((state) => state.teams);
  const currentTeam = useMemo(
    () => teams.find((team) => team.teamId === teamId),
    [teams, teamId]
  );

  // role은 기본값으로 처리 가능
  const userRole = (currentTeam?.role as "ADMIN" | "MEMBER") || "MEMBER";

  // 바로 렌더링 - loading.tsx에서 자연스럽게 전환
  return <div>{/* 컨텐츠 */}</div>;
}
```

**패턴 2: Store 데이터가 필수인 페이지 (EditTeamContainer)**

```typescript
// Store 데이터가 필수이고 서버에서 데이터를 받지 않는 경우
export default function EditTeamContainer({ teamId }: Props) {
  const teams = useHeaderStore((state) => state.teams);
  const isHydrated = useHeaderStore((state) => state.isHydrated);

  const currentTeam = useMemo(
    () => teams.find((team) => team.teamId === teamId),
    [teams, teamId]
  );

  const { reset } = useForm<FormData>({
    defaultValues: {
      teamName: currentTeam?.teamName || "",
    },
  });

  // Hydration 완료 후에만 체크
  useEffect(() => {
    if (isHydrated && !currentTeam) {
      showErrorToast("팀 정보를 찾을 수 없습니다. 팀 목록에서 다시 선택해주세요.");
      router.push("/teamlist");
    }
  }, [isHydrated, currentTeam, router]);

  // currentTeam이 업데이트되면 form 값 초기화
  useEffect(() => {
    if (currentTeam) {
      reset({
        teamName: currentTeam.teamName,
      });
    }
  }, [currentTeam, reset]);

  // 데이터가 없어도 일단 렌더링 (useEffect가 리다이렉트 처리)
  return <div>{/* 컨텐츠 */}</div>;
}
```

**중요:**

- `StoreHydrationProvider`가 전역에서 hydration을 처리하므로 개별 컴포넌트에서 `rehydrate()` 호출 불필요
- 서버 데이터를 받는 페이지는 isHydrated 체크 불필요 (깜빡임 방지)
- Store 데이터가 필수인 페이지만 isHydrated 체크 (hydration 후 에러 처리)

---

### 4. 에러 타입 체크

```typescript
import { isAppError, AppError } from "@/utils/error";

try {
  // API 호출
} catch (error) {
  if (isAppError(error)) {
    // AppError 전용 처리 (code, status 접근 가능)
    console.log(error.code, error.status);
  }
  showErrorToast(error);
}
```

---

## 📋 에러 처리 전략

1. **API 레벨** - `ApiResult<T>` 반환, 에러를 객체로 반환
2. **Container 레벨** - Toast로 사용자 피드백
3. **Page 레벨** - Error Boundary로 렌더링 에러 처리 (필요시)
4. **Global 레벨** - global-error.tsx로 앱 크래시 최후 방어선

**Toast 설정:**

- Theme: `dark`
- Position: `bottom-center`
- Config: `TOAST_DEFAULT_CONFIG` (utils/error.ts에서 export)

---

## 🔄 API 리팩토링 가이드

**완료**: `group.ts` ✅  
**진행 예정**: `auth.ts`, `user.ts`, `task.ts`, `tasklist.ts` 등

**체크리스트:**

- [ ] `ApiResult<T>` 타입 사용
- [ ] try-catch로 모든 에러 처리
- [ ] 의미 있는 에러 메시지 반환
- [ ] `revalidatePath` 또는 `revalidateTag`로 캐시 무효화
- [ ] 성공 시 `{ success: true, data }`, 실패 시 `{ success: false, error }` 반환

---

## 🎯 주요 유틸리티

### utils/error.ts

- `showSuccessToast()`, `showErrorToast()`, `showInfoToast()`
- `TOAST_DEFAULT_CONFIG` - 공통 Toast 설정
- `isAppError()` - 타입 가드 함수

### utils/pendingToast.ts

- `setPendingToast()` - 페이지 이동 전 메시지 저장
- `displayPendingToast()` - 페이지 마운트 시 메시지 표시 (한 줄로 처리)

### components/Common/Loading/Loading.tsx

- 앱 전체에서 사용하는 공통 로딩 UI
- `app/loading.tsx`에서도 재사용
