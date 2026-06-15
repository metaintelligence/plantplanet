import type { TemplateType } from './content';

export type LayoutGenerationJobStatus = 'queued' | 'running' | 'revising' | 'completed' | 'failed' | 'timeout';
export type LayoutGenerationJobOperation = 'generate' | 'revise';

export interface LayoutGenerationJob {
  id: string;
  contentId: string;
  contentTitle: string;
  plantName: string;
  template: TemplateType;
  routePath: string;
  status: LayoutGenerationJobStatus;
  operation?: LayoutGenerationJobOperation;
  message: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  targetFile?: string;
}
