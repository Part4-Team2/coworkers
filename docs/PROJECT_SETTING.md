`npx create-next-app@latest .`

Default(typescript, next.js, tailwindcss 4)로 설정

`npm install -D tailwindcss@latest eslint@latest prettier husky`

.prettierrc.json 파일 생성

```
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

.prettierignore 파일 생성

```
node_modules
.next
out
build
dist
*.min.js
*.min.css
package-lock.json
```

package.json 파일 업데이트

```
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "prepare": "husky"
}
```

`npx husky init`

`npm install -D @commitlint/cli @commitlint/config-conventional lint-staged`

.commitlintrc.json 파일 생성

```
{
  "extends": ["@commitlint/config-conventional"]
}
package.json 파일 업데이트
"lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  },
```

.husky/pre-commit 파일 생성

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

.husky/commit-msg 파일 생성

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

두 파일 모두 실행 권한 부여
`chmod +x .husky/pre-commit`
`chmod +x .husky/commit-msg`

커밋 전에 lint-staged가 실행되고 커밋 메시지는 commitlint로 검사

`git init`

`git remote add origin https://github.com/Part4-Team1/coworkers.git`

`git add .`

`git commit -m "chore: initial project setup"`

`git push -u origin main`
