import {
  generationJobActiveStatuses,
  generationJobListText,
  generationJobOperationLabels,
  generationJobRetryableStatuses,
  generationJobStatusLabels
} from '../data/generationJobs';
import { formatJobTime, normalizeRoute } from '../lib/generationJobs';
import type { LayoutGenerationJob } from '../types/generationJob';

interface GenerationJobListProps {
  jobs: LayoutGenerationJob[];
  emptyTitle: string;
  emptyDescription: string;
  onNavigate?: (path: string) => void;
  onRegenerate?: (job: LayoutGenerationJob) => void;
}

export default function GenerationJobList({
  jobs,
  emptyTitle,
  emptyDescription,
  onNavigate,
  onRegenerate
}: GenerationJobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <strong>{emptyTitle}</strong>
        <span>{emptyDescription}</span>
      </div>
    );
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <article className="job-row" key={job.id}>
          <div className="job-row-main">
            <div className="job-title-line">
              {generationJobActiveStatuses.has(job.status) && <span className="inline-spinner" />}
              <strong>{job.contentTitle}</strong>
              <StatusBadge status={job.status} />
            </div>
            <p>{job.message}</p>
            <span>
              {generationJobListText.meta(
                generationJobOperationLabels[job.operation ?? 'generate'],
                job.plantName,
                job.template,
                formatJobTime(job.updatedAt)
              )}
            </span>
          </div>

          {generationJobRetryableStatuses.has(job.status) && onRegenerate ? (
            <button className="primary-button" type="button" onClick={() => onRegenerate(job)}>
              {generationJobListText.retry}
            </button>
          ) : job.status === 'completed' && onNavigate ? (
            <button className="secondary-button" type="button" onClick={() => onNavigate(normalizeRoute(job.routePath))}>
              {generationJobListText.openPage}
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: LayoutGenerationJob['status'] }) {
  return <span className={`job-status ${status}`}>{generationJobStatusLabels[status]}</span>;
}
