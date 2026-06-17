import { focusTopicOptions, purposeOptions, toneOptions } from '../../../data/contentOptions';
import { wizardText } from '../../../data/wizardText';
import type { ContentSettings } from '../../../types/content';
import { CheckboxGroup, SelectField } from '../WizardFieldControls';
import WizardSectionTitle from '../WizardSectionTitle';

interface IntentStepProps {
  purpose: ContentSettings['purpose'];
  tone: ContentSettings['tone'];
  focusTopics: ContentSettings['focusTopics'];
  onPurposeChange: (value: ContentSettings['purpose']) => void;
  onToneChange: (value: ContentSettings['tone']) => void;
  onToggleFocusTopic: (value: ContentSettings['focusTopics'][number]) => void;
}

export default function IntentStep({
  purpose,
  tone,
  focusTopics,
  onPurposeChange,
  onToneChange,
  onToggleFocusTopic
}: IntentStepProps) {
  return (
    <section>
      <WizardSectionTitle title={wizardText.sections.intent} description={wizardText.stepDescriptions.intent} />
      <div className="form-grid">
        <SelectField label={wizardText.fields.purpose} options={purposeOptions} value={purpose} onChange={onPurposeChange} />
        <SelectField label={wizardText.fields.tone} options={toneOptions} value={tone} onChange={onToneChange} />
      </div>
      <CheckboxGroup
        label={wizardText.fields.focusTopics}
        options={focusTopicOptions}
        values={focusTopics}
        onToggle={onToggleFocusTopic}
      />
    </section>
  );
}
