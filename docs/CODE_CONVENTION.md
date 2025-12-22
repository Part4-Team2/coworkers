### 케이스별 네이밍

```typescript
// 클래스, 컨스트럭터 (PascalCase) - 명사
class UserManager {}
const LoginForm = () => {};

// 변수, 함수 (camelCase)
const userData = "john"; // 변수: 명사
const getUserData = () => {}; // 함수: 동사
const handleButtonClick = () => {}; // 이벤트 핸들러: handle + 동사

// 상수 (SCREAMING_SNAKE_CASE)
const API_BASE_URL = "https://api.com";
const MAX_RETRY_COUNT = 3;
```

### 파일명/폴더명

```bash
# 컴포넌트, 페이지 (PascalCase)
LoginForm.tsx
UserProfile.tsx
src/components/UIComponents/
src/pages/UserProfile/

# 유틸 (kebab-case)
api-client.ts
auth-utils.ts
src/utils/api-helpers/
src/hooks/use-auth/

# 이미지 파일 (kebab-case)
user-profile.jpg
login-background.png
icon-search.svg
logo-primary.svg

# CSS 파일 (kebab-case)
global-styles.css
button-component.css
typography-system.css

# 기타 설정 파일 (kebab-case 또는 관례 따름)
next.config.ts          # 프레임워크 관례
tailwind.config.ts      # 프레임워크 관례
api-endpoints.json      # kebab-case
font-weights.json       # kebab-case
```

### 금지 사항

```typescript
// ❌ 절대 하지 말 것
const a = getUserData();     // 한글자 변수명
const 사용자이름 = 'john';    // 한글 변수명
const user = () => {};       // 함수명에 명사 사용
<div className="bg-[#ff5733]">  // 임의 색상값 사용
```
