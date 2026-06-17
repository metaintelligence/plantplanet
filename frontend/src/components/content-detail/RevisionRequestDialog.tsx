import { useState } from 'react';
import { contentDetailText } from '../../data/contentDetailText';
import type { GeneratedContent } from '../../types/content';

interface RevisionRequestDialogProps {
  content: GeneratedContent;
  onClose: () => void;
  onRequestRevision: (content: GeneratedContent, revisionPrompt: string) => Promise<void>;
}

export default function RevisionRequestDialog({
  content,
  onClose,
  onRequestRevision
}: RevisionRequestDialogProps) {
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [revisionError, setRevisionError] = useState('');
  const [submittingRevision, setSubmittingRevision] = useState(false);

  const submitRevision = async () => {
    const prompt = revisionPrompt.trim();
    if (!prompt) {
      setRevisionError(contentDetailText.revisionDialog.emptyPrompt);
      return;
    }

    setSubmittingRevision(true);
    setRevisionError('');

    try {
      await onRequestRevision(content, prompt);
      setRevisionPrompt('');
      onClose();
    } catch (error) {
      setRevisionError(error instanceof Error ? error.message : contentDetailText.revisionDialog.failedFallback);
    } finally {
      setSubmittingRevision(false);
    }
  };

  return (
    <div className="dialog-scrim" role="presentation">
      <section className="revision-dialog" role="dialog" aria-modal="true" aria-labelledby="revision-dialog-title">
        <div>
          <p className="eyebrow">{contentDetailText.revisionDialog.eyebrow}</p>
          <h2 id="revision-dialog-title">{contentDetailText.revisionDialog.title}</h2>
          <p>{contentDetailText.revisionDialog.description}</p>
        </div>
        <label className="field full">
          <span>{contentDetailText.revisionDialog.fieldLabel}</span>
          <textarea
            value={revisionPrompt}
            placeholder={contentDetailText.revisionDialog.placeholder}
            onChange={(event) => setRevisionPrompt(event.target.value)}
          />
        </label>
        {revisionError && <div className="error-banner compact">{revisionError}</div>}
        <div className="dialog-actions">
          <button className="secondary-button" type="button" disabled={submittingRevision} onClick={onClose}>
            {contentDetailText.revisionDialog.cancel}
          </button>
          <button className="primary-button" type="button" disabled={submittingRevision} onClick={submitRevision}>
            {submittingRevision && <span className="button-spinner" aria-hidden="true" />}
            {contentDetailText.revisionDialog.submit}
          </button>
        </div>
      </section>
    </div>
  );
}
