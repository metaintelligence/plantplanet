import { buildDefaultContentName } from '../../../lib/contentNaming';
import { wizardText } from '../../../data/wizardText';
import type { ContentSettings, GeneratedContent, PlantRecord } from '../../../types/content';
import WizardSectionTitle from '../WizardSectionTitle';
import WizardSelectionSummary from '../WizardSelectionSummary';

interface ReviewStepProps {
  draft: ContentSettings;
  plant: PlantRecord;
  editingContent: GeneratedContent | null;
  generationBlocked: boolean;
  isSubmitting: boolean;
  statusMessage: string;
  onContentNameChange: (value: string) => void;
  onGenerate: () => void;
}

export default function ReviewStep({
  draft,
  plant,
  editingContent,
  generationBlocked,
  isSubmitting,
  statusMessage,
  onContentNameChange,
  onGenerate
}: ReviewStepProps) {
  const fallbackName = buildDefaultContentName(plant.koreanName, draft.template);
  const canGenerate = Boolean(draft.contentName.trim()) && !isSubmitting && !generationBlocked;

  return (
    <section>
      <WizardSectionTitle
        title={wizardText.sections.review}
        description={wizardText.dynamicDescriptions.review(plant.koreanName)}
      />
      <label className="field content-name-field">
        <span>{wizardText.fields.contentName}</span>
        <input
          required
          value={draft.contentName}
          placeholder={wizardText.placeholders.contentName(fallbackName)}
          onChange={(event) => onContentNameChange(event.target.value)}
        />
      </label>
      <WizardSelectionSummary draft={draft} plant={plant} />
      {statusMessage && <div className="socket-status">{statusMessage}</div>}
      <button className="primary-button" type="button" disabled={!canGenerate} onClick={onGenerate}>
        {isSubmitting && <span className="button-spinner" aria-hidden="true" />}
        {isSubmitting
          ? wizardText.status.submitLoading
          : draft.layoutId === 'default'
            ? wizardText.status.useDefaultLayout
            : editingContent
              ? wizardText.status.applyEdit
              : wizardText.status.createContent}
      </button>
    </section>
  );
}
