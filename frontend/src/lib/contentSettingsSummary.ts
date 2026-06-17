import {
  audienceOptions,
  deploymentOptions,
  estimatedTimeOptions,
  fieldLocationOptions,
  focusTopicOptions,
  labelOf,
  languageOptions,
  layoutOptions,
  purposeOptions,
  seasonOptions,
  storyScenarioOptions,
  templateOptions,
  toneOptions
} from '../data/contentOptions';
import { contentSettingsText } from '../data/contentSettingsText';
import type { ContentSettings, GeneratedContent, PlantRecord } from '../types/content';

export interface SummaryItem {
  label: string;
  value: string;
}

export function joinOptionLabels<T extends string>(options: Array<{ value: T; label: string }>, values: T[]) {
  return values.length
    ? values.map((value) => labelOf(options, value)).join(', ')
    : contentSettingsText.summaryItems.none;
}

export function buildWizardSummaryItems(settings: ContentSettings, plant: PlantRecord): SummaryItem[] {
  const items: SummaryItem[] = [
    { label: contentSettingsText.summaryItems.mode, value: contentSettingsText.summaryItems.advancedMode },
    { label: contentSettingsText.summaryItems.plant, value: `${plant.koreanName} / ${plant.scientificName}` },
    { label: contentSettingsText.summaryItems.template, value: labelOf(templateOptions, settings.template) },
    { label: contentSettingsText.summaryItems.layout, value: labelOf(layoutOptions, settings.layoutId) },
    { label: contentSettingsText.summaryItems.purpose, value: labelOf(purposeOptions, settings.purpose) },
    { label: contentSettingsText.summaryItems.tone, value: labelOf(toneOptions, settings.tone) },
    { label: contentSettingsText.summaryItems.audience, value: joinOptionLabels(audienceOptions, settings.audience) },
    { label: contentSettingsText.summaryItems.language, value: joinOptionLabels(languageOptions, settings.languages) },
    { label: contentSettingsText.summaryItems.deploymentUse, value: labelOf(deploymentOptions, settings.deploymentUse) },
    { label: contentSettingsText.summaryItems.fieldLocation, value: labelOf(fieldLocationOptions, settings.fieldLocation) },
    { label: contentSettingsText.summaryItems.season, value: labelOf(seasonOptions, settings.season) },
    { label: contentSettingsText.summaryItems.estimatedTime, value: labelOf(estimatedTimeOptions, settings.estimatedTime) },
    { label: contentSettingsText.summaryItems.focusTopics, value: joinOptionLabels(focusTopicOptions, settings.focusTopics) }
  ];

  if (settings.template === 'storytelling') {
    items.push({
      label: contentSettingsText.summaryItems.storyScenario,
      value: labelOf(storyScenarioOptions, settings.storyScenario ?? 'nameSecret')
    });
  }

  return items;
}

export function buildContentSettingsSummary(content: GeneratedContent, plant: PlantRecord): SummaryItem[] {
  const wizardItems = buildWizardSummaryItems(content.settings, plant);

  return [
    { label: contentSettingsText.summaryItems.contentName, value: content.title },
    ...wizardItems.filter((item) => item.label !== contentSettingsText.summaryItems.mode)
  ];
}
