/**
 * HanGarden 콘텐츠 생성 파이프라인 전반에서 공통으로 사용하는 도메인 타입 정의입니다.
 *
 * 이 파일은 단순한 TypeScript 타입 모음이 아니라,
 * 1) 관리자 생성 마법사가 어떤 값을 수집하는지,
 * 2) 서버와 CLI가 어떤 JSON 구조를 주고받는지,
 * 3) 생성형 AI가 각 설정값을 어떤 의미로 해석해야 하는지,
 * 4) 방문자용 React 페이지가 어떤 데이터를 받아 렌더링하는지
 * 를 동시에 설명하는 기준 문서 역할을 합니다.
 *
 * 특히 HanGarden은 한국수목원정원관리원(한수정) 내부 실무 흐름을 전제로 한 프로젝트이므로,
 * 이 파일의 한글 주석은 단순 설명이 아니라 실제 도메인 의미를 보존하기 위한 핵심 컨텍스트입니다.
 * 프롬프트 본문이 축약되거나 대화 컨텍스트가 줄어들더라도, CLI는 이 파일을 참조해
 * "purpose", "deploymentUse", "focusTopics" 같은 키의 의미를 다시 복원할 수 있어야 합니다.
 *
 * 따라서 이 파일의 앞부분에 있는 상세 한글 주석과 각 타입/필드의 한글 설명은 유지하는 것이 원칙입니다.
 * 영문으로 단순 치환하거나, "자명하다"는 이유로 주석을 제거하거나, 지나치게 짧게 축약하지 마세요.
 * 이 주석들은 생성형 AI가 요청 JSON을 올바르게 해석하기 위한 보조 명세서이기도 합니다.
 */

export type CreationMode = 'general' | 'advanced';

export type TemplateType = 'intro' | 'storytelling' | 'quiz' | 'mission';

export type PagePurpose = 'general' | 'education' | 'experience' | 'campaign' | 'promotion' | 'route';

export type Audience = 'children' | 'adults' | 'foreigners';

/**
 * 현재 서비스 범위는 한국어 중심이지만,
 * 향후 구조 확장을 고려해 언어 타입 자체는 유지합니다.
 *
 * 다만 현 시점에서 UI/상수/설명 체계는 한수정 내부 사용성을 우선하므로
 * 다국어 일반화보다 한국어 도메인 명확성을 우선합니다.
 */
export type Language = 'ko' | 'en' | 'ja' | 'zh';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'auto';

export type EstimatedTime = '10sec' | '30sec' | '1min' | '3min';

/**
 * 배포 단말 타입입니다.
 * - kiosk: FHD 키오스크, 스크롤 없이 한 화면 구성을 우선 고려
 * - mobile: 모바일 웹, 세로 스크롤 허용
 * - staticPoster: 상호작용 없는 단일 정적 포스터
 *
 * 이 값은 단순 라벨이 아니라 생성 결과의 레이아웃 규칙을 강하게 제약합니다.
 * 예를 들어 kiosk는 "첫 화면 완결형", mobile은 "세로 흐름 허용", staticPoster는
 * "한 페이지 정적 정보 요약"이라는 해석 기준을 가져야 합니다.
 */
export type DeploymentUse = 'kiosk' | 'mobile' | 'staticPoster';

export type FieldLocation = 'greenhouse' | 'garden' | 'outdoorGarden' | 'forestTrail' | 'park';

export type FocusTopic =
  | 'appearance'
  | 'ecology'
  | 'nameOrigin'
  | 'cultureHistory'
  | 'usage'
  | 'conservation'
  | 'comparison'
  | 'funFacts';

export type FeatureOption = 'voiceGuide' | 'qaAi' | 'similarPlantCards';

export type Tone = 'friendly' | 'fairytale' | 'museum' | 'emotional' | 'expert' | 'campaign';

export type StoryScenario = 'extinction' | 'dayInLife' | 'timeTravel' | 'climateSurvival' | 'nameSecret';

export type LayoutId = 'generated' | 'default';

export type ContentStatus = 'draft' | 'published';

export type PlantCategory = 'tree' | 'shrub' | 'herb';

export interface PlantImage {
  url: string;
  alt: string;
  source: string;
  sourceUrl: string;
  license: string;
}

export interface PlantRecord {
  /**
   * mock DB와 생성 콘텐츠 설정에서 참조하는 고유 식별자입니다.
   * 콘텐츠 생성 요청의 `plantId`는 반드시 이 값과 매칭됩니다.
   */
  id: string;
  category: PlantCategory;
  koreanName: string;
  scientificName: string;
  commonName: string;
  family: string;
  origin: string;
  habitat: string;
  size: string;
  floweringSeason: string;
  features: string[];
  conservationMessage: string;
  observationTips: string[];
  seasonHighlights: Record<Season, string>;
  image: PlantImage;
  similarPlantIds: string[];
}

