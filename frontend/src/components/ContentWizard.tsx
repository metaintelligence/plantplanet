import { useEffect, useState } from 'react';
import { appText } from '../data/appText';
import { wizardSteps } from '../data/wizardSteps';
import { wizardText } from '../data/wizardText';
import { buildDefaultContentName } from '../lib/contentNaming';
import { createWizardSettings, ensureContentName } from '../lib/contentSettings';
import { generateContentFromSettings } from '../lib/contentGenerator';
import { PlantDataDialog } from './PlantDataCard';
import AudienceStep from './wizard/steps/AudienceStep';
import FieldStep from './wizard/steps/FieldStep';
import IntentStep from './wizard/steps/IntentStep';
import LayoutStep from './wizard/steps/LayoutStep';
import PlantStep from './wizard/steps/PlantStep';
import ReviewStep from './wizard/steps/ReviewStep';
import TemplateStep from './wizard/steps/TemplateStep';
import WizardStepSidebar from './wizard/WizardStepSidebar';
import type { ContentSettings, GeneratedContent, PlantRecord } from '../types/content';

interface ContentWizardProps {
  plants: PlantRecord[];
  editingContent: GeneratedContent | null;
  generationBlocked: boolean;
  activeJobTitle?: string;
  onGenerate: (content: GeneratedContent) => Promise<void>;
  onCancel: () => void;
}

type StepKey = (typeof wizardSteps)[number];

