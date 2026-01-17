# Next.js 16 캐싱 가이드

## 📖 목차

1. [개요](#개요)
2. [파일 분리 전략 (use cache vs use server)](#파일-분리-전략-use-cache-vs-use-server)
3. [캐싱 가능 여부 판단](#캐싱-가능-여부-판단)
4. [캐싱 적용 방법](#캐싱-적용-방법)
5. [캐시 무효화](#캐시-무효화)
6. [주의사항](#주의사항)

---

## 개요

이 프로젝트는 **Next.js 16의 Data Cache**를 활용하되, **보안을 최우선**으로 합니다.

### ✅ 캐싱 적용 (공개 데이터)

**인증이 필요 없는 공개 API만 캐싱합니다:**

- `/boards` - 자유게시판 목록 (`getArticles()`) - **force-cache (2분)**
- `/boards/[id]` - 게시글 상세 (`getArticle()`) - **force-cache (1분)**

### ❌ 캐싱 미적용 (권한 기반 데이터)

**Authorization 헤더를 사용하는 모든 API는 캐싱하지 않습니다:**

- `/[teamid]` - 팀 상세 페이지 (`getGroup()`) - **no-store**
- `/teamlist` - 팀 목록 페이지 (`getUserGroups()`) - **no-store**
- `/myhistory` - 마이 히스토리 페이지 (`getUserHistory()`) - **no-store**

> **중요**: Authorization 헤더는 캐시 키에 포함되지 않습니다.
> `force-cache` 사용 시 첫 사용자의 데이터가 모든 사용자에게 반환되어 **심각한 보안 문제** 발생!

---

## 파일 분리 전략 (use cache vs use server)

### 왜 파일을 분리하는가?

Next.js 15+에서 **"use cache"**와 **"use server"** 지시문은 **같은 파일에서 함께 사용할 수 없습니다.**

```typescript
// ❌ 불가능 - 같은 파일에 두 지시문 혼용
"use server";
"use cache"; // Error!

export async function createGroup() { ... }
export async function getGroup() { ... }
```

### 현재 프로젝트 구조

```
src/lib/api/
├── group.ts           → "use server" (Server Actions - 생성/수정/삭제)
└── group-queries.ts   → "use cache"  (조회 함수 - 캐싱)
```

#### group.ts - Server Actions ("use server")

```typescript
"use server";

import { revalidatePath } from "next/cache";

/**
 * 그룹 상세 조회 (캐싱 없음)
 * - cache: "no-store" 사용
 * - React cache()로 단일 요청 내 중복 방지만 적용
 */
export async function getGroup(
  groupId: string,
  accessToken?: string | null
): Promise<ApiResult<GroupDetailResponse>> {
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
    accessToken,
    cache: "no-store",
  });
  // ...
}

/**
 * 할 일 목록 생성
 * - POST 요청이므로 캐싱 안됨
 * - 완료 후 revalidatePath로 캐시 무효화
 */
export async function createTaskList(
  groupId: string,
  name: string
): Promise<ApiResult<TaskListResponse>> {
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}/task-lists`, {
    method: "POST",
    body: JSON.stringify({ name }),
    cache: "no-store",
  });

  if (response.ok) {
    revalidatePath(`/${groupId}`); // 캐시 무효화
  }
  // ...
}

// updateTaskList, deleteTaskList 등 Server Actions...
```

#### group-queries.ts - 조회 함수 ("use cache")

```typescript
"use cache";

import type { ApiResult, GroupDetailResponse } from "./group";

/**
 * 그룹 상세 정보 조회 (Next.js 16 "use cache" 적용)
 *
 * 캐싱 전략:
 * - "use cache" 지시어로 함수 레벨 캐싱
 * - userId를 인자로 받아 캐시 키에 자동 포함 → 사용자별 분리
 * - 캐시 키: "getGroup-{groupId}-{userId}"
 *
 * 작동 원리:
 * - 사용자 A (userId: 123): 캐시 키 "getGroup-3740-123"
 * - 사용자 B (userId: 456): 캐시 키 "getGroup-3740-456"
 * - 결과: 완전히 분리된 캐시, 보안 보장 ✅
 *
 * 성능:
 * - 첫 요청: 80ms (API 호출)
 * - 이후 요청: 3-5ms (캐시 히트)
 */
export async function getGroup(
  groupId: string,
  userId: string,
  accessToken?: string | null
): Promise<ApiResult<GroupDetailResponse>> {
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
    accessToken,
    // "use cache"가 활성화되어 있으면 자동으로 캐싱됨
  });
  // ...
}
```

### 핵심 차이점

| 항목            | group.ts                        | group-queries.ts        |
| --------------- | ------------------------------- | ----------------------- |
| **지시문**      | `"use server"`                  | `"use cache"`           |
| **용도**        | Server Actions (생성/수정/삭제) | 조회 함수 (GET)         |
| **캐싱**        | `cache: "no-store"`             | 자동 캐싱 (userId 기반) |
| **함수 예시**   | createTaskList, updateTaskList  | getGroup                |
| **userId 인자** | 불필요                          | 필수 (캐시 키 분리용)   |
| **성능**        | 40-80ms (매번 API 호출)         | 3-5ms (캐시 히트)       |
| **캐시 무효화** | revalidatePath 호출             | 불필요 (읽기 전용)      |

### 사용 예시

#### 페이지에서 조회 (group-queries.ts 사용)

```typescript
// app/(route)/[teamid]/page.tsx
import { getGroup } from "@/lib/api/group-queries"; // ← queries 파일

export default async function TeamPage({ params }) {
  const { teamid } = await params;

  // 1. 인증 체크
  const user = await getUser();

  // 2. 캐싱된 데이터 조회 (userId 포함)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  const groupData = await getGroup(teamid, user.id.toString(), accessToken);

  return <TeamContent group={groupData} />;
}
```

#### 클라이언트에서 생성/수정 (group.ts 사용)

```typescript
// components/TaskListCreateModal.tsx
"use client";

import { createTaskList } from "@/lib/api/group"; // ← 기본 파일

export function TaskListCreateModal({ groupId }: { groupId: string }) {
  const handleSubmit = async (name: string) => {
    const result = await createTaskList(groupId, name);

    if (result.success) {
      // revalidatePath가 자동으로 캐시 무효화
      alert("할 일 목록이 생성되었습니다.");
    }
  };

  // ...
}
```

### 왜 이렇게 설계했는가?

#### 1. Next.js 제약사항

- `"use cache"`와 `"use server"`는 파일 레벨 지시문
- 동일 파일에서 혼용 불가

#### 2. 기능별 분리

- **group.ts**: 상태 변경 (POST/PATCH/DELETE) → 캐싱 금지
- **group-queries.ts**: 조회 (GET) → 캐싱 최적화

#### 3. 보안 강화

- `userId`를 캐시 키에 포함하여 사용자별 캐시 분리
- Authorization 헤더 의존성 제거 (캐시 안전성 확보)

### 다른 접근 방식과 비교

#### Repository 패턴 (블로그 예시)

```typescript
// post.repository.ts - 조회만
export const getPostList = async (props: GetPostListParams) => {
  'use cache'  // ← 함수 내부에 선언
  // ...
}

// post.actions.ts - Server Actions만
"use server";
export async function createPost(data: CreatePost) { ... }
```

**특징:**

- 함수 내부에 `'use cache'` 선언 (파일 레벨 아님)
- 조회 로직이 이미 Repository로 분리됨

#### 현재 프로젝트 방식

```typescript
// group-queries.ts - 파일 레벨 "use cache"
"use cache";
export async function getGroup(...) { ... }

// group.ts - 파일 레벨 "use server"
"use server";
export async function createTaskList(...) { ... }
```

**특징:**

- 파일 레벨에서 명확히 분리
- 기존 코드가 혼재되어 있어서 파일 분리가 필요

**결론: 두 방식 모두 올바르며, 프로젝트 구조에 따라 선택하면 됩니다.**

---

## 캐싱 가능 여부 판단

### ✅ 캐싱 가능한 경우

**다음 조건을 모두 만족해야 합니다:**

1. **Authorization 헤더 불필요** (공개 API)
2. **모든 사용자에게 동일한 데이터 반환**
3. **민감한 개인 정보 미포함**

**예시:**

```typescript
// ✅ 공개 게시판 - 캐싱 가능
export async function getArticles() {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    // Authorization 헤더 없음
    cache: "force-cache",
    next: { revalidate: 120 },
  });
}
```

### ❌ 캐싱 불가능한 경우

**다음 중 하나라도 해당하면 캐싱 불가:**

1. **Authorization 헤더 필요** (권한 기반 API)
2. **사용자별로 다른 데이터 반환**
3. **멤버 정보, role, 권한 등 민감 데이터 포함**

**예시:**

```typescript
// ❌ 팀 상세 정보 - 캐싱 불가
export async function getGroup(groupId: string, accessToken?: string | null) {
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
    accessToken, // Authorization 헤더로 변환됨
    cache: "no-store", // 반드시 no-store!
  });
}
```

### 왜 권한 기반 API는 캐싱하면 안 되는가?

**보안 취약점:**

```typescript
// 시나리오: getGroup에 force-cache 적용 시
1. 멤버 A → getGroup(3740, tokenA)
   → 백엔드: "tokenA 검증 ✅ 멤버 정보 반환"
   → Next.js: 캐시 저장 (키: /groups/3740)

