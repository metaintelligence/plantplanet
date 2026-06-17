import { audienceOptions, languageOptions } from '../../../data/contentOptions';
import { wizardText } from '../../../data/wizardText';
import type { ContentSettings } from '../../../types/content';
import { CheckboxGroup } from '../WizardFieldControls';
import WizardSectionTitle from '../WizardSectionTitle';

interface AudienceStepProps {
  audience: ContentSettings['audience'];
  languages: ContentSettings['languages'];
  onToggleAudience: (value: ContentSettings['audience'][number]) => void;
  onToggleLanguage: (value: ContentSettings['languages'][number]) => void;
}

export default function AudienceStep({
  audience,
  languages,
  onToggleAudience,
  onToggleLanguage
}: AudienceStepProps) {
  return (
    <section>
      <WizardSectionTitle title={wizardText.sections.audience} description={wizardText.stepDescriptions.audience} />
      <CheckboxGroup
        label={wizardText.fields.audience}
        options={audienceOptions}
        values={audience}
        onToggle={onToggleAudience}
      />
      <CheckboxGroup
        label={wizardText.fields.languages}
        options={languageOptions}
        values={languages}
        onToggle={onToggleLanguage}
      />
    </section>
  );
}