export default function ContentWizard({
  plants,
  editingContent,
  generationBlocked,
  activeJobTitle,
  onGenerate,
  onCancel
}: ContentWizardProps) {
  const [draft, setDraft] = useState<ContentSettings>(() => createWizardSettings(editingContent, plants[0]?.id ?? ''));
  const [stepIndex, setStepIndex] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoPlant, setInfoPlant] = useState<PlantRecord | null>(null);

  useEffect(() => {
    setDraft(createWizardSettings(editingContent, plants[0]?.id ?? ''));
    setStepIndex(0);
    setGenerationStatus('');
  }, [editingContent, plants]);

  const step = wizardSteps[stepIndex] as StepKey;
  const selectedPlant = plants.find((plant) => plant.id === draft.plantId) ?? plants[0];
  const isLastStep = stepIndex === wizardSteps.length - 1;
  const canGoNext = step !== 'plant' || Boolean(draft.plantId);

  useEffect(() => {
    if (!selectedPlant || draft.contentName.trim()) {
      return;
    }

    const nextName = buildDefaultContentName(selectedPlant.koreanName, draft.template);
    setDraft((current) => (current.contentName === nextName ? current : { ...current, contentName: nextName }));
  }, [draft.contentName, draft.template, selectedPlant]);

  const update = <K extends keyof ContentSettings>(key: K, value: ContentSettings[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const toggleList = <K extends 'focusTopics' | 'audience' | 'languages'>(
    key: K,
    value: ContentSettings[K][number]
  ) => {
    setDraft((current) => {
      const values = current[key] as string[];
      const nextValues = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      return { ...current, [key]: nextValues };
    });
  };

  const handleLayoutChange = (layoutId: ContentSettings['layoutId']) => {
    if (layoutId === 'default') {
      window.alert(wizardText.alerts.defaultLayout);
    }
    update('layoutId', layoutId);
  };

  const handleTemplateChange = (template: ContentSettings['template']) => {
    setDraft((current) => ({
      ...current,
      template,
      storyScenario: template === 'storytelling' ? current.storyScenario ?? 'nameSecret' : undefined
    }));
  };

  const handleGenerate = async () => {
    if (!selectedPlant) {
      return;
    }

    if (generationBlocked) {
      setGenerationStatus(
        activeJobTitle ? wizardText.blocked.withTitle(activeJobTitle) : wizardText.blocked.generic
      );
      return;
    }

    const contentName = ensureContentName(draft.contentName, selectedPlant, draft.template);
    if (!contentName.trim()) {
      setGenerationStatus(wizardText.status.emptyName);
      return;
    }

    const generationSettings: ContentSettings = {
      ...draft,
      contentName
    };

    const generatedContent = generateContentFromSettings(generationSettings, selectedPlant, editingContent ?? undefined);

    setIsSubmitting(true);
    setGenerationStatus(
      generationSettings.layoutId === 'default'
        ? wizardText.status.defaultLayoutSaving
        : wizardText.status.generatedLayoutSaving
    );

    try {
      await onGenerate(generatedContent);
    } catch (error) {
      setGenerationStatus(error instanceof Error ? error.message : appText.generation.requestFailedFallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wizard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{wizardText.header.eyebrow}</p>
          <h1>{editingContent ? wizardText.header.editTitle : wizardText.header.createTitle}</h1>
          <p>{wizardText.header.description}</p>
        </div>
        <button className="secondary-button" type="button" onClick={onCancel}>
          {wizardText.header.backToManager}
        </button>
      </header>

      {generationBlocked && (
        <div className="notice-banner">
          {activeJobTitle ? wizardText.blocked.withTitle(activeJobTitle) : wizardText.blocked.generic}
        </div>
      )}

      <div className="wizard-layout">
        <WizardStepSidebar stepIndex={stepIndex} />

        <section className="wizard-card">
          {step === 'plant' && (
            <PlantStep
              plants={plants}
              selectedPlantId={draft.plantId}
              onSelectPlant={(plantId) => update('plantId', plantId)}
              onOpenPlantInfo={setInfoPlant}
            />
          )}

          {step === 'intent' && (
            <IntentStep
              purpose={draft.purpose}
              tone={draft.tone}
              focusTopics={draft.focusTopics}
              onPurposeChange={(value) => update('purpose', value)}
              onToneChange={(value) => update('tone', value)}
              onToggleFocusTopic={(value) => toggleList('focusTopics', value)}
            />
          )}

          {step === 'template' && (
            <TemplateStep
              template={draft.template}
              storyScenario={draft.storyScenario}
              onTemplateChange={handleTemplateChange}
              onStoryScenarioChange={(value) => update('storyScenario', value)}
            />
          )}

          {step === 'layout' && <LayoutStep layoutId={draft.layoutId} onLayoutChange={handleLayoutChange} />}

          {step === 'audience' && (
            <AudienceStep
              audience={draft.audience}
              languages={draft.languages}
              onToggleAudience={(value) => toggleList('audience', value)}
              onToggleLanguage={(value) => toggleList('languages', value)}
            />
          )}

          {step === 'field' && (
            <FieldStep
              deploymentUse={draft.deploymentUse}
              fieldLocation={draft.fieldLocation}
              season={draft.season}
              estimatedTime={draft.estimatedTime}
              extraRequest={draft.extraRequest}
              onDeploymentUseChange={(value) => update('deploymentUse', value)}
              onFieldLocationChange={(value) => update('fieldLocation', value)}
              onSeasonChange={(value) => update('season', value)}
              onEstimatedTimeChange={(value) => update('estimatedTime', value)}
              onExtraRequestChange={(value) => update('extraRequest', value)}
            />
          )}

          {step === 'review' && selectedPlant && (
            <ReviewStep
              draft={draft}
              plant={selectedPlant}
              editingContent={editingContent}
              generationBlocked={generationBlocked}
              isSubmitting={isSubmitting}
              statusMessage={generationStatus}
              onContentNameChange={(value) => update('contentName', value)}
              onGenerate={handleGenerate}
            />
          )}

          <footer className="wizard-footer">
            <button
              className="secondary-button"
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            >
              {wizardText.buttons.previous}
            </button>
            {!isLastStep && (
              <button
                className="primary-button"
                type="button"
                disabled={!canGoNext}
                onClick={() => setStepIndex((current) => current + 1)}
              >
                {wizardText.buttons.next}
              </button>
            )}
          </footer>
        </section>
      </div>

      {infoPlant && <PlantDataDialog plant={infoPlant} onClose={() => setInfoPlant(null)} />}
    </div>
  );
}
