import { useMemo, useState } from 'react';
import { contentManagerText } from '../data/contentManagerText';
import { templateLabelMap } from '../data/contentOptions';
import GenerationJobList from './GenerationJobList';
import type { GeneratedContent, PlantRecord } from '../types/content';
import type { LayoutGenerationJob } from '../types/generationJob';

interface ContentManagerProps {
  contents: GeneratedContent[];
  plants: PlantRecord[];
  generationJobs: LayoutGenerationJob[];
  onCreate: () => void;
  onOpen: (contentId: string) => void;
  onDelete: (contentId: string) => void;
}

export default function ContentManager({
  contents,
  plants,
  generationJobs,
  onCreate,
  onOpen,
  onDelete
}: ContentManagerProps) {
  const [historyContentId, setHistoryContentId] = useState<string | null>(null);

  const historyContent = contents.find((content) => content.id === historyContentId) ?? null;
  const historyJobs = useMemo(() => {
    if (!historyContentId) {
      return [];
    }

    return generationJobs
      .filter((job) => job.contentId === historyContentId)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
  }, [generationJobs, historyContentId]);

  return (
    <div className="manager-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{contentManagerText.header.eyebrow}</p>
          <h1>{contentManagerText.header.title}</h1>
          <p>{contentManagerText.header.description}</p>
        </div>
        <button className="primary-button" type="button" onClick={onCreate}>
          {contentManagerText.header.create}
        </button>
      </header>

      {contents.length === 0 ? (
        <div className="panel empty-manager">
          <strong>{contentManagerText.empty.title}</strong>
          <span>{contentManagerText.empty.description}</span>
          <button className="primary-button" type="button" onClick={onCreate}>
            {contentManagerText.empty.create}
          </button>
        </div>
      ) : (
        <div className="content-table">
          {contents.map((content) => {
            const plant = plants.find((item) => item.id === content.settings.plantId);
            const fullLink = `${window.location.href.split('#')[0]}${content.routePath}`;

            return (
              <article className="content-row" key={content.id}>
                <div className="content-row-main">
                  <span className="status-dot published">{contentManagerText.status.published}</span>
                  <h2>{content.title}</h2>
                  <p>
                    {plant?.koreanName ?? content.settings.plantId} / {content.summary}
                  </p>
                  <code>{fullLink}</code>
                </div>
                <div className="content-row-actions">
                  <button className="secondary-button" type="button" onClick={() => onOpen(content.id)}>
                    {contentManagerText.actions.open}
                  </button>
                  <button className="secondary-button" type="button" onClick={() => setHistoryContentId(content.id)}>
                    {contentManagerText.actions.history}
                  </button>
                  <button className="danger-button" type="button" onClick={() => onDelete(content.id)}>
                    {contentManagerText.actions.delete}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {historyContent && (
        <div className="dialog-scrim" role="presentation" onMouseDown={() => setHistoryContentId(null)}>
          <section
            className="job-history-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-history-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="generation-settings-header">
              <div>
                <p className="eyebrow">{contentManagerText.history.eyebrow}</p>
                <h2 id="job-history-dialog-title">{contentManagerText.history.title}</h2>
                <p>{contentManagerText.history.description(historyContent.title)}</p>
              </div>
              <button className="secondary-button" type="button" onClick={() => setHistoryContentId(null)}>
                {contentManagerText.actions.close}
              </button>
            </header>

            <div className="job-history-dialog-body">
              <div className="job-history-meta">
                <div className="generation-settings-item">
                  <span>{contentManagerText.history.fields.contentName}</span>
                  <strong>{historyContent.title}</strong>
                </div>
                <div className="generation-settings-item">
                  <span>{contentManagerText.history.fields.plant}</span>
                  <strong>{plants.find((item) => item.id === historyContent.settings.plantId)?.koreanName ?? historyContent.settings.plantId}</strong>
                </div>
                <div className="generation-settings-item">
                  <span>{contentManagerText.history.fields.template}</span>
                  <strong>{templateLabelMap[historyContent.settings.template] ?? historyContent.settings.template}</strong>
                </div>
              </div>

              <div className="dashboard-scroll-list job-history-scroll">
                <GenerationJobList
                  jobs={historyJobs}
                  emptyTitle={contentManagerText.history.emptyTitle}
                  emptyDescription={contentManagerText.history.emptyDescription}
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
