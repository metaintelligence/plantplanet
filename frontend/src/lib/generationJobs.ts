import { aiStatusLabels, generationJobActiveStatuses } from '../data/generationJobs';
import type { LayoutGenerationJob } from '../types/generationJob';

export function isActiveGenerationJob(job: LayoutGenerationJob) {
  return generationJobActiveStatuses.has(job.status);
}

export function getAiStatus(job: LayoutGenerationJob | undefined): 'idle' | 'queued' | 'running' | 'revising' {
  if (!job) {
    return 'idle';
  }

  if (job.status === 'queued' || job.status === 'running' || job.status === 'revising') {
    return job.status;
  }

  return 'idle';
}

export function getAiStatusLabel(status: 'idle' | 'queued' | 'running' | 'revising') {
  return aiStatusLabels[status];
}

export function normalizeRoute(routePath: string) {
  return routePath.replace(/^#/, '') || '/';
}

export function formatJobTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
