# 생성형 AI 기반 식물해설 Text-to-Page 관리자 데모

React + Express 기반의 PoC입니다. 관리자가 식물해설 페이지 생성 옵션을 입력하면 백엔드가 로컬 CLI 더미 생성기를 실행하고, 생성된 `generated/page-config.json`을 React 모바일 미리보기로 렌더링합니다.

## 실행 방법

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

빌드는 다음 명령으로 확인할 수 있습니다.

```bash
npm run build
```

## 프로젝트 구조

```text
.
├─ frontend/          React + Vite + TypeScript 관리자 화면
├─ backend/           Express + TypeScript API 서버
├─ scripts/           로컬 페이지 생성 CLI
└─ generated/         생성된 page-config.json 저장 위치
```

## API

### `GET /api/health`

서버 상태를 확인합니다.

### `POST /api/generate-page`

관리자 입력값을 받아 검증한 뒤, 허용된 로컬 CLI 스크립트 `scripts/generate-page.ts`만 실행합니다. 실행 결과로 생성된 page config와 CLI 로그를 반환합니다.

### `GET /api/generated-page/latest`

가장 최근 생성된 `generated/page-config.json`을 반환합니다.

## 렌더링 방식

프론트엔드는 AI가 만든 React 코드를 실행하지 않습니다. 대신 `page-config.json`만 받아서 `section.type`에 따라 안전하게 컴포넌트를 분기합니다.

지원 섹션 타입:

- `hero`
- `info`
- `story`
- `quiz`
- `mission`
- `checklist`
- `similarPlants`

알 수 없는 타입은 fallback 카드로 표시합니다.

## 향후 AI/Codex CLI 연동 지점

현재 더미 생성 로직은 [scripts/generate-page.ts](scripts/generate-page.ts)의 `generatePageConfig(input)` 함수에 분리되어 있습니다. 실제 연동 시 이 함수 내부를 다음 방식으로 교체하면 됩니다.

- Codex CLI 실행 결과를 `page-config.json` 스키마로 변환
- 외부 LLM/API 호출 후 JSON schema 검증
- 식물 DB, 계절 데이터, 다국어 번역 파이프라인 연결

백엔드는 [backend/src/services/cliRunner.ts](backend/src/services/cliRunner.ts)에서 실행 가능한 명령을 `generate-page` 스크립트 하나로 제한합니다. 생성 파일 위치도 `generated/` 하위로 고정되어 있어 이후 보안 검증을 확장하기 쉽습니다.
