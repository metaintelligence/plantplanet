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

/**
 * 콘텐츠의 대표 경험 유형입니다.
 *
 * 이 값은 단순 분류 라벨이 아니라, 페이지의 정보 구조와 상호작용 방식의 1차 기준입니다.
 * 생성형 AI는 아래 값을 "화면 제목에 적는 단어" 정도로 취급하지 말고,
 * 어떤 방문자 경험을 설계해야 하는지 결정하는 핵심 조건으로 해석해야 합니다.
 *
 * - intro: 식물의 핵심 정보를 짧고 명료하게 소개하는 해설형 페이지
 * - storytelling: 식물 정보를 특정 이야기 관점으로 풀어내는 서사형 페이지
 * - quiz: 질문과 선택/정답 흐름이 중심이 되는 참여형 퀴즈 페이지
 * - mission: 관찰 행동, 탐색 과제, 체크 포인트 수행이 중심이 되는 체험형 페이지
 */
export type TemplateType = 'intro' | 'storytelling' | 'quiz' | 'mission';

/**
 * 콘텐츠 제작의 우선 목적입니다.
 *
 * 같은 식물이라도 purpose 값에 따라 강조 메시지, CTA, 정보 배열 순서가 달라질 수 있습니다.
 * 생성형 AI는 이 값을 "부제목용 키워드"가 아니라 콘텐츠의 의도와 운영 맥락으로 해석해야 합니다.
 *
 * - general: 범용 식물 해설
 * - education: 학습/이해 중심 설명
 * - experience: 관람객 참여/체험 유도 중심
 * - campaign: 보전, 실천, 인식 제고 메시지 중심
 * - promotion: 전시, 행사, 공간 매력 소개 중심
 * - route: 관람 동선, 위치, 다음 행동 안내 중심
 */
export type PagePurpose = 'general' | 'education' | 'experience' | 'campaign' | 'promotion' | 'route';

/**
 * 주 관람자 집단입니다.
 *
 * 복수 선택이 가능하지만, 실제 생성 시에는 가장 우선되는 관람층을 중심으로
 * 어휘 수준, 문장 길이, 상호작용 난이도, 문화권 배경설명을 조정해야 합니다.
 *
 * - children: 쉬운 표현, 짧은 지시문, 관찰 유도 강화
 * - adults: 정보 밀도와 설명 완성도 강화
 * - foreigners: 문화/고유명사 배경 설명 보강, 언어 장벽 고려
 */
export type Audience = 'children' | 'adults' | 'foreigners';

/**
 * 현재 서비스 범위는 한국어 중심이지만,
 * 향후 구조 확장을 고려해 언어 타입 자체는 유지합니다.
 *
 * 다만 현 시점에서 UI/상수/설명 체계는 한수정 내부 사용성을 우선하므로
 * 다국어 일반화보다 한국어 도메인 명확성을 우선합니다.
 */
export type Language = 'ko' | 'en' | 'ja' | 'zh';

/**
 * 콘텐츠를 생성할 시점의 계절 맥락입니다.
 *
 * CLI는 이 값을 단순 메타데이터로 보지 말고,
 * 현재 보이기 쉬운 식물 특징/관찰 포인트/문장 톤에 반영해야 합니다.
 *
 * - auto: 계절을 특정하지 못하는 경우의 중립 모드이며,
 *   사계절 공통 설명 또는 무리 없는 범용 설명을 우선합니다.
 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'auto';

/**
 * 목표 체류/소비 시간입니다.
 *
 * 이 값은 정보량 상한을 정하는 강한 제약 조건입니다.
 * 생성형 AI는 시간이 짧을수록 화면 요소 수와 텍스트 길이를 줄여야 하며,
 * 시간이 길수록 서브 설명, 추가 상호작용, 보조 섹션을 늘릴 수 있습니다.
 */
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

