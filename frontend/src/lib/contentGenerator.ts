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
import { contentGeneratorText } from '../data/contentGeneratorText';
import type { ContentSettings, GeneratedContent, GeneratedSection, PlantRecord } from '../types/content';

export function createDefaultSettings(plantId = ''): ContentSettings {
  return {
    mode: 'advanced',
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
    summary: `${plant.koreanName} ${labelOf(templateOptions, settings.template)} ${contentGeneratorText.summarySuffix}`,
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
    return `${plant.koreanName} ${contentGeneratorText.missionTitleSuffix}`;
  }

  if (settings.template === 'storytelling') {
    return `${plant.koreanName} ${contentGeneratorText.storytellingTitleSuffix}`;
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
      title: contentGeneratorText.sectionTitles.seasonalPoint(seasonText),
      body: plant.seasonHighlights[settings.season] || plant.seasonHighlights.auto
    },
    {
      title: contentGeneratorText.sectionTitles.basicInfo,
      body: contentGeneratorText.basicInfoBody(plant.scientificName, plant.family, plant.habitat, plant.size),
      items: plant.features
    },
    {
      title: contentGeneratorText.sectionTitles.settingsSummary,
      body: contentGeneratorText.settingsSummaryBody(
        labelOf(purposeOptions, settings.purpose),
        labelOf(toneOptions, settings.tone)
      ),
      items: [
        `${contentGeneratorText.labels.audience}: ${audienceText}`,
        `${contentGeneratorText.labels.language}: ${languageText}`,
        `${contentGeneratorText.labels.deploymentUse}: ${labelOf(deploymentLabelOptions, settings.deploymentUse)}`,
        `${contentGeneratorText.labels.fieldLocation}: ${labelOf(fieldLocationOptions, settings.fieldLocation)}`,
        `${contentGeneratorText.labels.focusTopics}: ${focusText}`,
        `${contentGeneratorText.labels.estimatedTime}: ${labelOf(estimatedTimeOptions, settings.estimatedTime)}`
      ]
    },
    {
      title: contentGeneratorText.sectionTitles.conservationMessage,
      body: plant.conservationMessage
    }
  ];

  switch (settings.template) {
    case 'quiz':
      return [
        overview[0],
        {
          title: contentGeneratorText.sectionTitles.quizLead,
          body: contentGeneratorText.quizLeadBody(plant.koreanName),
          items: [
            plant.features[0],
            plant.features[1] ?? contentGeneratorText.labels.defaultFeatureFallback,
            plant.observationTips[0]
          ]
        },
        ...overview.slice(1)
      ];
    case 'mission':
      return [
        {
          title: contentGeneratorText.sectionTitles.observationMission,
          body: contentGeneratorText.missionLeadBody(plant.koreanName),
          items: plant.observationTips
        },
        ...overview
      ];
    case 'storytelling':
      return [
        {
          title: labelOf(storyScenarioOptions, settings.storyScenario ?? 'nameSecret'),
          body: contentGeneratorText.storytellingBody(plant.koreanName)
        },
        ...overview
      ];
    case 'intro':
    default:
      return overview;
  }
}
