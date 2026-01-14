# 🤝 Coworkers

## 📖 프로젝트 소개

**Coworkers**는 팀 협업을 위한 할 일 관리 서비스입니다.  
팀원들과 함께 할 일 목록을 생성하고, 작업을 관리하며, 진행 상황을 추적할 수 있습니다.

### ✨ 주요 기능

- 👥 **팀 관리**: 팀 생성, 멤버 초대, 역할 관리
- ✅ **할 일 관리**: 할 일 목록 생성, 작업 추가/수정/삭제
- 📊 **진행률 추적**: 실시간 작업 진행 상황 모니터링
- 💬 **자유게시판**: 팀원들과 소통할 수 있는 게시판
- 📱 **반응형 디자인**: PC-first 설계로 데스크톱 환경에 최적화
- 🔐 **OAuth 로그인**: 카카오 간편 로그인 지원
- 📈 **성능 모니터링**: Vercel Analytics 및 Speed Insights 적용

## 🚀 기술 스택

### Core

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)

- **언어**: TypeScript
- **프레임워크**: [Next.js](https://nextjs.org) 16.1.0 (App Router)
- **배포**: [Vercel](https://vercel.com)

### 스타일링

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)

- **CSS 프레임워크**: [Tailwind CSS](https://tailwindcss.com) 4

### 상태 관리 & 데이터 페칭

- **전역 상태 관리**: [Zustand](https://zustand-demo.pmnd.rs)
- **서버 상태 관리**: [React Query](https://tanstack.com/query) + fetch

### 폼 & 검증

- **폼 관리**: [React Hook Form](https://react-hook-form.com)
- **스키마 검증**: [Zod](https://zod.dev)

### 코드 품질

![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.7.4-F7B93E?style=flat-square&logo=prettier&logoColor=black)

- **린터**: ESLint 9
- **포매터**: Prettier
- **Git Hooks**: Husky + lint-staged
- **커밋 컨벤션**: Commitlint
- **AI 코드 리뷰**: [CodeRabbit](https://coderabbit.ai)

### 모니터링 & 성능

![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-000000?style=flat-square&logo=opentelemetry&logoColor=white)

- **분석**: Vercel Analytics
- **성능 추적**: Vercel Speed Insights
- **관찰성**: OpenTelemetry (Vercel OTEL)
  - 서버사이드 렌더링 성능 측정
  - API 호출 및 데이터 페칭 추적
  - 성능 병목 지점 실시간 모니터링
  - 커스텀 Span으로 세부 동작 추적

### 협업 도구

[![CodeRabbit](https://img.shields.io/badge/AI_Review-CodeRabbit-FF6B6B?style=flat-square&logo=robot&logoColor=white)](https://coderabbit.ai)

- **이슈 관리**: GitHub Backlog
- **AI PR 리뷰**: CodeRabbit

### UI 컴포넌트

- **날짜 선택**: React Datepicker
- **아이콘**: SVG with SVGR
- **유틸리티**: clsx (조건부 클래스명)

## 📋 프로젝트 정보

- **분석**: PC-first (데스크톱 우선 설계)
- **버전**: 1.1.1
- **라이센스**: Private

## 📁 프로젝트 구조

```
coworkers/
├── .github/               # PR, ISSUE 템플릿 설정
├── .husky/                # husky 라이브러리 설정
├── docs/                  # 문서
│   ├── CODE_CONVENTION.md
│   ├── OPENTELEMETRY.md
│   └── PROJECT_SETTING.md
├── public/                # png 이미지 폴더
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (route)/       # 라우트 그룹
│   │   │   ├── [teamid]/  # 팀 페이지
│   │   │   ├── addteam/   # 팀 생성
│   │   │   ├── boards/    # 자유게시판
│   │   │   ├── jointeam/  # 팀 참여
│   │   │   ├── login/     # 로그인
│   │   │   ├── myhistory/ # 나의 히스토리
│   │   │   ├── mypage/    # 마이페이지
│   │   │   ├── oauth/     # OAuth 콜백
│   │   │   ├── reset-password/ # 비밀번호 재설정
│   │   │   ├── signup/    # 회원가입
│   │   │   └── teamlist/  # 팀 리스트
│   │   ├── favicon.ico    # 아이콘
│   │   ├── globals.css    # 전역 스타일
│   │   ├── layout.tsx     # 루트 레이아웃 (SEO 메타데이터)
│   │   ├── opengraph-image.png  # opengraph 이미지
│   │   └── page.tsx       # 메인 페이지
│   ├── assets/            # svg 아이콘 폴더
│   ├── components/        # 컴포넌트
│   │   ├── Boards/        # 자유게시판 페이지 컴포넌트
│   │   ├── Common/        # 공통 컴포넌트
│   │   ├── Tasklist/      # Tasklist 페이지 컴포넌트
│   │   └── Team/          # 팀 페이지 컴포넌트
│   ├── constants/         # 상수
│   ├── containers/        # 컨테이너 (클라이언트 컴포넌트)
│   ├── hooks/             # 커스텀 훅
│   ├── lib/               # 라이브러리 (API, 타입 등)
│   ├── mocks/             # Mock 데이터
│   ├── store/             # 전역 상태 관리 (Zustand)
│   ├── types/             # TypeScript 타입
│   ├── utils/             # 유틸리티 함수
│   ├── instrumentation.ts      # OpenTelemetry 진입점
│   ├── instrumentation.node.ts # OpenTelemetry Node.js 설정
│   └── proxy.ts           # 개발 서버 프록시 설정
├── .coderabbit.yaml       # coderabbit AI PR 리뷰 적용
├── .commitlintrc.json     # 커밋 메시지 컨벤션 설정
├── .gitignore             # Git 무시 파일 목록
├── .prettierignore        # Prettier 무시 파일 목록
├── .prettierrc.json       # Prettier 포매터 설정
├── eslint.config.mjs      # ESLint 린터 설정
├── next.config.ts         # Next.js 설정
├── package-lock.json      # 패키지 잠금 파일
├── package.json           # 프로젝트 의존성 및 스크립트
├── postcss.config.mjs     # PostCSS 설정
├── README.md              # 프로젝트 설명 문서
└── tsconfig.json          # TypeScript 컴파일러 설정
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 20 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_APP_URL=your-app-url
NEXT_PUBLIC_BASE_URL=your-api-base-url
# 추가 환경 변수...
```

## 🛠️ 개발 워크플로우

### 코드 스타일

```bash
# ESLint 검사
npm run lint

# ESLint 자동 수정
npm run lint:fix

# Prettier 검사
npm run format:check

# Prettier 자동 포맷팅
npm run format
```

### Git Commit

프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

```bash
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 업무, 패키지 매니저 수정 등
```

Husky가 자동으로 커밋 메시지를 검증하고, lint-staged가 변경된 파일에 대해 린팅과 포맷팅을 실행합니다.

## 📚 문서

- [코드 컨벤션](docs/CODE_CONVENTION.md)
- [프로젝트 설정](docs/PROJECT_SETTING.md)
- [OpenTelemetry 설정](docs/OPENTELEMETRY.md)

## 📊 OpenTelemetry 모니터링

이 프로젝트는 **OpenTelemetry**를 통해 서버사이드 렌더링 성능과 API 호출을 추적합니다.

### 주요 추적 항목

- 🔍 **페이지 렌더링 성능**: 각 페이지의 서버 렌더링 시간 측정
- 🌐 **API 호출 추적**: 외부 API 호출 시간 및 성능 분석
- 📈 **데이터 페칭**: Next.js fetch 요청 자동 추적
- ⚡ **병목 지점 파악**: 성능 저하 구간 실시간 모니터링

### 커스텀 Span 예시

```typescript
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("team-page");
const span = tracer.startSpan("fetch-team-data");
// ... 작업 수행
span.end();
```

### 데이터 확인

Vercel 배포 환경에서 자동으로 수집되며, [Vercel Dashboard](https://vercel.com)의 Speed Insights 탭에서 확인할 수 있습니다.

자세한 내용은 [OpenTelemetry 설정 문서](docs/OPENTELEMETRY.md)를 참고하세요.

## 🤖 AI 코드 리뷰

이 프로젝트는 [CodeRabbit](https://coderabbit.ai)을 사용하여 PR에 대한 자동 AI 코드 리뷰를 제공합니다.  
`.coderabbit.yaml` 파일에서 리뷰 설정을 확인할 수 있습니다.

## 📄 라이센스

This project is private.

---

<div align="center">

**Made by codeit-19기-2team** 🚀

</div>