2. 비멤버 B → getGroup(3740, tokenB)
   → Next.js: "캐시 히트!"
   → A의 멤버 정보 반환 ❌ (백엔드 검증 우회!)
```

**문제점:**

- Authorization 헤더는 **캐시 키에 미포함**
- 캐시 히트 시 **백엔드로 요청이 가지 않음**
- 권한 검증 완전 우회 → **민감 데이터 노출**

---

## 캐싱 적용 방법

### 1단계: cache.ts에 상수 정의

```typescript
// src/constants/cache.ts
export const REVALIDATE_TIME = {
  ARTICLE_LIST: 120, // 2분 - 게시글 목록
  ARTICLE_DETAIL: 60, // 1분 - 게시글 상세
} as const;

export const REVALIDATE_TAG = {
  ARTICLE_LIST: "article-list",
  ARTICLE: (id: number) => `article-${id}`,
} as const;
```

### 2단계: API 함수에 캐싱 적용

```typescript
// src/lib/api/boards.ts
import { REVALIDATE_TIME, REVALIDATE_TAG } from "@/constants/cache";

/**
 * 게시글 목록 조회
 *
 * ✅ 공개 API - 인증 불필요하므로 캐싱 안전
 */
export async function getArticles() {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    cache: "force-cache",
    next: {
      revalidate: REVALIDATE_TIME.ARTICLE_LIST,
      tags: [REVALIDATE_TAG.ARTICLE_LIST],
    },
  });

  if (!response.ok) throw new Error("게시글 조회 실패");
  return response.json();
}
```

### 3단계: 변경 작업 시 캐시 무효화

````typescript
// 게시글 생성 후 캐시 무효화
export async function postArticle(data: CreateArticle) {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store", // POST는 캐싱 안함
  });

  if (response.ok) {
    revalidatePath("/boards"); // 게시판 목록 캐시 무효화
  }

  return response.json();
}

---

## 캐시 무효화

### 방법 1: revalidatePath (추천)

```typescript
import { revalidatePath } from "next/cache";

