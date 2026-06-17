import { exhibitionViewerText } from '../../data/exhibitionViewer';
import { templateLabelMap } from '../../data/contentOptions';
import type { GeneratedContent, PlantRecord } from '../../types/content';
import type { Marker } from './types';

interface MarkerContentDialogProps {
  activeMarker: Marker | null;
  contents: GeneratedContent[];
  plantLookup: Map<string, PlantRecord>;
  selectedContentId: string | null;
  onSelectContent: (contentId: string) => void;
  onSave: () => void;
  onRemoveAssignment: () => void;
  onDeleteMarker: () => void;
  onClose: () => void;
}

export default function MarkerContentDialog({
  activeMarker,
  contents,
  plantLookup,
  selectedContentId,
  onSelectContent,
  onSave,
  onRemoveAssignment,
  onDeleteMarker,
  onClose
}: MarkerContentDialogProps) {
  if (!activeMarker) {
    return null;
  }

  return (
    <div className="marker-dialog-scrim" role="presentation" onClick={onClose}>
      <div
        className="marker-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="marker-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="marker-dialog-header">
          <div>
            <p className="eyebrow">{exhibitionViewerText.markerDialog.eyebrow}</p>
            <h2 id="marker-dialog-title">{exhibitionViewerText.markerDialog.title}</h2>
          </div>
          <button type="button" className="secondary-button" onClick={onClose}>
            {exhibitionViewerText.markerDialog.close}
          </button>
        </div>

        <div className="marker-dialog-body">
          {contents.length === 0 ? (
            <div className="marker-dialog-empty">
              <strong>{exhibitionViewerText.markerDialog.emptyTitle}</strong>
              <span>{exhibitionViewerText.markerDialog.emptyDescription}</span>
            </div>
          ) : (
            <div className="marker-content-list" role="list">
              {contents.map((content) => {
                const plant = plantLookup.get(content.settings.plantId) ?? null;
                const selected = selectedContentId === content.id;

                return (
                  <button
                    key={content.id}
                    type="button"
                    role="listitem"
                    className={`marker-content-option ${selected ? 'selected' : ''}`}
                    onClick={() => onSelectContent(content.id)}
                  >
                    <strong>{content.title}</strong>
                    <span>{plant?.koreanName ?? content.settings.plantId}</span>
                    <span>{templateLabelMap[content.settings.template] ?? content.settings.template}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="marker-dialog-actions">
          <div className="marker-dialog-actions-left">
            <button type="button" className="danger-button" onClick={onDeleteMarker}>
              {exhibitionViewerText.markerDialog.deleteMarker}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onRemoveAssignment}
              disabled={!activeMarker.contentId}
            >
              {exhibitionViewerText.markerDialog.removeAssignment}
            </button>
          </div>
          <button type="button" className="primary-button" onClick={onSave} disabled={!selectedContentId}>
            {exhibitionViewerText.markerDialog.save}
          </button>
        </div>
      </div>
    </div>
  );
}
