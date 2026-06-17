import { storyScenarioOptions, templateOptions } from '../../../data/contentOptions';
import { wizardText } from '../../../data/wizardText';
import type { ContentSettings } from '../../../types/content';
import { ChoiceGrid, SelectField } from '../WizardFieldControls';

interface TemplateStepProps {
  template: ContentSettings['template'];
  storyScenario?: ContentSettings['storyScenario'];
  onTemplateChange: (template: ContentSettings['template']) => void;
  onStoryScenarioChange: (storyScenario: NonNullable<ContentSettings['storyScenario']>) => void;
}

export default function TemplateStep({
  template,
  storyScenario,
  onTemplateChange,
  onStoryScenarioChange
}: TemplateStepProps) {
  return (
    <section>
      <ChoiceGrid
        title={wizardText.sections.template}
        description={wizardText.stepDescriptions.template}
        items={templateOptions}
        value={template}
        onChange={onTemplateChange}
      />

      {template === 'storytelling' && (
        <div className="form-grid">
          <SelectField
            label={wizardText.fields.storyScenario}
            options={storyScenarioOptions}
            value={storyScenario ?? 'nameSecret'}
            onChange={onStoryScenarioChange}
          />
        </div>
      )}
    </section>
  );
}
