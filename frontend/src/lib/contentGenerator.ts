import {
  audienceOptions,
  deploymentOptions,
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
import type {
  ContentSettings,
  GeneratedContent,
  GeneratedSection,
  PlantRecord
} from '../types/content';

export function createDefaultSettings(plantId = ''): ContentSettings {
  return {
    mode: 'general',
    plantId,
    template: 'intro',
    layoutId: 'default',
    purpose: 'general',
    audience: ['adults'],
    languages: ['ko'],
    season: 'auto',
    estimatedTime: '1min',
    deploymentUse: 'plantQr',
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
  const title = buildTitle(settings, plant);
  const sections = buildSections(settings, plant);
  const settingsJson = JSON.stringify(settings, null, 2);

  return {
    id,
    title,
    summary: `${plant.koreanName}의 ${labelOf(templateOptions, settings.template)} 콘텐츠`,
    status: existing?.status ?? 'draft',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    settings,
    settingsJson,
    routePath: `#/content/${id}`,
    sections
  };
}

function buildTitle(settings: ContentSettings, plant: PlantRecord) {
  const templateLabel = labelOf(templateOptions, settings.template);
  if (settings.template === 'mission') {
    return `${plant.koreanName} 관찰 미션`;
  }
  if (settings.template === 'storytelling') {
    return `${plant.koreanName}가 들려주는 숲 이야기`;
  }
  return `${plant.koreanName} ${templateLabel}`;
}

function buildSections(settings: ContentSettings, plant: PlantRecord): GeneratedSection[] {
  const seasonText = labelOf(seasonOptions, settings.season);
  const focusText = settings.focusTopics.map((topic) => labelOf(focusTopicOptions, topic)).join(', ');
  const languageText = settings.languages.map((language) => labelOf(languageOptions, language)).join(', ');
  const audienceText = settings.audience.map((audience) => labelOf(audienceOptions, audience)).join(', ');

  const commonSections: GeneratedSection[] = [
    {
      title: `${seasonText} 관찰 포인트`,
      body: plant.seasonHighlights[settings.season] || plant.seasonHighlights.auto
    },
    {
      title: '생물 정보',
      body: `${plant.scientificName} / ${plant.family}. ${plant.habitat}에서 잘 자라며 ${plant.size}까지 성장합니다.`,
      items: plant.features
    },
    {
      title: '생성 설정',
      body: `${labelOf(purposeOptions, settings.purpose)} 목적의 ${labelOf(toneOptions, settings.tone)} 콘텐츠입니다.`,
      items: [
        `대상: ${audienceText}`,
        `언어: ${languageText}`,
        `배포: ${labelOf(deploymentOptions, settings.deploymentUse)}`,
        `현장: ${labelOf(fieldLocationOptions, settings.fieldLocation)}`,
        `설명 항목: ${focusText}`,
        `체험 시간: ${labelOf(estimatedTimeOptions, settings.estimatedTime)}`
      ]
    },
    {
      title: '보전 메시지',
      body: plant.conservationMessage
    }
  ];

  if (settings.template === 'quiz') {
    return [
      commonSections[0],
      {
        title: '현장 퀴즈',
        body: `${plant.koreanName}의 특징으로 맞는 것은 무엇일까요?`,
        items: [plant.features[0], '꽃이 전혀 피지 않는다', '밤에만 잎이 자란다']
      },
      ...commonSections.slice(1)
    ];
  }

  if (settings.template === 'mission') {
    return [
      {
        title: '미션 시작',
        body: `${plant.koreanName} 앞에서 30초 동안 멈추고, 아래 항목을 훼손 없이 관찰해보세요.`,
        items: plant.observationTips
      },
      ...commonSections
    ];
  }

  if (settings.template === 'checklist') {
    return [
      {
        title: '관찰 체크리스트',
        body: '아래 항목을 순서대로 확인하며 식물의 특징을 기록합니다.',
        items: plant.observationTips
      },
      ...commonSections
    ];
  }

  if (settings.template === 'storytelling') {
    const scenario = settings.storyScenario
      ? labelOf(storyScenarioOptions, settings.storyScenario)
      : '식물의 하루';
    return [
      {
        title: scenario,
        body: `${plant.koreanName}는 ${plant.origin}에서 이어져 온 생물자원의 이야기를 품고 있습니다. 관람객은 오늘의 계절과 현장 맥락 속에서 이 식물의 시간을 따라가게 됩니다.`
      },
      ...commonSections
    ];
  }

  return commonSections;
}
