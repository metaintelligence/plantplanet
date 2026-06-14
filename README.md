# HanGarden 콘텐츠 관리자 데모

React + Vite 기반의 수목원 식물해설 콘텐츠 관리 PoC입니다. 메인 화면은 HanGarden 프로젝트 소개와 콘텐츠 운영 현황을 보여주고, 햄버거 메뉴에서 콘텐츠 생성/관리와 전시 관리 화면으로 이동합니다.

현재 실제 수목원 DB는 연결되어 있지 않으며, `frontend/public/mock_db.json`의 목업 식물 데이터를 사용합니다. 생성한 콘텐츠와 생성 작업 현황은 내 PC의 서버 파일(`generated/contents.json`, `generated/generation-jobs.json`)을 기준으로 동작합니다.

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

## 다른 PC에서 접속하는 PoC 실행

GitHub Pages 없이 내 PC가 프론트와 백엔드를 함께 서빙할 수 있습니다.

```bash
npm run build
npm run start -w backend
```

백엔드는 기본적으로 `0.0.0.0:4000`에서 실행되며, 빌드된 React 앱과 WebSocket을 같은 포트로 제공합니다.

```text
http://내PC_IP:4000
ws://내PC_IP:4000/ws/generate
```

같은 네트워크의 다른 PC에서 `http://내PC_IP:4000`으로 접속하면 생성 마법사 완료 시 설정 JSON과 콘텐츠 메타데이터가 `/ws/generate`로 전송됩니다. 서버는 콘텐츠를 `generated/contents.json`, 작업 현황을 `generated/generation-jobs.json`, 수신 원본을 `generated/layout-jobs/`에 저장한 뒤 `scripts/generate-layout-page.ts`를 실행해 `frontend/src/generated/layouts/`에 새 React 레이아웃 파일을 만들고 `generatedLayoutRegistry.tsx`를 갱신합니다. 이후 `npm run build -w frontend`가 통과하면 클라이언트에 완료 ACK를 보냅니다.

레이아웃 생성 프롬프트는 공용 프롬프트와 템플릿별 추가 프롬프트로 분리되어 있습니다.

```text
scripts/prompts/generate-layout-page.prompt.md        공용 계약/품질 기준
scripts/prompts/templates/intro.prompt.md             식물 소개 특화 지시
scripts/prompts/templates/storytelling.prompt.md      스토리텔링 특화 지시
scripts/prompts/templates/quiz.prompt.md              퀴즈 특화 지시
scripts/prompts/templates/mission.prompt.md           미션 특화 지시
scripts/prompts/templates/checklist.prompt.md         체크리스트 특화 지시
```

프롬프트 템플릿에서는 `{{componentName}}`, `{{targetFile}}`, `{{template}}`, `{{templatePrompt}}`, `{{mockDbSummary}}`, `{{settingsJsonArray}}`, `{{settingsJson}}` 플레이스홀더를 사용할 수 있습니다.

선택 환경변수:

- `CODEX_LAYOUT_PROMPT_PATH`: 기본 프롬프트 파일 대신 사용할 프롬프트 경로
- `CODEX_LAYOUT_TEMPLATE_PROMPT_DIR`: 템플릿별 프롬프트 디렉터리 경로
- `CODEX_LAYOUT_MODEL`: `codex exec`에 전달할 모델명
- `CODEX_LAYOUT_TIMEOUT_MS`: Codex CLI 실행 타임아웃. 기본값 `300000`

## 주요 기능

- HanGarden 콘텐츠 관리자 메인 페이지
- 콘텐츠 생성 마법사: 일반 생성 / 고급 생성, 대상 식물 선택, Concept.md 기반 설정 절차
- Codex CLI 기반 템플릿별 React 레이아웃 생성: 소개, 스토리텔링, 퀴즈, 미션, 체크리스트
- 생성 콘텐츠 별도 링크: `#/content/{id}`
- 로컬 서버 파일 기반 콘텐츠 CRUD
- 전시 관리 빈 페이지: 국립백두대간수목원, 국립세종수목원, 국립한국자생식물원, 국립정원문화원

## GitHub Pages 배포

`.github/workflows/deploy-pages.yml`이 포함되어 있어 `main` 브랜치에 push하면 `frontend/dist`를 GitHub Pages artifact로 배포합니다.

GitHub 저장소 설정에서 Pages source를 **GitHub Actions**로 선택하면 됩니다.

```text
https://metaintelligence.github.io/plantplanet/
```

## 프로젝트 구조

```text
.
├─ frontend/          React + Vite + TypeScript 관리자 화면
│  ├─ public/         HanGarden 로고, mock_db.json
│  └─ src/
│     ├─ components/  콘솔, 마법사, 관리 화면
│     ├─ layouts/     템플릿별 기본 콘텐츠 페이지
│     ├─ services/    쿠키 기반 콘텐츠 저장소
│     └─ types/       콘텐츠/식물 데이터 타입
├─ backend/           기존 Express + TypeScript API 서버
├─ scripts/           로컬 페이지 생성 CLI
└─ generated/         기존 생성 page-config.json 저장 위치
```
