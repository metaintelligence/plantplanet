import { useState } from 'react';
import { contentDetailText } from '../data/contentDetailText';
import DevicePreviewFrame from './preview/DevicePreviewFrame';
import GenerationSettingsDialog from './content-detail/GenerationSettingsDialog';
import RevisionRequestDialog from './content-detail/RevisionRequestDialog';
import type { GeneratedContent, PlantRecord } from '../types/content';

interface ContentDetailProps {
  content: GeneratedContent | null;
  plant: PlantRecord | null;
  onBack: () => void;
  onRequestRevision: (content: GeneratedContent, revisionPrompt: string) => Promise<void>;
}

export default function ContentDetail({ content, plant, onBack, onRequestRevision }: ContentDetailProps) {
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!content || !plant) {
    return (
      <div className="panel not-found-panel">
        <strong>{contentDetailText.missing.title}</strong>
        <span>{contentDetailText.missing.description}</span>
        <button className="secondary-button" type="button" onClick={onBack}>
          {contentDetailText.missing.back}
        </button>
      </div>
    );
  }

  const fullLink = `${window.location.href.split('#')[0]}${content.routePath}`;
  const canRequestRevision = content.settings.layoutId === 'generated';

  return (
    <div className="content-detail-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{contentDetailText.header.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{contentDetailText.header.description}</p>
          <code className="share-link">{fullLink}</code>
        </div>
        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={onBack}>
            {contentDetailText.header.back}
          </button>
          <button
            className="primary-button"
            type="button"
            disabled={!canRequestRevision}
            title={canRequestRevision ? contentDetailText.header.reviseTitle : contentDetailText.header.reviseDisabledTitle}
            onClick={() => setRevisionOpen(true)}
          >
            {contentDetailText.header.revise}
          </button>
        </div>
      </header>

      <div className="content-detail-grid">
        <DevicePreviewFrame content={content} plant={plant} onOpenSettings={() => setSettingsOpen(true)} />
      </div>

      {settingsOpen && <GenerationSettingsDialog content={content} plant={plant} onClose={() => setSettingsOpen(false)} />}
      {revisionOpen && (
        <RevisionRequestDialog
          content={content}
          onClose={() => setRevisionOpen(false)}
          onRequestRevision={onRequestRevision}
        />
      )}
    </div>
  );
}
