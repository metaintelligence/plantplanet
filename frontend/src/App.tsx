import { useMemo, useState } from 'react';
import { appText } from './data/appText';
import { getAiStatus } from './lib/generationJobs';
import { useContentGeneration } from './hooks/useContentGeneration';
import { useHashRoute } from './hooks/useHashRoute';
import { useServerContentData } from './hooks/useServerContentData';
import { useToastStack } from './hooks/useToastStack';
import AppShell from './components/AppShell';
import ToastViewport from './components/common/ToastViewport';
import ContentDetail from './components/ContentDetail';
import ContentManager from './components/ContentManager';
import ContentWizard from './components/ContentWizard';
import ExhibitionPage from './components/ExhibitionPage';
import HomeDashboard from './components/HomeDashboard';
import type { GeneratedContent } from './types/content';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<GeneratedContent | null>(null);
  const { route, updateRoute } = useHashRoute();
  const { toasts, pushToast, dismissToast } = useToastStack();
  const {
    plants,
    contents,
    setContents,
    generationJobs,
    setGenerationJobs,
    dbError,
    contentError,
    refreshServerData
  } = useServerContentData();

  const navigate = (path: string) => {
    if (path === '/create') {
      setEditingContent(null);
    }
    setMenuOpen(false);
    updateRoute(path);
  };

  const {
    activeGenerationJob,
    startContentGeneration,
    startContentRevision,
    retryContentGeneration,
    deleteContent,
    showCreateBlockedToast
  } = useContentGeneration({
    plants,
    contents,
    setContents,
    generationJobs,
    setGenerationJobs,
    refreshServerData,
    navigate,
    setEditingContent,
    pushToast,
    currentPath: route.path
  });

  const currentContent = useMemo(
    () => (route.name === 'content' ? contents.find((content) => content.id === route.id) ?? null : null),
    [contents, route]
  );

  const currentPlant = useMemo(
    () => (currentContent ? plants.find((plant) => plant.id === currentContent.settings.plantId) ?? null : null),
    [currentContent, plants]
  );

  const handleNavigate = (path: string) => {
    if (path === '/create' && activeGenerationJob) {
      showCreateBlockedToast();
      return;
    }

    navigate(path);
  };

  return (
    <AppShell
      menuOpen={menuOpen}
      currentPath={route.path}
      contentCount={contents.length}
      aiStatus={getAiStatus(activeGenerationJob)}
      generationLocked={Boolean(activeGenerationJob)}
      onToggleMenu={() => setMenuOpen((current) => !current)}
      onNavigate={handleNavigate}
      onCreateBlocked={showCreateBlockedToast}
    >
      {dbError && <div className="error-banner">{dbError}</div>}
      {contentError && <div className="error-banner">{contentError}</div>}
      {renderRoute()}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </AppShell>
  );

  function renderRoute() {
    if (plants.length === 0 && !dbError) {
      return (
        <div className="panel loading-panel">
          <strong>{appText.errors.loadingPlants}</strong>
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
            generationJobs={generationJobs}
            onCreate={() => handleNavigate('/create')}
            onOpen={(contentId) => navigate(`/content/${contentId}`)}
            onDelete={deleteContent}
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
        return <ExhibitionPage siteId={route.id} contents={contents} plants={plants} />;
      case 'home':
      default:
        return (
          <HomeDashboard
            plants={plants}
            contents={contents}
            generationJobs={generationJobs}
            onNavigate={handleNavigate}
            onRegenerate={retryContentGeneration}
          />
        );
    }
  }
}