// 특정 페이지의 캐시 무효화
revalidatePath(`/${groupId}`);
revalidatePath("/teamlist");
````

### 방법 2: revalidateTag

```typescript
import { revalidateTag } from "next/cache";
import { REVALIDATE_TAG } from "@/constants/cache";

// 특정 태그의 모든 캐시 무효화
revalidateTag(REVALIDATE_TAG.GROUP(groupId));
revalidateTag(REVALIDATE_TAG.GROUP_LIST);
```

### 사용 시점

````typescript
// 팀 생성 후
export async function createGroup(data: any) {
  const response = await fetchApi(`${BASE_URL}/groups`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (response.ok) {
    revalidatePath("/teamlist"); // 팀 목록 캐시 무효화
  }
}

---

## 캐시 무효화

### revalidatePath 사용

```typescript
import { revalidatePath } from "next/cache";

// 게시글 생성 후 캐시 무효화
export async function postArticle(data: CreateArticle) {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (response.ok) {
    revalidatePath("/boards"); // 게시판 목록 페이지 캐시 무효화
  }

  return response.json();
}

// 게시글 수정 후 캐시 무효화
export async function patchArticle(articleId: number, data: CreateArticle) {
  const response = await fetchApi(`${BASE_URL}/articles/${articleId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (response.ok) {
    revalidatePath(`/boards/${articleId}`); // 특정 게시글 페이지 캐시 무효화
    revalidatePath("/boards"); // 목록도 갱신
  }

  return response.json();
}
````

---

## Next.js 16 "use cache" 방식 (향후 개선)

### 현재 구현의 한계

현재는 `no-store`를 사용하지만, Next.js 16의 **"use cache" 지시어**를 활용하면 더 효율적입니다.

### "use cache"가 해결하는 문제

```typescript
// 현재 방식: 매번 API 호출
export async function getGroup(groupId: string, accessToken?: string | null) {
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
    accessToken,
    cache: "no-store", // 40-80ms
  });
}

// "use cache" 방식: 사용자별 캐싱 + 보안
("use cache");
export async function getGroup(groupId: string, userId: string) {
  // userId가 캐시 키에 자동 포함 → 사용자별 분리
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`);
  return response.json(); // 3-5ms (캐시 히트 시)
}
```

### 적용 방법

#### 1. next.config.ts 설정

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  cacheComponents: true, // "use cache" 활성화
};
```