/**
 * 실제 전시/관람 현장의 공간 맥락입니다.
 *
 * 현장 위치는 배경 문구, 시선 유도, 관찰 행동 제안에 반영할 수 있습니다.
 * 예를 들어 숲길이라면 이동 중 관찰을, 온실이라면 근거리 관찰과 재배 환경 설명을 강화할 수 있습니다.
 */
export type FieldLocation = 'greenhouse' | 'garden' | 'outdoorGarden' | 'forestTrail' | 'park';

/**
 * 콘텐츠가 우선적으로 다뤄야 할 주제 축입니다.
 *
 * 복수 선택이 가능하며, 생성형 AI는 이 값을 섹션 우선순위에 직접 반영해야 합니다.
 * 선택되지 않은 주제는 필요할 때만 보조적으로 사용하고,
 * 선택된 주제는 첫 화면 메시지나 핵심 카드/퀴즈/미션에 적극 반영합니다.
 *
 * - appearance: 생김새, 형태, 색, 구조
 * - ecology: 생태, 생육 환경, 상호작용
 * - nameOrigin: 이름의 유래, 명칭 해석
 * - cultureHistory: 역사, 문화, 상징, 스토리
 * - usage: 활용, 쓰임, 생활 연관성
 * - conservation: 보호 필요성, 보전 가치
 * - comparison: 유사 식물과의 비교
 * - funFacts: 흥미 요소, 놀라운 사실, 관람 흡입 포인트
 */
export type FocusTopic =
  | 'appearance'
  | 'ecology'
  | 'nameOrigin'
  | 'cultureHistory'
  | 'usage'
  | 'conservation'
  | 'comparison'
  | 'funFacts';

/**
 * 추가 기능 옵션입니다.
 *
 * 현재 구현 범위와 무관하게, CLI는 이 값을 미래 확장 힌트가 아니라
 * 현재 화면 설계의 보조 요구조건으로 읽어야 합니다.
 * 다만 실제 미구현 기능을 허위로 동작하는 것처럼 만들면 안 되고,
 * 필요 시 "준비된 UI" 수준으로만 반영해야 합니다.
 */
export type FeatureOption = 'voiceGuide' | 'qaAi' | 'similarPlantCards';

/**
 * 문장 톤과 정서적 분위기입니다.
 *
 * tone은 카피라이팅 성향을 정하는 값입니다.
 * 생성형 AI는 문체, 안내 방식, 감정 밀도, 권위감 수준을 이 값에 맞게 조절해야 합니다.
 */
export type Tone = 'friendly' | 'fairytale' | 'museum' | 'emotional' | 'expert' | 'campaign';

/**
 * 스토리텔링 템플릿 전용 세부 시나리오입니다.
 *
 * storytelling 템플릿일 때 특히 중요하며,
 * 같은 식물이라도 어떤 이야기 장치를 중심에 둘지 정하는 값입니다.
 *
 * - extinction: 사라질 위기/보전의 시선
 * - dayInLife: 식물의 하루를 따라가는 시선
 * - timeTravel: 과거-현재를 넘나드는 역사적 시선
 * - climateSurvival: 기후와 생존 적응의 시선
 * - nameSecret: 이름의 의미와 유래를 푸는 시선
 */
export type StoryScenario = 'extinction' | 'dayInLife' | 'timeTravel' | 'climateSurvival' | 'nameSecret';

/**
 * 레이아웃 생성 전략입니다.
 *
 * - generated: CLI가 요청 조건을 바탕으로 새 TSX 페이지를 생성
 * - default: 미리 준비된 정적 기본 레이아웃 템플릿을 사용
 *
 * generated는 시각/구조적 자유도가 높고,
 * default는 안정적이지만 커스텀 폭이 좁다는 의미를 내포합니다.
 */
export type LayoutId = 'generated' | 'default';

/**
 * 콘텐츠 공개 상태입니다.
 *
 * 현재 운영 정책상 생성되면 곧바로 사용되는 흐름이 많더라도,
 * 데이터 구조상 상태 필드는 유지하여 이후 검수/운영 확장에 대비합니다.
 */
