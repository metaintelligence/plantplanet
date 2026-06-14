import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import ContentDetail from './components/ContentDetail';
import ContentManager from './components/ContentManager';
import ContentWizard from './components/ContentWizard';
import ExhibitionPage from './components/ExhibitionPage';
import HomeDashboard from './components/HomeDashboard';
import { startLayoutGenerationRequest } from './services/layoutGenerationClient';
import {
  deleteContentFromServer,
  fetchContents,
  fetchGenerationJobs,
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
      message: '로컬 생성 서버 연결을 준비하고 있습니다.',
      createdAt: now,
      updatedAt: now
    };

    try {
      const handle = await startLayoutGenerationRequest(content, {
        plantName: plant?.koreanName,
        onStatus: (message) =>
          patchGenerationJob(content.id, {
            status: 'running',
            message
          })
      });

      upsertGenerationJob(job);
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
          const timedOut = message.includes('5분') || message.includes('timed out');
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
      throw error;
    }
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
      onToggleMenu={() => setMenuOpen((current) => !current)}
      onNavigate={navigate}
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
            onEdit={startEdit}
          />
        );
      case 'exhibition':
        return <ExhibitionPage siteId={route.id} />;
      case 'home':
      default:
        return <HomeDashboard plants={plants} contents={contents} generationJobs={generationJobs} onNavigate={navigate} />;
    }
  }
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
