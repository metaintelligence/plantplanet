import {
  deploymentOptions,
  estimatedTimeOptions,
  fieldLocationOptions,
  seasonOptions
} from '../../../data/contentOptions';
import { wizardText } from '../../../data/wizardText';
import type { ContentSettings } from '../../../types/content';
import { SelectField } from '../WizardFieldControls';
import WizardSectionTitle from '../WizardSectionTitle';

interface FieldStepProps {
  deploymentUse: ContentSettings['deploymentUse'];
  fieldLocation: ContentSettings['fieldLocation'];
  season: ContentSettings['season'];
  estimatedTime: ContentSettings['estimatedTime'];
  extraRequest: string;
  onDeploymentUseChange: (value: ContentSettings['deploymentUse']) => void;
  onFieldLocationChange: (value: ContentSettings['fieldLocation']) => void;
  onSeasonChange: (value: ContentSettings['season']) => void;
  onEstimatedTimeChange: (value: ContentSettings['estimatedTime']) => void;
  onExtraRequestChange: (value: string) => void;
}

export default function FieldStep({
  deploymentUse,
  fieldLocation,
  season,
  estimatedTime,
  extraRequest,
  onDeploymentUseChange,
  onFieldLocationChange,
  onSeasonChange,
  onEstimatedTimeChange,
  onExtraRequestChange
}: FieldStepProps) {
  return (
    <section>
      <WizardSectionTitle title={wizardText.sections.field} description={wizardText.stepDescriptions.field} />
      <div className="form-grid">
        <SelectField
          label={wizardText.fields.deploymentUse}
          options={deploymentOptions}
          value={deploymentUse}
          onChange={onDeploymentUseChange}
        />
        <SelectField
          label={wizardText.fields.fieldLocation}
          options={fieldLocationOptions}
          value={fieldLocation}
          onChange={onFieldLocationChange}
        />
        <SelectField label={wizardText.fields.season} options={seasonOptions} value={season} onChange={onSeasonChange} />
        <SelectField
          label={wizardText.fields.estimatedTime}
          options={estimatedTimeOptions}
          value={estimatedTime}
          onChange={onEstimatedTimeChange}
        />
      </div>
      <label className="field full">
        <span>{wizardText.fields.extraRequest}</span>
        <textarea
          value={extraRequest}
          placeholder={wizardText.placeholders.extraRequest}
          onChange={(event) => onExtraRequestChange(event.target.value)}
        />
      </label>
    </section>
  );
}
