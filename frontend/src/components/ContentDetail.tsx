import ContentPageRenderer from '../layouts/ContentPageRenderer';
import type { GeneratedContent, PlantRecord } from '../types/content';

interface ContentDetailProps {
  content: GeneratedContent | null;
  plant: PlantRecord | null;
  onBack: () => void;
  onEdit: (content: GeneratedContent) => void;
}

export default function ContentDetail({ content, plant, onBack, onEdit }: ContentDetailProps) {
  if (!content || !plant) {
    return (
      <div className="panel not-found-panel">
        <strong>콘텐츠를 찾을 수 없습니다.</strong>
        <span>쿠키 저장소에 없는 콘텐츠이거나 식물 데이터가 변경되었습니다.</span>
        <button className="secondary-button" type="button" onClick={onBack}>
          콘텐츠 관리로 이동
        </button>
      </div>
    );
  }

  const fullLink = `${window.location.href.split('#')[0]}${content.routePath}`;

  return (
    <div className="content-detail-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Generated Page</p>
          <h1>{content.title}</h1>
          <p>생성된 콘텐츠는 아래 주소로 접근할 수 있습니다.</p>
          <code className="share-link">{fullLink}</code>
        </div>
        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={onBack}>
            목록
          </button>
          <button className="primary-button" type="button" onClick={() => onEdit(content)}>
            수정
          </button>
        </div>
      </header>

      <div className="content-detail-grid">
        <ContentPageRenderer content={content} plant={plant} />
        <aside className="settings-panel">
          <h2>설정 JSON</h2>
          <pre className="json-preview compact">{content.settingsJson}</pre>
        </aside>
      </div>
    </div>
  );
}
