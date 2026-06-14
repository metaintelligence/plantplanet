import type {
  Audience,
  DeploymentUse,
  EstimatedTime,
  FeatureOption,
  FieldLocation,
  FocusTopic,
  Language,
  PagePurpose,
  Season,
  StoryScenario,
  TemplateType,
  Tone
} from '../types/content';

export interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export const templateOptions: Option<TemplateType>[] = [
  { value: 'intro', label: '식물 소개', description: '핵심 정보와 관찰 포인트를 빠르게 보여줍니다.' },
  { value: 'storytelling', label: '스토리텔링', description: '식물을 주인공으로 한 짧은 이야기형 페이지입니다.' },
  { value: 'quiz', label: '퀴즈', description: '객관식/OX형 질문으로 관람객 참여를 유도합니다.' },
  { value: 'mission', label: '미션', description: '현장에서 바로 수행할 수 있는 관찰 과제를 제시합니다.' },
  { value: 'checklist', label: '관찰 체크리스트', description: '꽃, 잎, 열매, 향기 등 관찰 항목을 순서대로 제공합니다.' }
];

export const purposeOptions: Option<PagePurpose>[] = [
  { value: 'general', label: '일반 해설' },
  { value: 'education', label: '교육' },
  { value: 'experience', label: '체험/미션' },
  { value: 'campaign', label: '캠페인' },
  { value: 'promotion', label: '전시 홍보' },
  { value: 'route', label: '관람 동선 유도' }
];

export const audienceOptions: Option<Audience>[] = [
  { value: 'children', label: '아동' },
  { value: 'adults', label: '성인' },
  { value: 'foreigners', label: '외국인' }
];

export const languageOptions: Option<Language>[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
  { value: 'ja', label: '일본어' },
  { value: 'zh', label: '중국어' }
];

export const seasonOptions: Option<Season>[] = [
  { value: 'spring', label: '봄' },
  { value: 'summer', label: '여름' },
  { value: 'autumn', label: '가을' },
  { value: 'winter', label: '겨울' },
  { value: 'auto', label: '자동' }
];

export const estimatedTimeOptions: Option<EstimatedTime>[] = [
  { value: '10sec', label: '10초' },
  { value: '30sec', label: '30초' },
  { value: '1min', label: '1분' },
  { value: '3min', label: '3분' }
];

export const deploymentOptions: Option<DeploymentUse>[] = [
  { value: 'plantQr', label: '식물 표찰 QR' },
  { value: 'kiosk', label: '전시관 키오스크' },
  { value: 'mobileCourse', label: '모바일 관람 코스' },
  { value: 'educationProgram', label: '교육 프로그램' },
  { value: 'sns', label: 'SNS/홍보 페이지' }
];

export const fieldLocationOptions: Option<FieldLocation>[] = [
  { value: 'greenhouse', label: '온실' },
  { value: 'garden', label: '정원' },
  { value: 'outdoorGarden', label: '야외 정원' },
  { value: 'forestTrail', label: '숲길' },
  { value: 'park', label: '공원' }
];

export const focusTopicOptions: Option<FocusTopic>[] = [
  { value: 'appearance', label: '생김새' },
  { value: 'ecology', label: '생태' },
  { value: 'nameOrigin', label: '이름 유래' },
  { value: 'cultureHistory', label: '문화/역사' },
  { value: 'usage', label: '활용' },
  { value: 'conservation', label: '보전 가치' },
  { value: 'comparison', label: '비교 학습' },
  { value: 'funFacts', label: '재미 요소' }
];

export const toneOptions: Option<Tone>[] = [
  { value: 'friendly', label: '친근한 해설사 톤' },
  { value: 'fairytale', label: '동화/캐릭터 톤' },
  { value: 'museum', label: '박물관/전시 해설 톤' },
  { value: 'emotional', label: '감성 스토리텔링 톤' },
  { value: 'expert', label: '학술/전문가 톤' },
  { value: 'campaign', label: '캠페인 톤' }
];

export const featureOptions: Option<FeatureOption>[] = [
  { value: 'voiceGuide', label: '음성 해설' },
  { value: 'qaAi', label: '질문답변 AI' },
  { value: 'similarPlantCards', label: '유사식물카드' }
];

export const storyScenarioOptions: Option<StoryScenario>[] = [
  { value: 'extinction', label: '멸종된다면?' },
  { value: 'dayInLife', label: '식물의 하루' },
  { value: 'timeTravel', label: '시간여행' },
  { value: 'climateSurvival', label: '기후위기 생존기' },
  { value: 'nameSecret', label: '이름의 비밀' }
];

export const labelOf = <T extends string>(options: Option<T>[], value: T) =>
  options.find((option) => option.value === value)?.label ?? value;
