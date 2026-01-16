# Next.js 16 캐싱 가이드

## 📖 목차

1. [개요](#개요)
2. [캐싱 아키텍처](#캐싱-아키텍처)
3. [캐싱 적용 방법](#캐싱-적용-방법)
4. [캐시 시간 변경](#캐시-시간-변경)
5. [캐시 무효화](#캐시-무효화)
6. [모니터링](#모니터링)
7. [주의사항](#주의사항)

---

## 개요

이 프로젝트는 **Next.js 16의 Data Cache**를 사용하여 서버 사이드 캐싱을 구현합니다.

### ✅ 적용된 페이지

- `/[teamid]` - 팀 상세 페이지 (`getGroup()`)
- `/teamlist` - 팀 목록 페이지 (`getUserGroups()`)
- `/myhistory` - 마이 히스토리 페이지 (`getUserHistory()`)

### 🎯 주요 특징

- **URL 기반 캐싱**: 모든 사용자가 동일한 캐시 공유
- **중앙 집중식 설정**: `src/constants/cache.ts`에서 일괄 관리
- **자동 재검증**: 설정된 시간 후 자동으로 캐시 갱신
- **OpenTelemetry 모니터링**: 캐시 히트/미스 추적

---

## 캐싱 아키텍처

### 핵심 원리

Next.js 16에서 `cookies()`와 같은 동적 데이터 소스는 캐시 함수 내부에서 사용할 수 없습니다.

```typescript
// ❌ 잘못된 예 - 캐싱 불가
export async function getGroup(groupId: string) {
  const cookieStore = await cookies(); // Error!
  const accessToken = cookieStore.get("accessToken")?.value;

  const response = await fetch(`/api/groups/${groupId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "force-cache",
  });
}

// ✅ 올바른 예 - 캐싱 가능
// Page.tsx
const cookieStore = await cookies();
const accessToken = cookieStore.get("accessToken")?.value;
const groupData = await getGroup(groupId, accessToken);

// API Function
export async function getGroup(groupId: string, accessToken: string | null) {
  const response = await fetchApi(`/api/groups/${groupId}`, {
    accessToken, // 파라미터로 전달
    cache: "force-cache",
    next: { revalidate: 60, tags: [`group-${groupId}`] },
  });
}
```

### 데이터 흐름

```
┌─────────────┐
│  Page.tsx   │ cookies() 호출 → accessToken 읽기
└──────┬──────┘
       │ accessToken 전달
       ▼
┌─────────────┐
│  API 함수    │ cache: "force-cache" + revalidate
└──────┬──────┘
       │ accessToken을 헤더로 전환
       ▼
┌─────────────┐
│  fetchApi   │ createHeadersWithToken(accessToken)
└──────┬──────┘
       │ Authorization 헤더 추가
       ▼
┌─────────────┐
│ External API│
└─────────────┘
```

---

## 캐싱 적용 방법

### 1단계: cache.ts에 상수 정의

```typescript
// src/constants/cache.ts
export const REVALIDATE_TIME = {
  NEW_FEATURE: 120, // 2분 - 새 기능 데이터
} as const;

export const REVALIDATE_TAG = {
  NEW_FEATURE: (id: string) => `new-feature-${id}`,
} as const;
```

### 2단계: API 함수 수정

```typescript
// src/lib/api/새파일.ts
import { fetchApi } from "@/utils/api";
import { BASE_URL } from "@/lib/api";
import { REVALIDATE_TIME, REVALIDATE_TAG } from "@/constants/cache";

/**
 * 새 기능 데이터 조회
 *
 * 캐싱 전략:
 * - URL 기반 캐싱으로 모든 사용자가 동일한 캐시 공유
 * - accessToken은 Authorization 헤더로 전달되어 캐시 키에 포함되지 않음
 *
 * @param featureId 기능 ID
 * @param accessToken 액세스 토큰 (선택사항, 외부에서 cookies()로 읽어서 전달)
 */
export async function getFeature(
  featureId: string,
  accessToken: string | null = null
) {
  try {
    const response = await fetchApi(`${BASE_URL}/features/${featureId}`, {
      accessToken,
      cache: "force-cache",
      next: {
        revalidate: REVALIDATE_TIME.NEW_FEATURE,
        tags: [REVALIDATE_TAG.NEW_FEATURE(featureId)],
      },
    });

    if (!response.ok) {
      return { success: false, error: "데이터 로드 실패" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch {
    return { success: false, error: "서버 오류" };
  }
}
```

### 3단계: 페이지에서 사용

```typescript
// src/app/(route)/새페이지/page.tsx
import { cookies } from "next/headers";
import { measureSSR } from "@/utils/measure";
import { getFeature } from "@/lib/api/새파일";

export default async function NewFeaturePage() {
  // 1. cookies()를 페이지에서 호출
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  // 2. measureSSR로 래핑 (성능 모니터링)
  const getFeatureWithMeasure = measureSSR({
    name: "getFeature",
    fn: () => getFeature("feature-id", accessToken),
  });

  // 3. 데이터 가져오기
  const { result: featureData } = await getFeatureWithMeasure();

  return <FeatureContainer data={featureData} />;
}
```

### 변경(mutation) 작업 시 캐시 무효화

```typescript
// src/lib/api/새파일.ts
import { revalidatePath } from "next/cache";

export async function updateFeature(featureId: string, data: any) {
  const response = await fetchApi(`${BASE_URL}/features/${featureId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    cache: "no-store", // 변경 작업은 캐싱하지 않음
  });

  if (response.ok) {
    // 캐시 무효화
    revalidatePath(`/features/${featureId}`);
    // 또는
    // revalidateTag(REVALIDATE_TAG.NEW_FEATURE(featureId));
  }

  return response;
}
```

---

## 캐시 시간 변경

### 중앙 집중식 관리

**모든 캐시 시간은 `src/constants/cache.ts`에서 관리됩니다.**

```typescript
// src/constants/cache.ts
export const REVALIDATE_TIME = {
  GROUP_DETAIL: 60, // 60초 → 변경하려면 이 값만 수정
  USER_HISTORY: 120, // 120초
} as const;
```

### 시간 변경 가이드

| 데이터 변경 빈도 | 권장 시간                  | 예시            |
| ---------------- | -------------------------- | --------------- |
| 거의 변경 안됨   | 1시간 ~ 1일 (3600 ~ 86400) | 공지사항, 통계  |
| 가끔 변경        | 5분 ~ 10분 (300 ~ 600)     | 팀 정보, 프로필 |
| 자주 변경        | 30초 ~ 1분 (30 ~ 60)       | 댓글, 좋아요    |
| 실시간           | 10초 또는 no-store         | 채팅, 알림      |

### 변경 예시

```typescript
// Before
GROUP_DETAIL: 60,  // 1분

// After - 5분으로 변경
GROUP_DETAIL: 300,  // 5분

// 모든 getGroup() 호출에 자동 적용됨!
```

---

## 캐시 무효화

### 방법 1: revalidatePath (추천)

```typescript
import { revalidatePath } from "next/cache";

// 특정 페이지의 캐시 무효화
revalidatePath(`/${groupId}`);
revalidatePath("/teamlist");
```

### 방법 2: revalidateTag

```typescript
import { revalidateTag } from "next/cache";
import { REVALIDATE_TAG } from "@/constants/cache";

// 특정 태그의 모든 캐시 무효화
revalidateTag(REVALIDATE_TAG.GROUP(groupId));
revalidateTag(REVALIDATE_TAG.GROUP_LIST);
```

### 사용 시점

```typescript
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

// 팀 정보 수정 후
export async function updateGroup(groupId: string, data: any) {
  const response = await fetchApi(`${BASE_URL}/groups/${groupId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (response.ok) {
    revalidatePath(`/${groupId}`); // 해당 팀 페이지 캐시 무효화
  }
}
```

---

## 모니터링

### 개발 환경 로그

```bash
# 개발 서버 실행
npm run dev

# 콘솔 출력 예시
[Measure] getGroup: 3.45ms ✅ (캐시 가능성)  # CACHE HIT
[Measure] getGroup: 178.54ms ❌ (API 호출)   # CACHE MISS
```

### 프로덕션 로그

```bash
# 프로덕션 빌드 및 실행
npm run build && npm start

# 콘솔 출력 예시
[getGroup] CACHE_HIT 3.4ms
[getGroup] CACHE_MISS 180.5ms
```

### OpenTelemetry 모니터링

OpenTelemetry로 수집되는 데이터:

- `cache.hit`: true/false
- `duration.ms`: 응답 시간
- `cache.threshold.ms`: 캐시 히트 판정 임계값
- `function.name`: 함수 이름

APM 도구 (Datadog, New Relic 등)에서 확인 가능:

```
# 캐시 히트율
cache.hit=true 비율 / 전체 요청

# 평균 응답 시간
HIT: 2-5ms
MISS: 100-200ms
```

### 캐시 성능 확인

```bash
# 첫 방문 (CACHE MISS)
curl http://localhost:3000/3740
# [getGroup] CACHE_MISS 150.2ms

# 60초 이내 재방문 (CACHE HIT)
curl http://localhost:3000/3740
# [getGroup] CACHE_HIT 2.3ms

# 60초 후 (재검증 후 CACHE HIT)
curl http://localhost:3000/3740
# [getGroup] CACHE_HIT 3.1ms (백그라운드 재검증)
```

---

## 주의사항

### ❌ 하면 안 되는 것

#### 1. 변경 작업에 캐싱 사용

```typescript
// ❌ 잘못된 예
export async function createArticle(data: any) {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    method: "POST",
    cache: "force-cache", // ❌ POST는 캐싱 안됨!
  });
}

// ✅ 올바른 예
export async function createArticle(data: any) {
  const response = await fetchApi(`${BASE_URL}/articles`, {
    method: "POST",
    cache: "no-store", // ✅ 항상 새로 요청
  });

  revalidatePath("/boards"); // 캐시 무효화
}
```

#### 2. 캐시 함수 내부에서 cookies() 호출

```typescript
// ❌ 잘못된 예
export async function getGroup(groupId: string) {
  const cookieStore = await cookies(); // ❌ Error!
  const response = await fetchApi(`/api/groups/${groupId}`, {
    cache: "force-cache",
  });
}

// ✅ 올바른 예
// Page에서 cookies() 호출 후 accessToken 전달
export async function getGroup(groupId: string, accessToken: string | null) {
  const response = await fetchApi(`/api/groups/${groupId}`, {
    accessToken,
    cache: "force-cache",
  });
}
```

#### 3. 사용자별 다른 데이터 장시간 캐싱

```typescript
// ⚠️ 주의: 사용자별 데이터는 짧게 캐싱
export async function getMyProfile() {
  const response = await fetchApi(`${BASE_URL}/user`, {
    cache: "force-cache",
    next: {
      revalidate: 10, // ✅ 10초로 짧게 설정
    },
  });
}
```

### ✅ 권장 사항

#### 1. 캐시 시간은 데이터 특성에 맞게

- **공개 데이터**: 길게 (300초 ~ 3600초)
- **개인 데이터**: 짧게 (10초 ~ 60초)
- **자주 변경**: 매우 짧게 (5초 ~ 30초) 또는 no-store

#### 2. 태그 활용

```typescript
// 세밀한 캐시 무효화 가능
next: {
  tags: [
    REVALIDATE_TAG.GROUP(groupId),
    REVALIDATE_TAG.GROUP_MEMBERS(groupId),
  ],
}

// 멤버만 변경되면
revalidateTag(REVALIDATE_TAG.GROUP_MEMBERS(groupId));
// 그룹 전체 변경되면
revalidateTag(REVALIDATE_TAG.GROUP(groupId));
```

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
