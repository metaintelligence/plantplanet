import type { TemplateType } from './content';

export type LayoutGenerationJobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'timeout';

export interface LayoutGenerationJob {
  id: string;
  contentId: string;
  contentTitle: string;
  plantName: string;
  template: TemplateType;
  routePath: string;
  status: LayoutGenerationJobStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