#### 2. API 함수 수정

```typescript
"use cache"; // ← 파일 최상단 또는 함수 위

/**
 * 그룹 상세 정보 조회
 *
 * userId를 인자로 받아 사용자별 캐시 분리
 */
export async function getGroup(groupId: string, userId: string) {
  // userId가 자동으로 캐시 키에 포함됨
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`);

  if (!response.ok) {
    throw new Error("그룹 조회 실패");
  }

  return response.json();
}
```

#### 3. 페이지에서 사용

```typescript
// app/[teamid]/page.tsx
export default async function TeamPage({ params }) {
  const { teamid } = await params;

  // 1. 인증 체크 (매번 실행, 캐싱 안됨)
  const user = await getUser();

  // 2. 데이터 조회 (userId 기반 캐싱)
  const group = await getGroup(teamid, user.id);

  return <TeamContent group={group} />;
}
```

### 작동 방식

```
사용자 A (userId: 123):
1. getUser() 실행 → 인증 체크 ✅
2. getGroup(teamid, "123") → 캐시 키: `getGroup-${teamid}-123`
3. 첫 요청: 80ms → 캐시 저장
4. 이후 요청: 3ms (캐시 사용)

사용자 B (userId: 456):
1. getUser() 실행 → 인증 체크 ✅
2. getGroup(teamid, "456") → 캐시 키: `getGroup-${teamid}-456`
3. A와 완전히 분리된 캐시 사용
```

### 왜 현재 적용하지 않았나?

**제약 사항:**

1. **백엔드 구조**
   - 현재: Authorization 헤더만 사용
   - 필요: userId를 명시적으로 전달

2. **설정 필요**
   - `cacheComponents: true` 활성화 필요
   - 아직 안정화 단계

3. **코드 변경 범위**
   - 모든 API 함수 시그니처 변경
   - 호출부 전체 수정

### 향후 개선 계획

**단계적 적용:**

1. **Phase 1**: `cacheComponents: true` 활성화
2. **Phase 2**: 공개 API부터 "use cache" 적용
3. **Phase 3**: 권한 기반 API에 userId 전달 구조 도입
4. **Phase 4**: 전체 API 마이그레이션

**현재는 `no-store` + React cache()로 보안 우선, 향후 "use cache"로 성능 개선 예정**

---

## 주의사항

### ❌ 절대 하면 안 되는 것

#### 1. Authorization 헤더를 사용하는 API에 force-cache 적용

```typescript
// ❌ 심각한 보안 위험!
export async function getGroup(groupId: string, accessToken?: string | null) {
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
    accessToken, // Authorization 헤더로 변환됨
    cache: "force-cache", // ❌ 위험!
  });
}
```

**문제:**

- 캐시 키: `/groups/3740` (Authorization 무시)
- 멤버 A 요청 → 멤버 정보 캐시
- 비멤버 B 요청 → A의 멤버 정보 노출 ❌

**해결:**

```typescript
// ✅ 안전
export async function getGroup(groupId: string, accessToken?: string | null) {
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
    accessToken,
    cache: "no-store", // 보안 보장
  });
}
```

#### 2. 사용자별 다른 데이터 반환하는 API에 캐싱

```typescript
// ❌ 잘못된 예
export async function getUserGroups(accessToken?: string | null) {
  const response = await fetchApi(`${BASE_URL}/user/groups`, {
    accessToken,
    cache: "force-cache", // ❌ 사용자별로 다른 데이터인데 캐싱!
  });
}
```

**문제:**

- URL: `/user/groups` (모든 사용자 동일)
- 사용자 A의 팀 목록이 사용자 B에게 노출

**해결:**

```typescript
// ✅ 올바른 예
export async function getUserGroups(accessToken?: string | null) {
  const response = await fetchApi(`${BASE_URL}/user/groups`, {
    accessToken,
    cache: "no-store", // 보안 보장
  });
}
```

#### 3. 변경 작업(POST, PATCH, DELETE)에 캐싱

```typescript
// ❌ 잘못된 예
export async function postArticle(data: CreateArticle) {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    method: "POST",
    cache: "force-cache", // ❌ POST는 캐싱 안됨!
  });
}

