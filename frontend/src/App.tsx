import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import ContentDetail from './components/ContentDetail';
import ContentManager from './components/ContentManager';
import ContentWizard from './components/ContentWizard';
import ExhibitionPage from './components/ExhibitionPage';
import HomeDashboard from './components/HomeDashboard';
import { cookieContentStore } from './services/contentStore';
import type { ContentStatus, GeneratedContent, MockDatabase, PlantRecord } from './types/content';

type Route =
  | { name: 'home'; path: '/' }
  | { name: 'create'; path: '/create' }
  | { name: 'manage'; path: '/manage' }
  | { name: 'content'; path: string; id: string }
  | { name: 'exhibition'; path: string; id: string };

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHashRoute());
  const [menuOpen, setMenuOpen] = useState(false);
  const [plants, setPlants] = useState<PlantRecord[]>([]);
  const [contents, setContents] = useState<GeneratedContent[]>(() => cookieContentStore.list());
  const [editingContent, setEditingContent] = useState<GeneratedContent | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);

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

  const saveContent = (content: GeneratedContent) => {
    setContents(cookieContentStore.save(content));
    setEditingContent(null);
    navigate(`/content/${content.id}`);
  };

  const deleteContent = (contentId: string) => {
    const confirmed = window.confirm('이 콘텐츠를 삭제할까요?');
    if (!confirmed) {
      return;
    }
    setContents(cookieContentStore.remove(contentId));
    if (route.name === 'content' && route.id === contentId) {
      navigate('/manage');
    }
  };

  const changeStatus = (content: GeneratedContent, status: ContentStatus) => {
    const updated: GeneratedContent = {
      ...content,
      status,
      updatedAt: new Date().toISOString()
    };
    setContents(cookieContentStore.save(updated));
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
      {renderRoute()}
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
            onSave={saveContent}
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
        return <HomeDashboard plants={plants} contents={contents} onNavigate={navigate} />;
    }
  }
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
