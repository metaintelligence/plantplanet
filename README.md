# HanGarden 콘텐츠 관리자 데모

React + Vite 기반의 수목원 식물해설 콘텐츠 관리 PoC입니다. 메인 화면은 HanGarden 프로젝트 소개와 콘텐츠 운영 현황을 보여주고, 햄버거 메뉴에서 콘텐츠 생성/관리와 전시 관리 화면으로 이동합니다.

현재 백엔드 DB는 연결되어 있지 않으며, `frontend/public/mock_db.json`의 목업 식물 데이터를 사용합니다. 생성한 콘텐츠는 데모 목적상 쿠키에 저장되며, 저장소 구현은 `frontend/src/services/contentStore.ts`에 분리되어 있어 이후 Firebase 같은 서버 DB로 교체하기 쉽습니다.

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

## 주요 기능

- HanGarden 콘텐츠 관리자 메인 페이지
- 콘텐츠 생성 마법사: 일반 생성 / 고급 생성, 대상 식물 선택, Concept.md 기반 설정 절차
- 템플릿별 기본 레이아웃 페이지: 소개, 스토리텔링, 퀴즈, 미션, 체크리스트
- 생성 콘텐츠 별도 링크: `#/content/{id}`
- 쿠키 기반 콘텐츠 CRUD
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
