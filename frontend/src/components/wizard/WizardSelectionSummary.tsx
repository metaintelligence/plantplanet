import { wizardText } from '../../data/wizardText';
import { buildWizardSummaryItems } from '../../lib/contentSettingsSummary';
import type { ContentSettings, PlantRecord } from '../../types/content';

interface WizardSelectionSummaryProps {
  draft: ContentSettings;
  plant: PlantRecord;
}

export default function WizardSelectionSummary({ draft, plant }: WizardSelectionSummaryProps) {
  const summaryItems = buildWizardSummaryItems(draft, plant);

  return (
    <div className="wizard-summary-panel">
      <div className="wizard-summary-hero">
        <img src={plant.image.url} alt={plant.image.alt} />
        <div>
          <p className="eyebrow">{wizardText.summary.eyebrow}</p>
          <h3>{plant.koreanName}</h3>
          <span>{plant.commonName}</span>
        </div>
      </div>

      <dl className="wizard-summary-grid">
        {summaryItems.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>

      {draft.extraRequest.trim() && (
        <div className="wizard-summary-request">
          <strong>{wizardText.summary.extraRequestTitle}</strong>
          <p>{draft.extraRequest.trim()}</p>
        </div>
      )}
    </div>
  );
}
