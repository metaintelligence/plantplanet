import type { LayoutGenerationJobOperation, LayoutGenerationJobStatus } from '../types/generationJob';

export const generationJobStatusLabels: Record<LayoutGenerationJobStatus, string> = {
  queued: '대기',
  running: '생성 중',
  revising: '수정 중',
  completed: '완료',
  failed: '실패',
  timeout: '시간 초과'
};

export const generationJobActiveStatuses = new Set<LayoutGenerationJobStatus>(['queued', 'running', 'revising']);
export const generationJobRetryableStatuses = new Set<LayoutGenerationJobStatus>(['failed', 'timeout']);

export const aiStatusLabels: Record<'idle' | 'queued' | 'running' | 'revising', string> = {
  idle: '대기중',
  queued: '대기중',
  running: '생성중',
  revising: '수정중'
};

export const generationJobOperationLabels: Record<LayoutGenerationJobOperation, string> = {
  generate: '생성 요청',
  revise: '수정 요청'
};

export const generationJobListText = {
  openPage: '페이지 열기',
  retry: '재생성 요청',
  meta: (operation: string, plantName: string, template: string, time: string) =>
    `${operation} / ${plantName} / ${template} / ${time}`
} as const;
