import { contentDetailText } from '../../data/contentDetailText';
import { buildContentSettingsSummary } from '../../lib/contentSettingsSummary';
import type { GeneratedContent, PlantRecord } from '../../types/content';

interface GenerationSettingsDialogProps {
  content: GeneratedContent;
  plant: PlantRecord;
  onClose: () => void;
}

export default function GenerationSettingsDialog({ content, plant, onClose }: GenerationSettingsDialogProps) {
  return (
    <div className="dialog-scrim" role="presentation" onMouseDown={onClose}>
      <section
        className="generation-settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="generation-settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="generation-settings-header">
          <div>
            <p className="eyebrow">{contentDetailText.settingsDialog.eyebrow}</p>
            <h2 id="generation-settings-title">{contentDetailText.settingsDialog.title}</h2>
            <p>{contentDetailText.settingsDialog.description(content.title)}</p>
          </div>
          <button className="secondary-button" type="button" onClick={onClose}>
            {contentDetailText.settingsDialog.close}
          </button>
        </div>

        <div className="generation-settings-grid">
          {buildContentSettingsSummary(content, plant).map((item) => (
            <div className="generation-settings-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        {content.settings.extraRequest.trim() && (
          <div className="generation-settings-note">
            <strong>{contentDetailText.settingsDialog.extraRequestTitle}</strong>
            <p>{content.settings.extraRequest.trim()}</p>
          </div>
        )}
      </section>
    </div>
  );
}
