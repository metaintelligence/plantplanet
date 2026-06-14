import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  menuOpen: boolean;
  currentPath: string;
  contentCount: number;
  onToggleMenu: () => void;
  onNavigate: (path: string) => void;
}

const exhibitionSites = [
  { id: 'baekdudaegan', name: '국립백두대간수목원' },
  { id: 'sejong', name: '국립세종수목원' },
  { id: 'native-plants', name: '국립한국자생식물원' },
  { id: 'garden-culture', name: '국립정원문화원' }
];

export default function AppShell({
  children,
  menuOpen,
  currentPath,
  contentCount,
  onToggleMenu,
  onNavigate
}: AppShellProps) {
  const base = import.meta.env.BASE_URL;

  const go = (path: string) => {
    onNavigate(path);
  };

  return (
    <div className="console-shell">
      <header className="console-header">
        <div className="brand-cluster">
          <button className="hamburger-button" type="button" aria-label="메뉴 열기" onClick={onToggleMenu}>
            <span />
            <span />
            <span />
          </button>
          <button className="brand-button" type="button" onClick={() => go('/')}>
            <img src={`${base}hangarden-logo.svg`} alt="HanGarden" />
          </button>
        </div>
        <div className="header-actions">
          <span className="status-pill">{contentCount}개 콘텐츠</span>
          <button className="primary-button" type="button" onClick={() => go('/create')}>
            콘텐츠 생성
          </button>
        </div>
      </header>

      <aside className={menuOpen ? 'side-menu open' : 'side-menu'}>
        <div className="side-menu-inner">
          <section className="menu-section">
            <h2>콘텐츠</h2>
            <button className={currentPath === '/create' ? 'active' : ''} type="button" onClick={() => go('/create')}>
              콘텐츠 생성
            </button>
            <button className={currentPath === '/manage' ? 'active' : ''} type="button" onClick={() => go('/manage')}>
              콘텐츠 관리
            </button>
          </section>

          <section className="menu-section">
            <h2>전시 관리</h2>
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

      {menuOpen && <button className="menu-scrim" type="button" aria-label="메뉴 닫기" onClick={onToggleMenu} />}

      <main className="console-main">{children}</main>
    </div>
  );
}

export { exhibitionSites };
