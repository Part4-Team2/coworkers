## 🚀 기술 스택

### Core

- **언어**: TypeScript
- **프레임워크**: [Next.js](https://nextjs.org) 16.1.0 (App Router)
- **배포**: [Vercel](https://vercel.com)

### 스타일링

- **CSS 프레임워크**: [Tailwind CSS](https://tailwindcss.com) 4

### 상태 관리 & 데이터 페칭

- **전역 상태 관리**: [Zustand](https://zustand-demo.pmnd.rs)
- **서버 상태 관리**: [React Query](https://tanstack.com/query) + fetch

### 폼 & 검증

- **폼 관리**: [React Hook Form](https://react-hook-form.com)
- **스키마 검증**: [Zod](https://zod.dev)

### 코드 품질

- **린터**: ESLint 9
- **포매터**: Prettier
- **Git Hooks**: Husky + lint-staged
- **커밋 컨벤션**: Commitlint

### 협업 도구

- **이슈 관리**: GitHub Backlog

## 📋 프로젝트 정보

- **분석**: PC-first (데스크톱 우선 설계)

## 📁 프로젝트 구조

```
coworkers/
├── .github/               # PR, ISSUE 템플릿 설정
├── .husky/                # husky 라이브러리 설정
├── docs/                  # 문서
│   ├── CODE_CONVENTION.md
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
│   │   │   ├── mypage/    # 마이페이지
│   │   │   ├── reset/     # 비밀번호 재설정
│   │   │   ├── signup/    # 회원가입
│   │   │   ├── teamlist/  # 팀 리스트
│   │   │   └── test/      # 공컴 테스트 (개발 전용)
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
│   │   ├── Team/        # 팀 페이지 컴포넌트
│   ├── constants/         # 상수 (API, 스타일, 검증)
│   ├── containers/        # 컨테이너 (예: 클라이언트 컴포넌트)
│   ├── hooks/             # 훅
│   ├── types/             # TypeScript 타입
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