export type ContentStatus = 'draft' | 'published';

/**
 * 식물의 거친 생장 형태 분류입니다.
 * 페이지 문장에 그대로 노출하기보다는 설명 어휘 선택이나 비교 문맥의 보조 정보로 활용합니다.
 */
export type PlantCategory = 'tree' | 'shrub' | 'herb';

export interface PlantImage {
  /**
   * 실제 렌더링에 사용하는 이미지 URL입니다.
   */
  url: string;

  /**
   * 접근성용 대체 텍스트이자, 이미지 설명 문장의 원천입니다.
   * 필요하면 축약해 사용할 수 있지만 이미지 의미를 왜곡하면 안 됩니다.
   */
  alt: string;

  /**
   * 이미지 출처명입니다.
   * 방문자 화면에 작게 표기하거나, 필요 시 크레딧 영역에 사용할 수 있습니다.
   */
  source: string;

  /**
   * 출처 원문 링크입니다.
   * 화면에 직접 노출하지 않아도 되지만, 메타 정보 보존이 필요합니다.
   */
  sourceUrl: string;

  /**
   * 라이선스 정보입니다.
   * 이미지 크레딧 표기 판단의 근거로 사용합니다.
   */
  license: string;
}

export interface PlantRecord {
  /**
   * mock DB와 생성 콘텐츠 설정에서 참조하는 고유 식별자입니다.
   * 콘텐츠 생성 요청의 `plantId`는 반드시 이 값과 매칭됩니다.
   */
  id: string;

  /**
   * 식물의 기본 생장 형태 분류입니다.
   * 문장 안에서 "교목/관목/초본"을 직접 쓰기보다는, 설명 관점 선택의 참고값으로 사용합니다.
   */
  category: PlantCategory;

  /**
   * 방문자에게 가장 우선적으로 보여줄 한글 대표명입니다.
   * 대부분의 화면 메인 타이틀은 이 값을 기준으로 합니다.
   */
  koreanName: string;

  /**
   * 학명입니다.
   * 부제, 보조 정보, 전문성 보강 요소로 사용하되 과도하게 전면에 배치하지는 않습니다.
   */
  scientificName: string;

  /**
   * 영문/일반명입니다.
   * 외국인 관람객 대응 또는 보조 표기용입니다.
   */
  commonName: string;

  /**
   * 과(family) 정보입니다.
   * 비교 설명이나 기본 정보 카드 구성에 활용할 수 있습니다.
   */
  family: string;

  /**
   * 원산지 또는 주요 기원 정보입니다.
   * 문화/역사/이동성 관련 설명의 근거가 될 수 있습니다.
   */
  origin: string;

  /**
   * 대표 서식 환경입니다.
   * fieldLocation과 함께 읽어 현장감 있는 설명을 구성할 때 도움이 됩니다.
   */
  habitat: string;

  /**
   * 대표 크기 범위입니다.
   * 방문자에게 스케일감을 주는 짧은 정보 카드나 비교 설명에 적합합니다.
   */
  size: string;

  /**
   * 개화 또는 대표 관찰 시기입니다.
   * season과 함께 읽어 현재 시점에 맞는 설명을 고르는 데 사용합니다.
   */
  floweringSeason: string;

  /**
   * 식물의 핵심 특징 목록입니다.
   * 이 배열을 그대로 장황하게 복붙하지 말고, 핵심 포인트를 골라 자연스러운 설명으로 재구성해야 합니다.
   */
  features: string[];

  /**
   * 보전 메시지입니다.
   * conservation 목적 또는 캠페인 톤일 때 특히 중요하게 반영합니다.
   */
  conservationMessage: string;

  /**
   * 실제 현장에서 유효한 관찰 팁입니다.
   * 미션/퀴즈/체험형 페이지에서 매우 유용하지만, 필요 시 intro에도 일부만 녹여 넣을 수 있습니다.
   */
  observationTips: string[];