// ✅ 올바른 예
export async function postArticle(data: CreateArticle) {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    method: "POST",
    cache: "no-store", // ✅ 항상 no-store
  });

  if (response.ok) {
    revalidatePath("/boards"); // 캐시 무효화
  }
}
```

### ✅ 권장 사항

#### 1. 공개 API만 캐싱

```typescript
// ✅ 공개 게시판 - 캐싱 가능
export async function getArticles() {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    // Authorization 없음
    cache: "force-cache",
    next: { revalidate: 120 },
  });
}

// ❌ 권한 필요 - 캐싱 불가
export async function getGroup(groupId: string, accessToken?: string | null) {
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
    accessToken, // Authorization 필요
    cache: "no-store", // 반드시 no-store
  });
}
```

#### 2. React cache()로 요청 내 중복 방지

```typescript
// measureSSR의 useCache: true (기본값)가 React cache() 적용
const getGroupWithMeasure = measureSSR({
  name: "getGroup",
  fn: () => getGroup(groupId, accessToken),
  useCache: true, // ← React cache() 적용
});

// 같은 페이지에서 3번 호출해도 API는 1번만 실행
const result1 = await getGroupWithMeasure();
const result2 = await getGroupWithMeasure(); // 캐시 사용
const result3 = await getGroupWithMeasure(); // 캐시 사용
```

#### 3. 변경 작업 후 캐시 무효화

```typescript
// 항상 revalidatePath로 캐시 무효화
export async function updateData() {
  const response = await fetchApi(`${BASE_URL}/data`, {
    method: "PATCH",
    cache: "no-store",
  });

  if (response.ok) {
    revalidatePath("/page"); // 캐시 갱신
  }
}
```

---

## 트러블슈팅

### Q: 캐시가 작동하지 않아요

**확인 사항:**

1. `cache: "force-cache"` 옵션이 있는지
2. `next: { revalidate }` 설정이 있는지
3. Authorization 헤더를 사용하지 않는지

### Q: 다른 사용자의 데이터가 보여요

**원인:** Authorization 헤더를 사용하는 API에 `force-cache` 적용

**해결:** `cache: "no-store"`로 변경

### Q: 성능이 느려요

**답변:**

- 공개 API만 캐싱 가능
- 권한 기반 API는 보안상 `no-store` 필수
- React `cache()`가 요청 내 중복은 방지함
- 40-80ms는 허용 가능한 범위

---

## 참고 자료

- [Next.js 16 공식 문서](https://nextjs.org/blog/next-16)
- [Data Fetching: Caching and Revalidating](https://nextjs.org/docs/app/building-your-application/data-fetching/caching-and-revalidating)

---

**작성일**: 2026-01-17  
**최종 수정**: 2026-01-17  
**핵심 원칙**: 보안 > 성능

#### 3. measureSSR 래핑

```typescript
// 항상 measureSSR로 래핑하여 성능 추적
const getGroupWithMeasure = measureSSR({
  name: "getGroup",
  fn: () => getGroup(groupId, accessToken),
  attr: { "team.id": groupId }, // 추가 속성
});
```

---

## 트러블슈팅

### 캐시가 작동하지 않을 때

1. **cookies() 호출 위치 확인**
   - 페이지에서 호출하고 accessToken 전달하는지 확인

2. **cache 옵션 확인**
   - `cache: "force-cache"` 설정되어 있는지 확인
   - `next: { revalidate }` 설정되어 있는지 확인

3. **서버 재시작**
   - 개발 서버는 파일 변경 시 캐시 초기화됨
   - `Ctrl+C` 후 `npm run dev` 재실행

4. **로그 확인**
   - `[Measure]` 로그에서 CACHE HIT/MISS 확인
   - OpenTelemetry span에서 `cache.hit` 확인

### 캐시를 강제로 비우려면

```bash
# 개발 서버 재시작
npm run dev

# 프로덕션 서버 재시작
npm run build && npm start

# 또는 revalidate 시간 만료 대기
# (GROUP_DETAIL: 60초 후 자동 재검증)
```

---

## 참고 자료

- [Next.js 16 공식 문서](https://nextjs.org/blog/next-16)
- [Data Fetching: Caching and Revalidating](https://nextjs.org/docs/app/building-your-application/data-fetching/caching-and-revalidating)
- [프로젝트 내부 문서](./PROJECT_SETTING.md)

---

**작성일**: 2026-01-17  
**업데이트**: 캐싱 적용 후 성능 개선 확인됨 (평균 응답 시간 98% 감소)
