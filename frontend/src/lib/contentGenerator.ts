import {
  audienceOptions,
  deploymentLabelOptions,
  estimatedTimeOptions,
  fieldLocationOptions,
  focusTopicOptions,
  labelOf,
  languageOptions,
  purposeOptions,
  seasonOptions,
  storyScenarioOptions,
  templateOptions,
  toneOptions
} from '../data/contentOptions';
import type { ContentSettings, GeneratedContent, GeneratedSection, PlantRecord } from '../types/content';

export function createDefaultSettings(plantId = ''): ContentSettings {
  return {
    mode: 'general',
    contentName: '',
    plantId,
    template: 'intro',
    layoutId: 'generated',
    purpose: 'general',
    audience: ['adults'],
    languages: ['ko'],
    season: 'auto',
    estimatedTime: '1min',
    deploymentUse: 'mobile',
    fieldLocation: 'garden',
    focusTopics: ['appearance', 'ecology', 'conservation'],
    tone: 'friendly',
    featureOptions: [],
    storyScenario: 'nameSecret',
    extraRequest: ''
  };
}

export function generateContentFromSettings(
  settings: ContentSettings,
  plant: PlantRecord,
  existing?: GeneratedContent
): GeneratedContent {
  const now = new Date().toISOString();
  const id = existing?.id ?? `content-${Date.now().toString(36)}`;

  return {
    id,
    title: buildTitle(settings, plant),
    summary: `${plant.koreanName} ${labelOf(templateOptions, settings.template)} 콘텐츠`,
    status: 'published',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    settings,
    settingsJson: JSON.stringify(settings, null, 2),
    routePath: `#/content/${id}`,
    sections: buildSections(settings, plant)
  };
}

function buildTitle(settings: ContentSettings, plant: PlantRecord) {
  const contentName = settings.contentName.trim();
  if (contentName) {
    return contentName;
  }

  if (settings.template === 'mission') {
    return `${plant.koreanName} 관찰 미션`;
  }

  if (settings.template === 'storytelling') {
    return `${plant.koreanName} 이야기 산책`;
  }

  return `${plant.koreanName} ${labelOf(templateOptions, settings.template)}`;
}

function buildSections(settings: ContentSettings, plant: PlantRecord): GeneratedSection[] {
  const seasonText = labelOf(seasonOptions, settings.season);
  const focusText = settings.focusTopics.map((topic) => labelOf(focusTopicOptions, topic)).join(', ');
  const languageText = settings.languages.map((language) => labelOf(languageOptions, language)).join(', ');
  const audienceText = settings.audience.map((audience) => labelOf(audienceOptions, audience)).join(', ');

  const overview: GeneratedSection[] = [
    {
      title: `${seasonText} 관찰 포인트`,
      body: plant.seasonHighlights[settings.season] || plant.seasonHighlights.auto
    },
    {
      title: '기본 정보',
      body: `${plant.scientificName}, ${plant.family}. ${plant.habitat}에서 자라며 ${plant.size} 정도까지 성장합니다.`,
      items: plant.features
    },
    {
      title: '생성 설정 요약',
      body: `${labelOf(purposeOptions, settings.purpose)} 목적의 ${labelOf(toneOptions, settings.tone)} 콘텐츠입니다.`,
      items: [
        `대상 관람객: ${audienceText}`,
        `언어: ${languageText}`,
        `배포 단말: ${labelOf(deploymentLabelOptions, settings.deploymentUse)}`,
        `현장 위치: ${labelOf(fieldLocationOptions, settings.fieldLocation)}`,
        `강조 콘텐츠: ${focusText}`,
        `예상 체험 시간: ${labelOf(estimatedTimeOptions, settings.estimatedTime)}`
      ]
    },
    {
      title: '보전 메시지',
      body: plant.conservationMessage
    }
  ];

  switch (settings.template) {
    case 'quiz':
      return [
        overview[0],
        {
          title: '시작 퀴즈',
          body: `${plant.koreanName}의 특징으로 가장 알맞은 것을 떠올려 보세요.`,
          items: [plant.features[0], plant.features[1] ?? '잎과 줄기 관찰하기', plant.observationTips[0]]
        },
        ...overview.slice(1)
      ];
    case 'mission':
      return [
        {
          title: '관찰 미션 시작',
          body: `${plant.koreanName} 앞에서 멈춰 서서 아래 관찰 미션을 순서대로 수행해 보세요.`,
          items: plant.observationTips
        },
        ...overview
      ];
    case 'storytelling':
      return [
        {
          title: labelOf(storyScenarioOptions, settings.storyScenario ?? 'nameSecret'),
          body: `${plant.koreanName}의 특징과 현장 분위기를 엮어 하나의 이야기 흐름으로 따라가도록 구성합니다.`
        },
        ...overview
      ];
    case 'intro':
    default:
      return overview;
  }
}
