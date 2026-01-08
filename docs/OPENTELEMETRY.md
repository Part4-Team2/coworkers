# OpenTelemetry 적용 가이드

## 📌 목차

1. [OpenTelemetry란?](#opentelemetry란)
2. [왜 도입했나?](#왜-도입했나)
3. [프로젝트 적용 현황](#프로젝트-적용-현황)
4. [데이터 확인 방법](#데이터-확인-방법)
5. [커스텀 트레이싱 추가하기](#커스텀-트레이싱-추가하기)
6. [실전 활용 예시](#실전-활용-예시)
7. [추가 가능한 기능](#추가-가능한-기능)
8. [모범 사례 & 주의사항](#모범-사례--주의사항)

---

## OpenTelemetry란?

**OpenTelemetry**는 애플리케이션의 성능과 동작을 관찰(Observability)하기 위한 오픈소스 표준입니다.

### 핵심 개념

```
📊 Observability의 3가지 기둥:
├── Traces  (추적) → 요청의 전체 경로와 각 단계의 소요 시간
├── Metrics (메트릭) → CPU, 메모리 사용량, 요청 수 등 수치 데이터
└── Logs    (로그) → 이벤트와 에러 메시지
```

### 용어 정리

| 용어                | 설명                                      | 예시                                             |
| ------------------- | ----------------------------------------- | ------------------------------------------------ |
| **Trace**           | 하나의 요청이 시스템을 통과하는 전체 여정 | 사용자가 `/123` 페이지 요청 → 서버 렌더링 → 응답 |
| **Span**            | Trace 내의 개별 작업 단위                 | DB 쿼리, API 호출, 페이지 렌더링 등              |
| **Attribute**       | Span에 첨부되는 메타데이터 (key-value)    | `team.id: "123"`, `user.id: 456`                 |
| **Instrumentation** | 자동으로 트레이싱을 추가하는 라이브러리   | Next.js의 모든 route 자동 추적                   |

---

## 왜 도입했나?

### 문제 상황

```
❌ 사용자: "페이지가 느려요!"
❓ 개발자: "어디가 느린 거지...? DB? 렌더링? API?"
```

### 해결 방법

```
✅ OpenTelemetry로 확인:
GET /123 (총 383ms)
├── compile: 331ms ⚠️ 느림! → 최적화 필요
├── proxy.ts: 3ms
└── render: 49ms
    ├── fetch-team-data: 30ms
    └── component-render: 19ms
```

### 도입 효과

- 🔍 **성능 병목 지점 즉시 파악**
- 📈 **서버사이드 렌더링 성능 측정**
- 🐛 **에러 발생 경로 추적**
- 📊 **실제 사용자 경험(Real User Monitoring) 데이터 수집**

---

## 프로젝트 적용 현황

### 1. 설치된 패키지

```json
// package.json
{
  "dependencies": {
    "@vercel/otel": "^2.1.0", // Vercel의 OpenTelemetry 래퍼
    "@opentelemetry/api": "^1.9.0" // 커스텀 span 생성용
  }
}
```

**왜 `@vercel/otel`을 선택했나?**

- ✅ Next.js 자동 계측 (모든 route, fetch 자동 추적)
- ✅ Vercel 배포 시 자동 연동
- ✅ 복잡한 설정 불필요
- ❌ 단점: 다른 플랫폼 배포 시 제한적

### 2. 파일 구조

```
src/
├── instrumentation.ts           # 진입점 (런타임 감지)
├── instrumentation.node.ts      # Node.js 환경 설정
└── app/
    └── (route)/
        └── [teamid]/
            └── page.tsx         # 커스텀 span 예시
```

### 3. 코드 설명

#### `src/instrumentation.ts` - 진입점

```typescript
// Next.js가 서버 시작 시 자동으로 호출하는 특별한 파일
export async function register() {
  // Node.js 환경에서만 실행 (브라우저에서는 실행 안 됨)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // 동적 import로 Node.js 전용 코드 로드
    await import("./instrumentation.node");
  }

  // Edge Runtime이나 브라우저는 무시
}
```

**왜 분리했나?**

- Next.js는 서버, Edge, 브라우저 3가지 환경에서 실행됨
- Node.js 전용 모듈을 브라우저에서 로드하면 에러 발생
- 런타임 감지로 안전하게 분기 처리

#### `src/instrumentation.node.ts` - 실제 설정

```typescript
import { registerOTel } from "@vercel/otel";

// Vercel의 자동 계측 활성화
export function register() {
  registerOTel({
    serviceName: "coworkers-next-app", // 서비스 식별자
  });
}

register();
```

**이것만으로 무엇이 자동 추적되나?**

- ✅ 모든 Next.js route (page.tsx, route.ts)
- ✅ fetch 요청
- ✅ 서버 컴포넌트 렌더링
- ✅ 미들웨어 실행

#### `src/app/(route)/[teamid]/page.tsx` - 커스텀 span

```typescript
import { trace, SpanStatusCode } from "@opentelemetry/api";

export default async function TeamPage({ params }: Props) {
  // 1. Tracer 생성
  const tracer = trace.getTracer("coworkers-page");

  // 2. Span 시작
  return await tracer.startActiveSpan("render-team-page", async (span) => {
    const startTime = performance.now();

    try {
      const { teamid: teamId } = await params;

      // 3. Attribute 추가 (메타데이터)
      span.setAttribute("team.id", teamId);
      span.setAttribute("page.route", "/[teamid]");

      // 실제 작업 수행
      // ... 페이지 렌더링 로직 ...

      // 4. 성공 상태 설정
      span.setAttribute("page.rendered", true);
      span.setStatus({ code: SpanStatusCode.OK });

      // 5. 개발 환경에서 콘솔 로그
      if (process.env.NODE_ENV === "development") {
        const duration = Math.round(performance.now() - startTime);
        console.log(`[OpenTelemetry] render-team-page:`, {
          teamId,
          route: "/[teamid]",
          duration: `${duration}ms`,
          status: "success",
        });
      }

      return <TeamIdContainer teamId={teamId} />;

    } catch (error) {
      // 6. 에러 처리
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      throw error;

    } finally {
      // 7. Span 종료 (필수!)
      span.end();
    }
  });
}
```

**주요 포인트:**

- `startActiveSpan`: 자식 span이 자동으로 연결됨
- `setAttribute`: 검색 가능한 메타데이터 추가
- `setStatus`: 성공/실패 상태 기록
- `recordException`: 에러 스택 트레이스 저장
- `finally`: **반드시** span.end() 호출 (메모리 누수 방지)

---

## 데이터 확인 방법

### 1. 개발 환경 (로컬)

#### 터미널 로그

```bash
$ npm run dev

# 자동 계측 로그
GET /123 200 in 383ms (compile: 331ms, proxy.ts: 3ms, render: 49ms)
                       ↑ 총 시간  ↑ 컴파일   ↑ 미들웨어  ↑ 렌더링

# 커스텀 span 로그 (개발 환경만)
[OpenTelemetry] render-team-page: {
  teamId: '123',
  route: '/[teamid]',
  duration: '5ms',
  status: 'success'
}
```

#### 브라우저 개발자 도구

- Network 탭 → Response Headers
  ```
  Server-Timing: render;dur=49, compile;dur=331
  ```

### 2. 프로덕션 환경 (Vercel)

#### Vercel Dashboard

1. **Speed Insights** 탭
   - 실제 사용자의 페이지 로딩 속도
   - Core Web Vitals (LCP, FID, CLS)

2. **Analytics** 탭
   - 페이지별 평균 응답 시간
   - 에러율, 트래픽

3. **Logs** 탭
   - Trace ID로 전체 요청 경로 확인
   - Span별 소요 시간 시각화

#### Trace 시각화 예시

```
Trace: GET /123 (총 383ms)
│
├─ [compile] 331ms ████████████████░░
│
├─ [proxy.ts] 3ms ░
│
└─ [render-team-page] 49ms ███
   │
   ├─ [fetch-team-data] 30ms ██
   │
   └─ [TeamIdContainer] 19ms █
```

### 3. 외부 모니터링 도구 연동

Vercel 외에도 다양한 플랫폼에서 확인 가능:

- **Datadog**: APM 대시보드
- **New Relic**: 트랜잭션 트레이싱
- **Grafana + Tempo**: 오픈소스 시각화
- **Jaeger**: 분산 추적 시각화

---

## 커스텀 트레이싱 추가하기

### 언제 추가해야 하나?

✅ **추가하면 좋은 경우:**

- 서버 컴포넌트의 복잡한 로직
- 외부 API 호출
- 데이터베이스 쿼리
- 이미지 처리, 파일 업로드
- 비즈니스 로직 핵심 부분

❌ **불필요한 경우:**

- 클라이언트 컴포넌트 (브라우저에서 실행, 서버 추적 불가)
- 단순한 함수 호출
- 이미 자동 계측되는 부분 (fetch 등)

### 패턴 1: 서버 컴포넌트

```typescript
// app/boards/page.tsx
import { trace, SpanStatusCode } from "@opentelemetry/api";

export default async function BoardsPage() {
  const tracer = trace.getTracer("boards-page");

  return await tracer.startActiveSpan("render-boards-page", async (span) => {
    try {
      span.setAttribute("page.type", "boards");

      // 병렬 데이터 fetching 추적
      const [bestArticles, articles] = await Promise.all([
        tracer.startActiveSpan("fetch-best-articles", async (fetchSpan) => {
          try {
            fetchSpan.setAttribute("fetch.limit", 3);
            const res = await fetch("/api/articles/best?limit=3");
            const data = await res.json();
            fetchSpan.setAttribute("articles.count", data.length);
            fetchSpan.setStatus({ code: SpanStatusCode.OK });
            return data;
          } finally {
            fetchSpan.end();
          }
        }),

        tracer.startActiveSpan("fetch-articles", async (fetchSpan) => {
          try {
            fetchSpan.setAttribute("fetch.page", 1);
            const res = await fetch("/api/articles?page=1");
            const data = await res.json();
            fetchSpan.setAttribute("articles.count", data.length);
            fetchSpan.setStatus({ code: SpanStatusCode.OK });
            return data;
          } finally {
            fetchSpan.end();
          }
        }),
      ]);

      span.setStatus({ code: SpanStatusCode.OK });
      return <BoardsClient bestArticles={bestArticles} articles={articles} />;

    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### 패턴 2: API Route

```typescript
// app/api/teams/[teamId]/route.ts
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const tracer = trace.getTracer("teams-api");

  return await tracer.startActiveSpan("get-team", async (span) => {
    try {
      const { teamId } = await params;
      span.setAttribute("team.id", teamId);
      span.setAttribute("http.method", "GET");

      // DB 쿼리 추적
      const team = await tracer.startActiveSpan(
        "db-query-team",
        async (dbSpan) => {
          try {
            dbSpan.setAttribute("db.table", "teams");
            dbSpan.setAttribute("db.operation", "SELECT");

            const result = await db.team.findUnique({
              where: { id: teamId },
              include: { members: true, todos: true },
            });

            dbSpan.setAttribute("db.rows_returned", result ? 1 : 0);
            dbSpan.setStatus({ code: SpanStatusCode.OK });
            return result;
          } finally {
            dbSpan.end();
          }
        }
      );

      if (!team) {
        span.setAttribute("http.status_code", 404);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "Team not found",
        });
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      span.setAttribute("http.status_code", 200);
      span.setStatus({ code: SpanStatusCode.OK });
      return NextResponse.json(team);
    } catch (error) {
      span.recordException(error as Error);
      span.setAttribute("http.status_code", 500);
      span.setStatus({ code: SpanStatusCode.ERROR });
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    } finally {
      span.end();
    }
  });
}
```

### 패턴 3: Server Actions

```typescript
// actions/team.ts
"use server";

import { trace, SpanStatusCode } from "@opentelemetry/api";

export async function createTeam(formData: FormData) {
  const tracer = trace.getTracer("team-actions");

  return await tracer.startActiveSpan("create-team-action", async (span) => {
    try {
      const teamName = formData.get("name") as string;
      span.setAttribute("team.name", teamName);
      span.setAttribute("action.type", "create");

      // 이미지 업로드 추적
      const imageUrl = await tracer.startActiveSpan(
        "upload-team-image",
        async (uploadSpan) => {
          try {
            const file = formData.get("image") as File;
            if (!file) return null;

            uploadSpan.setAttribute("file.size", file.size);
            uploadSpan.setAttribute("file.type", file.type);

            const url = await uploadToS3(file);
            uploadSpan.setStatus({ code: SpanStatusCode.OK });
            return url;
          } finally {
            uploadSpan.end();
          }
        }
      );

      // DB 생성 추적
      const team = await tracer.startActiveSpan(
        "db-create-team",
        async (dbSpan) => {
          try {
            const result = await db.team.create({
              data: { name: teamName, imageUrl },
            });
            dbSpan.setAttribute("team.id", result.id);
            dbSpan.setStatus({ code: SpanStatusCode.OK });
            return result;
          } finally {
            dbSpan.end();
          }
        }
      );

      span.setStatus({ code: SpanStatusCode.OK });
      return { success: true, teamId: team.id };
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      return { success: false, error: (error as Error).message };
    } finally {
      span.end();
    }
  });
}
```

---

## 실전 활용 예시

### 사례 1: 느린 페이지 원인 파악

**문제:**

```
사용자 불만: "/123 페이지가 3초 이상 걸려요"
```

**Trace 확인:**

```
GET /123 (3200ms)
├─ compile: 200ms
├─ render-team-page: 3000ms ⚠️ 문제 발견!
   ├─ fetch-team-data: 50ms
   ├─ fetch-members: 2800ms ⚠️ 범인 발견!
   └─ fetch-todos: 150ms
```

**해결:**

```typescript
// ❌ Before: N+1 쿼리
const members = await db.member.findMany({ where: { teamId } });
for (const member of members) {
  member.tasks = await db.task.findMany({ where: { memberId: member.id } });
}

// ✅ After: JOIN으로 한 번에
const members = await db.member.findMany({
  where: { teamId },
  include: { tasks: true },
});
```

**결과:**

```
GET /123 (250ms) ✅ 12배 개선!
```

### 사례 2: 에러 추적

**에러 로그:**

```
Error: Failed to render team page
  at TeamPage (/app/[teamid]/page.tsx:45)
```

**Trace로 확인:**

```
render-team-page (ERROR)
├─ fetch-team-data (OK)
├─ fetch-members (OK)
└─ fetch-todos (ERROR) ← 원인 발견!
   └─ Exception: Connection timeout to DB
       at db.todo.findMany
```

**근본 원인:** DB 커넥션 풀 부족  
**해결:** 커넥션 풀 크기 증가

### 사례 3: A/B 테스트 성능 비교

```typescript
// 새로운 렌더링 방식 성능 측정
export default async function TeamPage({ params }: Props) {
  const tracer = trace.getTracer("coworkers-page");
  const isNewVersion = Math.random() > 0.5; // 50% A/B 테스트

  return await tracer.startActiveSpan("render-team-page", async (span) => {
    span.setAttribute("experiment.version", isNewVersion ? "v2" : "v1");

    // ... 로직
  });
}
```

**결과 분석 (Vercel Analytics):**

- v1 평균: 450ms
- v2 평균: 280ms → v2 적용 결정!

---

## 추가 가능한 기능

### 1. 커스텀 메트릭 수집

```typescript
import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("coworkers-metrics");
const loginCounter = meter.createCounter("user.login.count");
const pageViewHistogram = meter.createHistogram("page.view.duration");

// 사용
loginCounter.add(1, { method: "email" });
pageViewHistogram.record(450, { page: "/123" });
```

**활용:**

- 로그인 수, 회원가입 수
- 게시글 작성 수, 댓글 수
- 평균 응답 시간, 에러율

### 2. 사용자별 트레이싱

```typescript
export default async function TeamPage({ params }: Props) {
  const tracer = trace.getTracer("coworkers-page");
  const session = await getServerSession(); // Next-Auth 등

  return await tracer.startActiveSpan("render-team-page", async (span) => {
    if (session) {
      span.setAttribute("user.id", session.user.id);
      span.setAttribute("user.email", session.user.email);
      span.setAttribute("user.role", session.user.role);
    }

    // 특정 사용자 필터링 가능
  });
}
```

**활용:**

- VIP 고객의 경험 집중 모니터링
- 특정 사용자의 에러 재현
- 사용자 그룹별 성능 비교

### 3. 비즈니스 이벤트 추적

```typescript
await tracer.startActiveSpan("business-event", async (span) => {
  span.setAttribute("event.type", "task_completed");
  span.setAttribute("task.id", taskId);
  span.setAttribute("task.priority", "high");
  span.setAttribute("team.size", teamMembers.length);

  // 비즈니스 로직
  await completeTask(taskId);

  span.setStatus({ code: SpanStatusCode.OK });
  span.end();
});
```

**활용:**

- 핵심 기능 사용 빈도 분석
- 전환율(Conversion) 측정
- 사용자 여정(User Journey) 추적

### 4. 알림 설정

Vercel + Slack/Discord 연동:

```yaml
# vercel.json
{
  "monitoring":
    {
      "alerts":
        [
          {
            "metric": "page.duration",
            "threshold": 1000,
            "channel": "#alerts",
          },
          { "metric": "error.rate", "threshold": 0.05, "channel": "#critical" },
        ],
    },
}
```

### 5. 커스텀 대시보드

```typescript
// OpenTelemetry Collector + Grafana
// 팀별 맞춤 대시보드 구성

[Performance Dashboard]
├─ 평균 응답 시간 (지난 24시간)
├─ 가장 느린 페이지 TOP 10
├─ 에러 발생 빈도 (실시간)
└─ API 호출 분포도
```

### 6. 프로파일링

```typescript
// 메모리 사용량 추적
await tracer.startActiveSpan("process-large-file", async (span) => {
  const startMemory = process.memoryUsage().heapUsed;

  // 작업 수행
  await processFile(largeFile);

  const endMemory = process.memoryUsage().heapUsed;
  span.setAttribute("memory.used_mb", (endMemory - startMemory) / 1024 / 1024);

  span.end();
});
```

---

## 모범 사례 & 주의사항

### ✅ DO (권장)

1. **의미 있는 Span 이름 사용**

   ```typescript
   // ✅ Good
   tracer.startActiveSpan("fetch-user-profile", ...)

   // ❌ Bad
   tracer.startActiveSpan("api-call", ...)
   ```

2. **Attribute는 검색/필터링 가능한 값**

   ```typescript
   // ✅ Good
   span.setAttribute("team.id", teamId);
   span.setAttribute("http.status_code", 200);

   // ❌ Bad
   span.setAttribute("debug_info", JSON.stringify(bigObject)); // 너무 큼
   ```

3. **항상 finally에서 span.end() 호출**

   ```typescript
   try {
     // 작업
   } catch (error) {
     span.recordException(error);
   } finally {
     span.end(); // ✅ 필수!
   }
   ```

4. **에러는 반드시 기록**

   ```typescript
   catch (error) {
     span.recordException(error as Error);
     span.setStatus({ code: SpanStatusCode.ERROR });
   }
   ```

5. **개발 환경에서만 로그 출력**
   ```typescript
   if (process.env.NODE_ENV === "development") {
     console.log("[OpenTelemetry]", data);
   }
   ```

### ❌ DON'T (피해야 할 것)

1. **클라이언트 컴포넌트에 추가하지 말 것**

   ```typescript
   "use client"; // ❌ 서버 추적 불가

   export default function MyComponent() {
     // OpenTelemetry 사용 불가
   }
   ```

2. **민감한 정보 로깅 금지**

   ```typescript
   // ❌ 절대 금지!
   span.setAttribute("user.password", password);
   span.setAttribute("credit_card", cardNumber);
   ```

3. **너무 많은 Span 생성하지 말 것**

   ```typescript
   // ❌ 오버헤드 발생
   for (let i = 0; i < 10000; i++) {
     tracer.startActiveSpan(`loop-${i}`, ...); // 성능 저하
   }

   // ✅ 배치 처리
   tracer.startActiveSpan("process-items", async (span) => {
     span.setAttribute("items.count", 10000);
     for (let i = 0; i < 10000; i++) {
       // 작업
     }
   });
   ```

4. **span.end() 중복 호출 금지**

   ```typescript
   // ❌ 에러 발생
   span.end();
   span.end(); // Error!
   ```

5. **동기 함수에서는 사용 자제**
   ```typescript
   // ❌ 불필요
   function simpleCalculation(a: number, b: number) {
     return tracer.startActiveSpan("add", (span) => {
       const result = a + b; // 간단한 연산은 추적 불필요
       span.end();
       return result;
     });
   }
   ```

### 📊 성능 고려사항

**OpenTelemetry 오버헤드:**

- 일반적으로 1-5ms 추가
- 적절히 사용하면 무시 가능한 수준
- 과도한 Span 생성은 지양

**메모리 사용:**

- Span 당 약 1-2KB
- 버퍼가 가득 차면 자동으로 백엔드로 전송

**네트워크 비용:**

- 배치 전송으로 최소화
- Vercel 무료 플랜: 월 100만 스팬

---

## 추가하면 좋을 내용

### Level 1: 기본

1. `/boards` 페이지에 커스텀 span 추가
2. 콘솔 로그로 렌더링 시간 확인

### Level 2: 중급

1. 게시글 목록 fetch에 span 추가
2. 게시글 개수를 attribute로 기록

### Level 3: 고급

1. 이미지 업로드 API에 tracing 추가
2. 파일 크기, 업로드 시간 측정
3. 에러 발생 시 재시도 로직 추적

---

## 참고 자료

- [OpenTelemetry 공식 문서](https://opentelemetry.io/docs/)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [Vercel OpenTelemetry](https://vercel.com/docs/observability/otel-overview)
- [OpenTelemetry JS API](https://open-telemetry.github.io/opentelemetry-js/)

---

## 질문 & 답변

**Q: 프로덕션에서 성능 영향은 없나요?**  
A: 일반적으로 1-5ms 오버헤드로 거의 영향 없습니다. Vercel은 자동으로 샘플링을 조정합니다.

**Q: 클라이언트 성능도 측정하고 싶어요.**  
A: `@vercel/analytics`와 `@vercel/speed-insights` 사용하세요. (이미 설치됨)

**Q: 다른 플랫폼(AWS, GCP)에서도 사용 가능한가요?**  
A: 네, `@vercel/otel` 대신 표준 OpenTelemetry SDK를 사용하면 됩니다.

**Q: 모든 페이지에 span을 추가해야 하나요?**  
A: 아니요. 중요한 페이지나 느린 부분만 선택적으로 추가하세요.

**Q: 비용은 얼마나 드나요?**  
A: Vercel 무료 플랜은 월 100만 스팬까지 무료입니다.

---

**작성일:** 2026년 1월 7일  
**작성자:** [Sihyeon-Y]  
**버전:** 1.0