/**
 * 생성 마법사가 수집하고 CLI/서버로 전달하는 핵심 요청 스키마입니다.
 * 각 필드는 단순 표시값이 아니라 실제 생성 결과의 톤, 구조, 길이, 단말 최적화에 영향을 줍니다.
 *
 * 이 인터페이스는 프롬프트에서 "settingsJson"을 해석할 때 가장 먼저 참고해야 하는 기준입니다.
 * 즉, 생성형 AI는 key 이름만 보고 추측하지 말고, 아래 필드 설명을 근거로 요청을 해석해야 합니다.
 */
export interface ContentSettings {
  mode: CreationMode;

  /**
   * 관리자가 지정하는 콘텐츠 이름입니다.
   * 콘텐츠 목록, 작업 이력, 저장 파일 메타데이터의 기준명이 됩니다.
   * 방문자 화면의 메인 타이틀로도 활용될 수 있으므로 실제 노출 품질을 고려한 값이어야 합니다.
   */
  contentName: string;

  /**
   * 대상 식물의 고유 ID입니다.
   * mock DB 또는 향후 실제 식물 DB의 PlantRecord.id와 연결됩니다.
   */
  plantId: string;

  /**
   * 방문자 경험의 기본 유형입니다.
   * intro / storytelling / quiz / mission 중 어떤 성격의 페이지인지 결정합니다.
   */
  template: TemplateType;

  /**
   * 레이아웃 생성 방식입니다.
   * - generated: Codex CLI가 새 React 페이지를 생성
   * - default: 미리 정의된 기본 레이아웃 페이지를 사용
   */
  layoutId: LayoutId;

  /**
   * 콘텐츠 제작 목적입니다.
   * 예: 일반 해설, 교육, 체험, 캠페인, 전시 홍보, 동선 안내 등
   */
  purpose: PagePurpose;

  /**
   * 주 관람 대상입니다.
   * 여러 값이 들어갈 수 있으나, 문장 난이도와 상호작용 밀도는 주 대상층을 우선 반영해야 합니다.
   */
  audience: Audience[];

  /**
   * 출력 언어 목록입니다.
   * 현재 서비스 범위는 한국어 중심이나, 요청값 자체는 구조적으로 유지합니다.
   */
  languages: Language[];

  /**
   * 현재 계절 또는 계절 자동 모드입니다.
   * 식물의 계절 포인트, 관찰 맥락, 첫 화면 메시지에 직접 영향을 줍니다.
   */
  season: Season;

  /**
   * 목표 체험 시간입니다.
   * 예: 10초, 30초, 1분, 3분
   * 이 값은 정보량, 섹션 수, 문장 길이, 상호작용 개수 조절의 기준이 됩니다.
   */
  estimatedTime: EstimatedTime;

  /**
   * 실제 배포 단말입니다.
   * kiosk / mobile / staticPoster에 따라 레이아웃 전략이 크게 달라집니다.
   */
  deploymentUse: DeploymentUse;

  /**
   * 실제 전시/관람 위치입니다.
   * 온실, 정원, 숲길 같은 현장 맥락을 설명 문구나 시선 유도에 녹일 수 있습니다.
   */
  fieldLocation: FieldLocation;

  /**
   * 콘텐츠에서 특별히 강조하고 싶은 주제 묶음입니다.
   * 예: 형태, 생태, 이름 유래, 문화/역사, 활용, 보전 가치 등
   * 생성형 AI는 이 값을 단순 태그로 노출하지 말고 실제 섹션 구성과 핵심 메시지에 반영해야 합니다.
   */
  focusTopics: FocusTopic[];

  /**
   * 문장 톤과 전달 분위기입니다.
   * 친근형, 전시 해설형, 감성 스토리형 등으로 결과물의 말투와 밀도를 조정합니다.
   */
  tone: Tone;

  /**
   * 부가 기능 옵션입니다.
   * 현재는 구조적 확장성을 위해 유지하며, 향후 음성 가이드/QA AI 등과 연결될 수 있습니다.
   */
  featureOptions: FeatureOption[];

  /**
   * 스토리텔링 유형을 선택했을 때 사용하는 세부 시나리오입니다.
   * 다른 템플릿에서는 비어 있을 수 있습니다.
   */
  storyScenario?: StoryScenario;

  /**
   * 자유 입력 추가 요청입니다.
   * 생성형 AI가 반드시 해석해야 하는 자연어 요구사항이 들어갑니다.
   * 이 값은 화면에 메타 텍스트처럼 그대로 노출하는 것이 아니라,
   * 레이아웃/문장/정보 선택 방식에 녹여서 반영해야 합니다.
   */
  extraRequest: string;
}

/**
 * 기본 생성기와 생성형 레이아웃이 공통으로 활용하는 섹션 구조입니다.
 * 섹션을 그대로 나열하기보다는 각 템플릿의 경험 흐름 안에서 재구성하는 용도로 사용합니다.
 */
export interface GeneratedSection {
  title: string;
  body: string;
  items?: string[];
}

export interface GeneratedContent {
  id: string;
  title: string;
  summary: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  settings: ContentSettings;
  settingsJson: string;
  routePath: string;
  sections: GeneratedSection[];
}

export interface MockDatabase {
  version: string;
  description: string;
  plants: PlantRecord[];
}
