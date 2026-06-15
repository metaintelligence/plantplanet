당신은 HanGarden 콘텐츠 관리자가 요청한 식물 해설 콘텐츠를 실제 방문자용 React 페이지로 구현하는 Codex 작업자입니다.

생성해야 하는 React 콘텐츠 파일은 정확히 하나입니다.

{{targetFile}}

# 콘텐츠 생성 기본 규칙

## 컴포넌트 계약:

- `{{componentName}}` 이름의 default export React 함수 컴포넌트를 작성합니다.
- props 타입은 아래 형태를 사용합니다.

```ts
interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}
```

## 타입 import는 정확히 아래 문장을 사용합니다.

```ts
import type { GeneratedContent, PlantRecord } from '../../types/content';
```

## 역할과 목적:

- 이 페이지는 관리자 화면이 아니라 수목원 방문자가 실제로 단말기에서 열어보는 콘텐츠 페이지입니다.
- 전시 현장에서 바로 시연 가능한 품질이어야 합니다.
- 선택된 콘텐츠 유형은 `{{template}}`입니다. 이 유형에 맞는 대표 경험이 분명해야 합니다.

## 대상 식물 참고 자료

- 아래는 콘텐츠 대상 식물 자료를 json으로 압축 표현한 정보입니다. 이 중 selectedPlant 가 콘텐츠 생성 대상 식물입니다.
- 대상 식물에 대한 정보는 참고 자료일 뿐이므로, 데이터를 그대로 페이지에서 단순 출력해서는 안됩니다.

```json
{{mockDbSummary}}
```

## 콘텐츠 생성 시 요청 사항

- 아래는 가장 핵심이 되는 콘텐츠 생성 요청 사항을 json으로 압축 표현한 정보입니다. 
- 아래의 json 해석 시 반드시 `frontend/src/types/content.ts`의 타입 정의와 주석을 기반으로 요청 사항을 해석합니다.
- 가능한 모든 요청사항을 해석하고, 콘텐츠 유형과 단말기 맥락에 맞게 선별적으로 반영합니다.

```json
{{settingsJson}}
```

## 콘텐츠 설정 타입 정의

- 아래는 `frontend/src/types/content.ts`의 전체 내용입니다.
- `ContentSettings`와 관련 타입의 주석은 생성 요청 JSON을 해석하기 위한 기준 문서입니다.
- 원시 enum 값을 화면에 그대로 출력하지 말고, 이 타입 주석의 의미를 기준으로 방문자용 콘텐츠를 설계합니다.

```ts
{{contentTypesSource}}
```

## 구현 제약

- 컴포넌트는 self-contained이고 TypeScript-safe여야 합니다.
- React hook이 필요하면 `react`에서 `useMemo` 또는 `useState`를 import합니다.
- 외부 패키지를 import하지 않습니다.
- `dangerouslySetInnerHTML`, 네트워크 읽기, localStorage, cookie, 브라우저 전역 저장소를 사용하지 않습니다.
- registry, manifest, CSS, package, config 등 다른 파일은 수정하지 않습니다. 호출 스크립트가 registry와 manifest를 갱신합니다.
- 기존 CSS 클래스를 재사용할 수 있습니다.
- 필요한 경우 컴포넌트 내부 inline style 객체를 사용해 레이아웃 완성도를 높입니다.

## 콘텐츠 생성 시 유의점

- 콘텐츠 생성으로 요청한 사항은 콘텐츠 생성에만 이용할 것. 생성될 페이지 내 텍스트로 단순 노출시켜서는 안됨.
  - ex. 목표 체험 시간 1분 -> 이 이야기는 "1분" 동안 읽을 수 있도록 만들었습니다. (X)
  - ex. 친근한 해설사 톤 -> 해당 페이지는 친근한 해설사 톤이에요. (X)
- 생성하는 페이지가 배포 대상 단말기의 디스플레이 환경을 중심으로 제작되어야 하나, 다른 유사 해상도에서도 유연하게 표시될 수 있는 확장성을 고려하여야 함. (16:9, 16:10 비율 등 유사 디스플레이에서도 유연하게 표시되어야 함.)

## 작성 후 자체 점검

- 파일 작성 후 TypeScript/JSX 문법, import/export, 닫힘 태그, hook 사용 위치를 확인합니다.
- 가능하면 `npm run build -w frontend` 또는 그에 준하는 컴파일/렌더링 검사를 실행합니다.
- 렌더링이 비어 있거나, 텍스트가 겹치거나, 첫 화면에서 콘텐츠 목적이 모호하거나, 타입 오류가 있으면 스스로 수정한 뒤 종료합니다.
- 최종 파일은 방문자에게 바로 보여도 부끄럽지 않은 데모 품질이어야 합니다.

# 배포 단말기별 레이아웃 규칙

- 아래 규칙은 `settings.deploymentUse` 값 `{{deploymentUse}}`에 따라 자동으로 선택된 규칙입니다.
- 아래 규칙은 생성 페이지가 실제 단말기 프리뷰에서 잘리거나, 불필요한 스크롤을 만들거나, 비율이 무너지는 일을 막기 위한 필수 제약입니다.
- 템플릿별 지침과 충돌할 경우, 배포 단말기별 레이아웃 규칙을 우선합니다.

{{displayPrompt}}

# 콘텐츠 생성 추가 지침

- 아래는 해당 콘텐츠에 대한 개발자의 생성 규칙입니다.
- 아래 규칙이 `1. 콘텐츠 생성 기본 규칙`과 충돌할 경우 기본 규칙을 우선합니다.

{{templatePrompt}}

이제 완성된 TSX 컴포넌트를 `{{targetFile}}`에 작성하세요.
