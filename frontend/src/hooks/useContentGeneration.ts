import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';
import { appText } from '../data/appText';
import { isActiveGenerationJob } from '../lib/generationJobs';
import { startLayoutGenerationRequest, startLayoutRevisionRequest } from '../services/layoutGenerationClient';
import { deleteContentFromServer, saveContentToServer } from '../services/serverDataClient';
import type { ToastMessage } from './useToastStack';
import type { GeneratedContent, PlantRecord } from '../types/content';
import type { LayoutGenerationJob } from '../types/generationJob';

interface UseContentGenerationOptions {
  plants: PlantRecord[];
  contents: GeneratedContent[];
  setContents: Dispatch<SetStateAction<GeneratedContent[]>>;
  generationJobs: LayoutGenerationJob[];
  setGenerationJobs: Dispatch<SetStateAction<LayoutGenerationJob[]>>;
  refreshServerData: () => Promise<void>;
  navigate: (path: string) => void;
  setEditingContent: Dispatch<SetStateAction<GeneratedContent | null>>;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  currentPath: string;
}

function isTimeoutMessage(message: string) {
  return message.includes('20분') || message.toLowerCase().includes('timed out');
}

export function useContentGeneration({
  plants,
  contents,
  setContents,
  generationJobs,
  setGenerationJobs,
  refreshServerData,
  navigate,
  setEditingContent,
  pushToast,
  currentPath
}: UseContentGenerationOptions) {
  const activeGenerationJob = generationJobs.find(isActiveGenerationJob);

  const upsertGenerationJob = useCallback(
    (job: LayoutGenerationJob) => {
      setGenerationJobs((current) => [job, ...current.filter((item) => item.id !== job.id)]);
    },
    [setGenerationJobs]
  );

  const patchGenerationJob = useCallback(
    (jobId: string, patch: Partial<LayoutGenerationJob>) => {
      setGenerationJobs((current) =>
        current.map((job) =>
          job.id === jobId
            ? {
                ...job,
                ...patch,
                updatedAt: patch.updatedAt ?? new Date().toISOString()
              }
            : job
        )
      );
    },
    [setGenerationJobs]
  );

  const showCreateBlockedToast = useCallback(() => {
    pushToast({
      tone: 'info',
      title: appText.blocked.title,
      message: activeGenerationJob
        ? appText.blocked.withActiveJob(activeGenerationJob.contentTitle)
        : appText.blocked.generic
    });
  }, [activeGenerationJob, pushToast]);

  const startContentGeneration = useCallback(
    async (content: GeneratedContent) => {
      if (activeGenerationJob) {
        throw new Error(appText.blocked.withActiveJob(activeGenerationJob.contentTitle));
      }

      if (content.settings.layoutId === 'default') {
        setContents(await saveContentToServer(content));
        await refreshServerData();
        setEditingContent(null);
        pushToast({
          tone: 'success',
          title: appText.generation.defaultLayoutSavedTitle,
          message: appText.generation.defaultLayoutSavedMessage(content.title)
        });
        navigate(`/content/${content.id}`);
        return;
      }

      const plant = plants.find((item) => item.id === content.settings.plantId);
      const now = new Date().toISOString();
      const job: LayoutGenerationJob = {
        id: content.id,
        contentId: content.id,
        contentTitle: content.title,
        plantName: plant?.koreanName ?? content.settings.plantId,
        template: content.settings.template,
        routePath: content.routePath.replace(/^#/, ''),
        status: 'queued',
        operation: 'generate',
        message: appText.generation.socketQueuedMessage,
        createdAt: now,
        updatedAt: now
      };

      try {
        upsertGenerationJob(job);
        const handle = await startLayoutGenerationRequest(content, {
          plantName: plant?.koreanName,
          onStatus: (message) =>
            patchGenerationJob(content.id, {
              status: 'running',
              message
            })
        });

        await refreshServerData();
        setEditingContent(null);
        patchGenerationJob(handle.jobId, {
          status: 'running',
          message: appText.generation.startedStatus
        });
        pushToast({
          tone: 'info',
          title: appText.generation.startedTitle,
          message: appText.generation.startedMessage(content.title)
        });
        navigate('/');

        void handle.done
          .then((message) => {
            patchGenerationJob(handle.jobId, {
              status: 'completed',
              message: message.message ?? appText.generation.completedFallback,
              completedAt: new Date().toISOString()
            });
            void refreshServerData();
            pushToast({
              tone: 'success',
              title: appText.generation.completedTitle,
              message: appText.generation.completedMessage(content.title)
            });
            window.setTimeout(() => window.location.reload(), 2200);
          })
          .catch((error) => {
            const message = error instanceof Error ? error.message : appText.generation.failedFallback;
            const timedOut = isTimeoutMessage(message);
            patchGenerationJob(handle.jobId, {
              status: timedOut ? 'timeout' : 'failed',
              message
            });
            void refreshServerData();
            pushToast({
              tone: 'error',
              title: timedOut ? appText.statusTitles.generationTimeout : appText.statusTitles.generationFailed,
              message
            });
          });
      } catch (error) {
        patchGenerationJob(content.id, {
          status: 'failed',
          message: error instanceof Error ? error.message : appText.generation.requestFailedFallback
        });
        throw error;
      }
    },
    [
      activeGenerationJob,
      navigate,
      patchGenerationJob,
      plants,
      pushToast,
      refreshServerData,
      setContents,
      setEditingContent,
      upsertGenerationJob
    ]
  );

  const startContentRevision = useCallback(
    async (content: GeneratedContent, revisionPrompt: string) => {
      if (activeGenerationJob) {
        pushToast({
          tone: 'error',
          title: appText.revision.blockedTitle,
          message: appText.revision.blockedMessage(activeGenerationJob.contentTitle)
        });
        return;
      }

      const plant = plants.find((item) => item.id === content.settings.plantId);
      const now = new Date().toISOString();
      const jobId = `${content.id}-revision-${Date.now().toString(36)}`;
      const job: LayoutGenerationJob = {
        id: jobId,
        contentId: content.id,
        contentTitle: content.title,
        plantName: plant?.koreanName ?? content.settings.plantId,
        template: content.settings.template,
        routePath: content.routePath.replace(/^#/, ''),
        status: 'revising',
        operation: 'revise',
        message: appText.revision.queuedMessage,
        createdAt: now,
        updatedAt: now
      };

      try {
        upsertGenerationJob(job);
        const handle = await startLayoutRevisionRequest(content, revisionPrompt, {
          jobId,
          plantName: plant?.koreanName,
          onStatus: (message) =>
            patchGenerationJob(jobId, {
              status: 'revising',
              message
            })
        });

        await refreshServerData();
        patchGenerationJob(handle.jobId, {
          status: 'revising',
          message: appText.revision.startedStatus
        });
        pushToast({
          tone: 'info',
          title: appText.revision.startedTitle,
          message: appText.revision.startedMessage(content.title)
        });
        navigate('/');

        void handle.done
          .then((message) => {
            patchGenerationJob(handle.jobId, {
              status: 'completed',
              message: message.message ?? appText.revision.completedFallback,
              completedAt: new Date().toISOString()
            });
            void refreshServerData();
            pushToast({
              tone: 'success',
              title: appText.revision.completedTitle,
              message: appText.revision.completedMessage(content.title)
            });
            window.setTimeout(() => window.location.reload(), 2200);
          })
          .catch((error) => {
            const message = error instanceof Error ? error.message : appText.revision.failedFallback;
            const timedOut = isTimeoutMessage(message);
            patchGenerationJob(handle.jobId, {
              status: timedOut ? 'timeout' : 'failed',
              message
            });
            void refreshServerData();
            pushToast({
              tone: 'error',
              title: timedOut ? appText.revision.timeoutTitle : appText.revision.failedTitle,
              message
            });
          });
      } catch (error) {
        patchGenerationJob(jobId, {
          status: 'failed',
          message: error instanceof Error ? error.message : appText.revision.requestFailedFallback
        });
        throw error;
      }
    },
    [activeGenerationJob, navigate, patchGenerationJob, plants, pushToast, refreshServerData, upsertGenerationJob]
  );

  const retryContentGeneration = useCallback(
    (job: LayoutGenerationJob) => {
      if (activeGenerationJob) {
        showCreateBlockedToast();
        return;
      }

      const content = contents.find((item) => item.id === job.contentId);
      if (!content) {
        pushToast({
          tone: 'error',
          title: appText.retry.missingTitle,
          message: appText.retry.missingMessage(job.contentTitle)
        });
        return;
      }

      pushToast({
        tone: 'info',
        title: appText.retry.startedTitle,
        message: appText.retry.startedMessage(content.title)
      });

      void startContentGeneration(content).catch((error) => {
        pushToast({
          tone: 'error',
          title: appText.retry.failedTitle,
          message: error instanceof Error ? error.message : appText.retry.failedFallback
        });
      });
    },
    [activeGenerationJob, contents, pushToast, showCreateBlockedToast, startContentGeneration]
  );

  const deleteContent = useCallback(
    async (contentId: string) => {
      const confirmed = window.confirm(appText.deletion.confirm);
      if (!confirmed) {
        return;
      }

      try {
        setContents(await deleteContentFromServer(contentId));
      } catch (error) {
        pushToast({
          tone: 'error',
          title: appText.deletion.failedTitle,
          message: error instanceof Error ? error.message : appText.deletion.failedFallback
        });
        return;
      }

      if (currentPath.startsWith('/content/') && currentPath.endsWith(contentId)) {
        navigate('/manage');
      }
    },
    [currentPath, navigate, pushToast, setContents]
  );

  return {
    activeGenerationJob,
    startContentGeneration,
    startContentRevision,
    retryContentGeneration,
    deleteContent,
    showCreateBlockedToast
  };
}
