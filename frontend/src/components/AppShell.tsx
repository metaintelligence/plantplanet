import type { ReactNode } from 'react';
import { appShellText } from '../data/appShellText';
import { exhibitionSites } from '../data/exhibitionSites';
import { getAiStatusLabel } from '../lib/generationJobs';

interface AppShellProps {
  children: ReactNode;
  menuOpen: boolean;
  currentPath: string;
  contentCount: number;
  aiStatus: 'idle' | 'queued' | 'running' | 'revising';
  generationLocked: boolean;
  onToggleMenu: () => void;
  onNavigate: (path: string) => void;
  onCreateBlocked: () => void;
}

export default function AppShell({
  children,
  menuOpen,
  currentPath,
  contentCount,
  aiStatus,
  generationLocked,
  onToggleMenu,
  onNavigate,
  onCreateBlocked
}: AppShellProps) {
  const base = import.meta.env.BASE_URL;

  const go = (path: string) => {
    onNavigate(path);
  };

  return (
    <div className="console-shell">
      <header className="console-header">
        <div className="brand-cluster">
          <button className="hamburger-button" type="button" aria-label={appShellText.menuOpenAria} onClick={onToggleMenu}>
            <span />
            <span />
            <span />
          </button>
          <button className="brand-button" type="button" onClick={() => go('/')}>
            <img src={`${base}hangarden-logo.svg`} alt="HanGarden" />
          </button>
        </div>
        <div className="header-actions">
          <span className={`ai-status-badge ${aiStatus}`}>
            <span className="ai-status-dot" />
            <strong>{appShellText.aiStatusPrefix}</strong>
            <em>{getAiStatusLabel(aiStatus)}</em>
          </span>
          <span className="status-pill">{appShellText.contentCount(contentCount)}</span>
        </div>
      </header>

      <aside className={menuOpen ? 'side-menu open' : 'side-menu'}>
        <div className="side-menu-inner">
          <section className="menu-section">
            <h2>{appShellText.sections.content}</h2>
            <button
              className={currentPath === '/create' ? 'active' : ''}
              type="button"
              onClick={() => {
                if (generationLocked) {
                  onCreateBlocked();
                  return;
                }
                go('/create');
              }}
            >
              {appShellText.actions.create}
            </button>
            <button className={currentPath === '/manage' ? 'active' : ''} type="button" onClick={() => go('/manage')}>
              {appShellText.actions.manage}
            </button>
          </section>

          <section className="menu-section">
            <h2>{appShellText.sections.exhibition}</h2>
            {exhibitionSites.map((site) => (
              <button
                className={currentPath === `/exhibition/${site.id}` ? 'active' : ''}
                key={site.id}
                type="button"
                onClick={() => go(`/exhibition/${site.id}`)}
              >
                {site.name}
              </button>
            ))}
          </section>
        </div>
      </aside>

      {menuOpen && (
        <button className="menu-scrim" type="button" aria-label={appShellText.menuCloseAria} onClick={onToggleMenu} />
      )}

      <main className="console-main">{children}</main>
    </div>
  );
}
