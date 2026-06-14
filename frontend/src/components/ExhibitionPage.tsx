import { exhibitionSites } from './AppShell';

export default function ExhibitionPage({ siteId }: { siteId: string }) {
  const site = exhibitionSites.find((item) => item.id === siteId);

  return (
    <div className="exhibition-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Exhibition Management</p>
          <h1>{site?.name ?? '전시 관리'}</h1>
        </div>
      </header>
      <section className="blank-exhibition-canvas" aria-label="전시공간 편집 영역" />
    </div>
  );
}
