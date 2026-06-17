import {
  deploymentOptions,
  estimatedTimeOptions,
  featureOptions,
  fieldLocationOptions,
  seasonOptions
} from '../../../data/contentOptions';
import { wizardText } from '../../../data/wizardText';
import type { ContentSettings } from '../../../types/content';
import { CheckboxGroup, SelectField } from '../WizardFieldControls';
import WizardSectionTitle from '../WizardSectionTitle';

interface FieldStepProps {
  deploymentUse: ContentSettings['deploymentUse'];
  fieldLocation: ContentSettings['fieldLocation'];
  season: ContentSettings['season'];
  estimatedTime: ContentSettings['estimatedTime'];
  featureOptions: ContentSettings['featureOptions'];
  extraRequest: string;
  onDeploymentUseChange: (value: ContentSettings['deploymentUse']) => void;
  onFieldLocationChange: (value: ContentSettings['fieldLocation']) => void;
  onSeasonChange: (value: ContentSettings['season']) => void;
  onEstimatedTimeChange: (value: ContentSettings['estimatedTime']) => void;
  onToggleFeatureOption: (value: ContentSettings['featureOptions'][number]) => void;
  onExtraRequestChange: (value: string) => void;
}

export default function FieldStep({
  deploymentUse,
  fieldLocation,
  season,
  estimatedTime,
  featureOptions: selectedFeatureOptions,
  extraRequest,
  onDeploymentUseChange,
  onFieldLocationChange,
  onSeasonChange,
  onEstimatedTimeChange,
  onToggleFeatureOption,
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
      <CheckboxGroup
        label={wizardText.fields.featureOptions}
        options={featureOptions}
        values={selectedFeatureOptions}
        onToggle={onToggleFeatureOption}
      />
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
