import fs from 'node:fs/promises';
import path from 'node:path';

export type ContentStatus = 'draft' | 'published';
export type LayoutGenerationJobStatus = 'queued' | 'running' | 'revising' | 'completed' | 'failed' | 'timeout';
export type LayoutGenerationJobOperation = 'generate' | 'revise';

export interface GeneratedContentRecord {
  id: string;
  title: string;
  summary: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  settings: unknown;
  settingsJson: string;
  routePath: string;
  sections: unknown[];
}

export interface LayoutGenerationJobRecord {
  id: string;
  contentId: string;
  contentTitle: string;
  plantName: string;
  template: string;
  routePath: string;
  status: LayoutGenerationJobStatus;
  operation?: LayoutGenerationJobOperation;
  message: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  targetFile?: string;
}

const LAYOUT_GENERATION_TIMEOUT_MS = Number(process.env.LAYOUT_GENERATION_TIMEOUT_MS ?? 20 * 60 * 1000);
const writeQueues = new Map<string, Promise<unknown>>();

export function createFileDataStore(rootDir: string) {
  const dataDir = path.join(rootDir, 'generated');
  const contentsPath = path.join(dataDir, 'contents.json');
  const jobsPath = path.join(dataDir, 'generation-jobs.json');

  return {
    listContents: () => readList<GeneratedContentRecord>(contentsPath),
    getContent: async (contentId: string) =>
      (await readList<GeneratedContentRecord>(contentsPath)).find((content) => content.id === contentId) ?? null,
    upsertContent: async (content: GeneratedContentRecord) =>
      updateFile(
        contentsPath,
        (current: GeneratedContentRecord[]) => [content, ...current.filter((item) => item.id !== content.id)],
        'updatedAt'
      ),
    patchContent: async (contentId: string, patch: Partial<GeneratedContentRecord>) => {
      return updateFile(
        contentsPath,
        (current: GeneratedContentRecord[]) =>
          current.map((content) =>
            content.id === contentId
              ? {
                  ...content,
                  ...patch,
                  updatedAt: patch.updatedAt ?? new Date().toISOString()
                }
              : content
          ),
        'updatedAt'
      );
    },
    removeContent: async (contentId: string) =>
      updateFile(
        contentsPath,
        (current: GeneratedContentRecord[]) => current.filter((content) => content.id !== contentId),
        'updatedAt'
      ),
    listJobs: async () => normalizeExpiredJobs(jobsPath, await readList<LayoutGenerationJobRecord>(jobsPath)),
    upsertJob: async (job: LayoutGenerationJobRecord) =>
      updateFile(
        jobsPath,
        (current: LayoutGenerationJobRecord[]) => [job, ...current.filter((item) => item.id !== job.id)],
        'updatedAt'
      ),
    patchJob: async (jobId: string, patch: Partial<LayoutGenerationJobRecord>) => {
      return updateFile(
        jobsPath,
        (current: LayoutGenerationJobRecord[]) =>
          current.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  ...patch,
                  updatedAt: patch.updatedAt ?? new Date().toISOString()
                }
              : job
          ),
        'updatedAt'
      );
    }
  };
}

async function normalizeExpiredJobs(filePath: string, jobs: LayoutGenerationJobRecord[]) {
  const now = Date.now();
  let changed = false;
  const normalized = jobs.map((job) => {
    if (job.status !== 'queued' && job.status !== 'running' && job.status !== 'revising') {
      return job;
    }

    const createdAt = new Date(job.createdAt).getTime();
    if (!Number.isFinite(createdAt) || now - createdAt < LAYOUT_GENERATION_TIMEOUT_MS) {
      return job;
    }

    changed = true;
    return {
      ...job,
      status: 'timeout' as const,
      message: '20분 안에 완료 응답을 받지 못했습니다.',
      updatedAt: new Date().toISOString()
    };
  });

  return changed
    ? updateFile<LayoutGenerationJobRecord>(filePath, () => normalized, 'updatedAt')
    : normalized;
}

async function readList<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return [];
    }
    if (error instanceof SyntaxError) {
      await backupInvalidJson(filePath);
      return [];
    }
    throw error;
  }
}

async function writeSorted<T>(filePath: string, items: T[], dateKey: keyof T) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const sorted = [...items].sort((a, b) => String(b[dateKey]).localeCompare(String(a[dateKey])));
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
  await fs.rename(tempPath, filePath);
  return sorted;
}

function updateFile<T>(filePath: string, updater: (current: T[]) => T[], dateKey: keyof T) {
  const previous = writeQueues.get(filePath) ?? Promise.resolve();
  const next = previous
    .catch(() => undefined)
    .then(async () => {
      const current = await readList<T>(filePath);
      return writeSorted(filePath, updater(current), dateKey);
    });

  writeQueues.set(
    filePath,
    next.finally(() => {
      if (writeQueues.get(filePath) === next) {
        writeQueues.delete(filePath);
      }
    })
  );

  return next;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

async function backupInvalidJson(filePath: string) {
  try {
    const backupPath = `${filePath}.invalid-${Date.now()}`;
    await fs.rename(filePath, backupPath);
  } catch {
    // Keep the server responsive even if the broken runtime file cannot be moved.
  }
}