  /**
   * 계절별 대표 포인트입니다.
   * `auto`는 범용/중립 설명용으로 사용될 수 있으며,
   * 현재 season 값과 가장 잘 맞는 텍스트를 우선 활용해야 합니다.
   */
  seasonHighlights: Record<Season, string>;

  /**
   * 대표 이미지 메타데이터입니다.
   * 실제 화면 비주얼과 크레딧 처리의 원천입니다.
   */
  image: PlantImage;

  /**
   * 비슷한 식물의 ID 목록입니다.
   * comparison 주제나 유사 식물 추천 카드의 근거로 활용할 수 있습니다.
   */
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
  /**
   * 생성 절차 모드입니다.
   * 현재 UI가 고급 생성 중심으로 운영되더라도, 저장 데이터 구조상 모드 값은 유지합니다.
   */
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
  /**
   * 섹션 제목입니다.
   * 화면의 카드 헤더/소제목/질문 블록명 등으로 재해석해 사용할 수 있습니다.
   */
  title: string;

  /**
   * 섹션의 핵심 본문입니다.
   * 원문을 그대로 모두 노출하기보다, 레이아웃 흐름에 맞게 분산/강조/축약할 수 있습니다.
   */
  body: string;

  /**
   * 선택적 보조 목록입니다.
   * 반드시 렌더링해야 하는 강제 데이터는 아니며, 콘텐츠 유형에 도움이 될 때만 사용합니다.
   */
  items?: string[];
}

/**
 * 실제 생성/저장/렌더링되는 콘텐츠 1건의 공통 구조입니다.
 *
 * CLI가 새 페이지를 만들 때도, 프런트엔드가 기존 콘텐츠를 다시 보여줄 때도
 * 이 구조를 공통 계약으로 사용합니다.
 */
export interface GeneratedContent {
  /**
   * 콘텐츠 고유 ID입니다.
   * 라우팅, 파일명, 작업 이력 연결의 기준이 됩니다.
   */
  id: string;

  /**
   * 방문자/운영자에게 보이는 대표 제목입니다.
   */
  title: string;

  /**
   * 목록 카드나 요약 영역에 쓰는 짧은 설명입니다.
   */
  summary: string;

  /**
   * 현재 콘텐츠의 운영 상태입니다.
   */
  status: ContentStatus;

  /**
   * 최초 생성 시각입니다.
   */
  createdAt: string;

  /**
   * 마지막 갱신 시각입니다.
   * AI 수정 요청 이후에도 이 값이 갱신됩니다.
   */
  updatedAt: string;

  /**
   * 파싱된 구조화 설정 객체입니다.
   * 프런트엔드가 의미 기반으로 다시 활용할 때 우선 참조합니다.
   */
  settings: ContentSettings;

  /**
   * 원본 요청 JSON 문자열입니다.
   * 수정 이력, 디버깅, 재생성, CLI 재해석의 근거로 보존합니다.
   */
  settingsJson: string;

  /**
   * 방문자가 실제 접근하는 콘텐츠 경로입니다.
   */
  routePath: string;

  /**
   * 기본 생성기/생성형 레이아웃이 공통으로 참고하는 보조 섹션 데이터입니다.
   * 생성 페이지는 이를 그대로 일렬 렌더링하지 말고, 레이아웃에 맞게 재구성해야 합니다.
   */
  sections: GeneratedSection[];
}

/**
 * 목업 식물 데이터 저장소의 루트 구조입니다.
 * 현재는 mock DB이지만, 향후 실제 DB/콘텐츠 소스로 치환되더라도 유사한 계약을 유지할 수 있습니다.
 */
export interface MockDatabase {
  /**
   * 데이터셋 버전입니다.
   */
  version: string;

  /**
   * 데이터셋 설명입니다.
   */
  description: string;

  /**
   * 식물 레코드 목록입니다.
   * 생성 프롬프트에서 selectedPlant를 찾는 원천 데이터이기도 합니다.
   */
  plants: PlantRecord[];
}
