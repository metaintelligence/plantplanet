import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import ContentDetail from './components/ContentDetail';
import ContentManager from './components/ContentManager';
import ContentWizard from './components/ContentWizard';
import ExhibitionPage from './components/ExhibitionPage';
import HomeDashboard from './components/HomeDashboard';
import { startLayoutGenerationRequest, startLayoutRevisionRequest } from './services/layoutGenerationClient';
import {
  deleteContentFromServer,
  fetchContents,
  fetchGenerationJobs,
  saveContentToServer,
  updateContentStatus
} from './services/serverDataClient';
import type { ContentStatus, GeneratedContent, MockDatabase, PlantRecord } from './types/content';
import type { LayoutGenerationJob } from './types/generationJob';

type Route =
  | { name: 'home'; path: '/' }
  | { name: 'create'; path: '/create' }
  | { name: 'manage'; path: '/manage' }
  | { name: 'content'; path: string; id: string }
  | { name: 'exhibition'; path: string; id: string };

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  tone: 'info' | 'success' | 'error';
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHashRoute());
  const [menuOpen, setMenuOpen] = useState(false);
  const [plants, setPlants] = useState<PlantRecord[]>([]);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [generationJobs, setGenerationJobs] = useState<LayoutGenerationJob[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [editingContent, setEditingContent] = useState<GeneratedContent | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const activeGenerationJob = generationJobs.find(isActiveGenerationJob);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}mock_db.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('mock_db.json을 불러오지 못했습니다.');
        }
        return response.json() as Promise<MockDatabase>;
      })
      .then((database) => {
        setPlants(database.plants);
        setDbError(null);
      })
      .catch((error) => {
        setDbError(error instanceof Error ? error.message : '목업 데이터 로드 실패');
      });
  }, []);

  useEffect(() => {
    void refreshServerData();
    const intervalId = window.setInterval(() => {
      void refreshServerData();
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  const navigate = (path: string) => {
    if (path === '/create' && activeGenerationJob) {
      showCreateBlockedToast();
      return;
    }
    if (path === '/create') {
      setEditingContent(null);
    }
    setMenuOpen(false);
    const hash = path === '/' ? '#/' : `#${path}`;
    if (window.location.hash === hash) {
      setRoute(parsePathRoute(path));
      return;
    }
    window.location.hash = hash;
  };

  const upsertGenerationJob = (job: LayoutGenerationJob) => {
    setGenerationJobs((current) => [job, ...current.filter((item) => item.id !== job.id)]);
  };

  const patchGenerationJob = (jobId: string, patch: Partial<LayoutGenerationJob>) => {
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
  };

  const refreshServerData = async () => {
    try {
      const [nextContents, nextJobs] = await Promise.all([fetchContents(), fetchGenerationJobs()]);
      setContents(nextContents);
      setGenerationJobs(nextJobs);
      setContentError(null);
    } catch (error) {
      setContentError(error instanceof Error ? error.message : '서버 파일 데이터를 불러오지 못했습니다.');
    }
  };

  const pushToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = crypto.randomUUID?.() ?? `toast-${Date.now()}`;
    setToasts((current) => [{ id, ...toast }, ...current].slice(0, 4));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 5200);
  };

  const startContentGeneration = async (content: GeneratedContent) => {
    if (activeGenerationJob) {
      throw new Error(`"${activeGenerationJob.contentTitle}" 작업이 진행 중입니다. 완료 후 새 요청을 시작할 수 있습니다.`);
    }

    if (content.settings.layoutId === 'default') {
      setContents(await saveContentToServer(content));
      await refreshServerData();
      setEditingContent(null);
      pushToast({
        tone: 'success',
        title: '기본 레이아웃 저장 완료',
        message: `${content.title} 콘텐츠가 서버 파일에 저장되었습니다.`
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
      message: '로컬 생성 서버 연결을 준비하고 있습니다.',
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
        message: '백그라운드에서 페이지 생성 작업이 시작되었습니다.'
      });
      pushToast({
        tone: 'info',
        title: '생성 작업 시작',
        message: `${content.title} 페이지를 백그라운드에서 생성하고 있습니다.`
      });
      navigate('/');

      void handle.done
        .then((message) => {
          patchGenerationJob(handle.jobId, {
            status: 'completed',
            message: message.message ?? '페이지 생성과 빌드가 완료되었습니다.',
            completedAt: new Date().toISOString()
          });
          void refreshServerData();
          pushToast({
            tone: 'success',
            title: '페이지 생성 완료',
            message: `${content.title} 생성이 완료되었습니다. 최신 페이지를 반영하기 위해 곧 새로고침합니다.`
          });
          window.setTimeout(() => window.location.reload(), 2200);
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : '페이지 생성 작업에 실패했습니다.';
          const timedOut = message.includes('20분') || message.includes('timed out');
          patchGenerationJob(handle.jobId, {
            status: timedOut ? 'timeout' : 'failed',
            message
          });
          void refreshServerData();
          pushToast({
            tone: 'error',
            title: timedOut ? '생성 시간 초과' : '생성 실패',
            message
          });
        });
    } catch (error) {
      patchGenerationJob(content.id, {
        status: 'failed',
        message: error instanceof Error ? error.message : '페이지 생성 요청에 실패했습니다.'
      });
      throw error;
    }
  };

  const startContentRevision = async (content: GeneratedContent, revisionPrompt: string) => {
    if (activeGenerationJob) {
      pushToast({
        tone: 'error',
        title: '수정 요청 불가',
        message: `"${activeGenerationJob.contentTitle}" 작업이 진행 중입니다. 완료 후 다시 요청해주세요.`
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
      message: '로컬 생성 서버 연결을 준비하고 있습니다.',
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
        message: '백그라운드에서 페이지 수정 작업이 시작되었습니다.'
      });
      pushToast({
        tone: 'info',
        title: '수정 작업 시작',
        message: `${content.title} 페이지를 백그라운드에서 수정하고 있습니다.`
      });
      navigate('/');

      void handle.done
        .then((message) => {
          patchGenerationJob(handle.jobId, {
            status: 'completed',
            message: message.message ?? '페이지 수정과 빌드가 완료되었습니다.',
            completedAt: new Date().toISOString()
          });
          void refreshServerData();
          pushToast({
            tone: 'success',
            title: '페이지 수정 완료',
            message: `${content.title} 수정이 완료되었습니다. 최신 페이지를 반영하기 위해 곧 새로고침합니다.`
          });
          window.setTimeout(() => window.location.reload(), 2200);
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : '페이지 수정 작업에 실패했습니다.';
          const timedOut = message.includes('20분') || message.includes('timed out');
          patchGenerationJob(handle.jobId, {
            status: timedOut ? 'timeout' : 'failed',
            message
          });
          void refreshServerData();
          pushToast({
            tone: 'error',
            title: timedOut ? '수정 시간 초과' : '수정 실패',
            message
          });
        });
    } catch (error) {
      patchGenerationJob(jobId, {
        status: 'failed',
        message: error instanceof Error ? error.message : '페이지 수정 요청에 실패했습니다.'
      });
      throw error;
    }
  };

  const retryContentGeneration = (job: LayoutGenerationJob) => {
    if (activeGenerationJob) {
      showCreateBlockedToast();
      return;
    }

    const content = contents.find((item) => item.id === job.contentId);
    if (!content) {
      pushToast({
        tone: 'error',
        title: '재생성 요청 실패',
        message: `"${job.contentTitle}" 콘텐츠 원본을 찾지 못했습니다. 콘텐츠 목록을 확인해주세요.`
      });
      return;
    }

    pushToast({
      tone: 'info',
      title: '재생성 요청',
      message: `${content.title} 페이지 생성을 다시 시도합니다.`
    });

    void startContentGeneration(content).catch((error) => {
      pushToast({
        tone: 'error',
        title: '재생성 요청 실패',
        message: error instanceof Error ? error.message : '페이지 재생성 요청을 시작하지 못했습니다.'
      });
    });
  };

  const deleteContent = async (contentId: string) => {
    const confirmed = window.confirm('이 콘텐츠를 삭제할까요?');
    if (!confirmed) {
      return;
    }
    try {
      setContents(await deleteContentFromServer(contentId));
    } catch (error) {
      pushToast({
        tone: 'error',
        title: '삭제 실패',
        message: error instanceof Error ? error.message : '콘텐츠 삭제에 실패했습니다.'
      });
      return;
    }
    if (route.name === 'content' && route.id === contentId) {
      navigate('/manage');
    }
  };

  const changeStatus = async (content: GeneratedContent, status: ContentStatus) => {
    try {
      setContents(await updateContentStatus(content.id, status));
    } catch (error) {
      pushToast({
        tone: 'error',
        title: '상태 변경 실패',
        message: error instanceof Error ? error.message : '콘텐츠 상태를 변경하지 못했습니다.'
      });
    }
  };

  const startEdit = (content: GeneratedContent) => {
    if (activeGenerationJob) {
      showCreateBlockedToast();
      return;
    }
    setEditingContent(content);
    setMenuOpen(false);
    const hash = '#/create';
    if (window.location.hash === hash) {
      setRoute(parsePathRoute('/create'));
      return;
    }
    window.location.hash = hash;
  };

  const currentContent = route.name === 'content' ? contents.find((content) => content.id === route.id) ?? null : null;
  const currentPlant = currentContent
    ? plants.find((plant) => plant.id === currentContent.settings.plantId) ?? null
    : null;

  return (
    <AppShell
      menuOpen={menuOpen}
      currentPath={route.path}
      contentCount={contents.length}
      generationLocked={Boolean(activeGenerationJob)}
      onToggleMenu={() => setMenuOpen((current) => !current)}
      onNavigate={navigate}
      onCreateBlocked={showCreateBlockedToast}
    >
      {dbError && <div className="error-banner">{dbError}</div>}
      {contentError && <div className="error-banner">{contentError}</div>}
      {renderRoute()}
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
    </AppShell>
  );

  function renderRoute() {
    if (plants.length === 0 && !dbError) {
      return (
        <div className="panel loading-panel">
          <strong>식물 데이터를 불러오는 중입니다.</strong>
        </div>
      );
    }

    switch (route.name) {
      case 'create':
        return (
          <ContentWizard
            plants={plants}
            editingContent={editingContent}
            generationBlocked={Boolean(activeGenerationJob)}
            activeJobTitle={activeGenerationJob?.contentTitle}
            onGenerate={startContentGeneration}
            onCancel={() => {
              setEditingContent(null);
              navigate('/manage');
            }}
          />
        );
      case 'manage':
        return (
          <ContentManager
            contents={contents}
            plants={plants}
            onCreate={() => navigate('/create')}
            onOpen={(contentId) => navigate(`/content/${contentId}`)}
            onEdit={startEdit}
            onDelete={deleteContent}
            onChangeStatus={changeStatus}
          />
        );
      case 'content':
        return (
          <ContentDetail
            content={currentContent}
            plant={currentPlant}
            onBack={() => navigate('/manage')}
            onRequestRevision={startContentRevision}
          />
        );
      case 'exhibition':
        return <ExhibitionPage siteId={route.id} />;
      case 'home':
      default:
        return (
          <HomeDashboard
            plants={plants}
            contents={contents}
            generationJobs={generationJobs}
            onNavigate={navigate}
            onRegenerate={retryContentGeneration}
          />
        );
    }
  }

  function showCreateBlockedToast() {
    pushToast({
      tone: 'info',
      title: '새 요청을 시작할 수 없습니다',
      message: activeGenerationJob
        ? `"${activeGenerationJob.contentTitle}" 작업이 진행 중입니다. 완료 후 다시 시도해주세요.`
        : '진행 중인 생성 작업이 있어 완료 후 다시 시도해주세요.'
    });
  }
}

function isActiveGenerationJob(job: LayoutGenerationJob) {
  return job.status === 'queued' || job.status === 'running' || job.status === 'revising';
}

function ToastViewport({
  toasts,
  onDismiss
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <button className={`toast ${toast.tone}`} key={toast.id} type="button" onClick={() => onDismiss(toast.id)}>
          <strong>{toast.title}</strong>
          <span>{toast.message}</span>
        </button>
      ))}
    </div>
  );
}

function parseHashRoute(): Route {
  const hashPath = window.location.hash.replace(/^#/, '') || '/';
  return parsePathRoute(hashPath);
}

function parsePathRoute(path: string): Route {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const parts = normalized.split('/').filter(Boolean);

  if (parts[0] === 'create') {
    return { name: 'create', path: '/create' };
  }
  if (parts[0] === 'manage') {
    return { name: 'manage', path: '/manage' };
  }
  if (parts[0] === 'content' && parts[1]) {
    return { name: 'content', path: `/content/${parts[1]}`, id: parts[1] };
  }
  if (parts[0] === 'exhibition' && parts[1]) {
    return { name: 'exhibition', path: `/exhibition/${parts[1]}`, id: parts[1] };
  }
  return { name: 'home', path: '/' };
}
