import { buildDefaultContentName } from './contentNaming';
import { createDefaultSettings } from './contentGenerator';
import type { ContentSettings, DeploymentUse, GeneratedContent, PlantRecord } from '../types/content';

const selectableDeploymentValues = new Set<DeploymentUse>(['kiosk', 'mobile', 'staticPoster']);
const selectableTemplateValues = new Set<ContentSettings['template']>(['intro', 'storytelling', 'quiz', 'mission']);

export function normalizeTemplate(template: unknown): ContentSettings['template'] {
  return selectableTemplateValues.has(template as ContentSettings['template'])
    ? (template as ContentSettings['template'])
    : 'intro';
}

export function createWizardSettings(editingContent: GeneratedContent | null, fallbackPlantId: string): ContentSettings {
  const settings = editingContent?.settings ?? createDefaultSettings(fallbackPlantId);
  const template = normalizeTemplate(settings.template);
  const deploymentUse = selectableDeploymentValues.has(settings.deploymentUse) ? settings.deploymentUse : 'mobile';

  return {
    ...settings,
    mode: 'advanced',
    template,
    deploymentUse,
    storyScenario: template === 'storytelling' ? settings.storyScenario ?? 'nameSecret' : undefined,
    contentName: settings.contentName || editingContent?.title || '',
    layoutId: settings.layoutId ?? 'generated'
  };
}

export function ensureContentName(
  contentName: string,
  plant: PlantRecord,
  template: ContentSettings['template']
) {
  const trimmed = contentName.trim();
  return trimmed || buildDefaultContentName(plant.koreanName, template);
}
