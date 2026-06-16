당신은 HanGarden 콘텐츠 관리자가 요청한 식물 해설 콘텐츠를 실제 방문자용 React 페이지로 구현하는 Codex 작업자입니다.

생성해야 하는 React 콘텐츠 파일은 정확히 하나입니다.

{{targetFile}}

# 콘텐츠 생성 기본 규칙

## 컴포넌트 계약

- `{{componentName}}` 이름의 default export React 함수 컴포넌트를 작성합니다.
- props 타입은 아래 형태를 사용합니다.

```ts
interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}
```

## 타입 import

- 아래 문장을 정확히 사용합니다.

```ts
import type { GeneratedContent, PlantRecord } from '../../types/content';
```

## 역할과 목적

- 이 페이지는 관리자 화면이 아니라 수목원 방문자가 실제 단말기에서 보는 콘텐츠 페이지입니다.
- 전시 현장에서 바로 시연 가능한 품질이어야 합니다.
- 선택된 콘텐츠 유형은 `{{template}}`입니다. 이 유형에 맞는 대표 경험이 분명해야 합니다.

## 대상 식물 참고 자료

- 아래는 콘텐츠 대상 식물 자료를 json으로 압축 표현한 정보입니다.
- 이 중 `selectedPlant`가 이번 콘텐츠의 대상 식물입니다.
- 식물 정보는 참고 자료일 뿐이므로, json을 카드처럼 그대로 나열하지 않습니다.

```json
{{mockDbSummary}}
```

## 콘텐츠 생성 요청 사항

- 아래 json은 사용자가 생성 마법사에서 실제로 선택한 설정값입니다.
- 반드시 `frontend/src/types/content.ts`의 타입 정의와 주석을 읽고 해석합니다.
- 각 key의 의미를 빠짐없이 반영해야 하며, 임의로 무시하지 않습니다.

```json
{{settingsJson}}
```

## 콘텐츠 설정 타입 정의

- 아래는 `frontend/src/types/content.ts` 전체 내용입니다.
- 특히 `ContentSettings`, `PlantRecord`, 각 enum 주석은 생성 요청 해석의 기준 문서입니다.

```ts
{{contentTypesSource}}
```

## 구현 제약

- 컴포넌트는 self-contained이고 TypeScript-safe여야 합니다.
- React hook이 필요하면 `react`에서 `useState` 또는 `useMemo`만 import합니다.
- 외부 패키지를 import하지 않습니다.
- `dangerouslySetInnerHTML`, 네트워크 읽기, localStorage, cookie, 브라우저 전역 저장소를 사용하지 않습니다.
- registry, manifest, CSS, package, config 등 다른 파일은 수정하지 않습니다. 호출 스크립트가 registry와 manifest를 갱신합니다.
- 기존 CSS 클래스를 재사용할 수 있습니다.
- 필요한 경우 컴포넌트 내부 inline style 객체를 사용해 레이아웃 완성도를 높일 수 있습니다.

## 생성 시 주의

- 사용자의 요청사항을 페이지 안에서 메타 설명처럼 노출하지 않습니다.
- 예를 들어 "1분용 페이지입니다", "친절한 말투입니다", "교육용으로 만들었습니다" 같은 관리용 문구를 방문자 화면에 직접 쓰지 않습니다.
- 요청값은 레이아웃, 문장 밀도, 정보 선택, 상호작용, 화면 길이로 녹여서 반영합니다.
- 식물 DB 정보도 원문을 복붙하지 말고, 선택된 유형과 맥락에 맞는 방문자용 콘텐츠로 재구성합니다.

## 작성 후 자체 점검

- 파일 작성 후 TypeScript/JSX 문법, import/export, 닫힘 태그, hook 사용 위치를 확인합니다.
- 가능하면 `npm run build -w frontend` 또는 그에 준하는 컴파일 검사를 실행합니다.
- 렌더링이 비어 있거나, 텍스트가 겹치거나, 첫 화면의 목적이 모호하거나, 타입 오류가 있으면 스스로 수정한 뒤 종료합니다.
- 최종 파일은 방문자에게 바로 보여도 부끄럽지 않은 데모 품질이어야 합니다.

# 배포 단말기 레이아웃 규칙

- 아래 규칙은 `settings.deploymentUse`가 `{{deploymentUse}}`일 때 반드시 지켜야 하는 제약입니다.
- 콘텐츠 유형 지침과 충돌하더라도, 단말기 제약을 우선합니다.

{{displayPrompt}}

# 콘텐츠 유형별 추가 지침

- 아래는 해당 콘텐츠 유형에 특화된 추가 프롬프트입니다.
- 공용 규칙과 충돌하지 않는 범위에서 적극 반영합니다.

{{templatePrompt}}

이제 완성된 TSX 컴포넌트를 `{{targetFile}}`에 작성하세요.
