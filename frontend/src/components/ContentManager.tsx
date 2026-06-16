import type { GeneratedContent, PlantRecord } from '../types/content';

interface ContentManagerProps {
  contents: GeneratedContent[];
  plants: PlantRecord[];
  onCreate: () => void;
  onOpen: (contentId: string) => void;
  onDelete: (contentId: string) => void;
}

export default function ContentManager({
  contents,
  plants,
  onCreate,
  onOpen,
  onDelete
}: ContentManagerProps) {
  return (
    <div className="manager-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Content Library</p>
          <h1>콘텐츠 관리</h1>
          <p>로컬 서버 파일에 저장된 모든 콘텐츠를 조회하고 삭제합니다.</p>
        </div>
        <button className="primary-button" type="button" onClick={onCreate}>
          콘텐츠 생성
        </button>
      </header>

      {contents.length === 0 ? (
        <div className="panel empty-manager">
          <strong>생성된 콘텐츠가 없습니다.</strong>
          <span>생성 마법사에서 첫 콘텐츠를 만들면 이곳에 목록이 표시됩니다.</span>
          <button className="primary-button" type="button" onClick={onCreate}>
            새 콘텐츠 만들기
          </button>
        </div>
      ) : (
        <div className="content-table">
          {contents.map((content) => {
            const plant = plants.find((item) => item.id === content.settings.plantId);
            const fullLink = `${window.location.href.split('#')[0]}${content.routePath}`;

            return (
              <article className="content-row" key={content.id}>
                <div className="content-row-main">
                  <span className="status-dot published">게시됨</span>
                  <h2>{content.title}</h2>
                  <p>
                    {plant?.koreanName ?? content.settings.plantId} / {content.summary}
                  </p>
                  <code>{fullLink}</code>
                </div>
                <div className="content-row-actions">
                  <button className="secondary-button" type="button" onClick={() => onOpen(content.id)}>
                    보기
                  </button>
                  <button className="danger-button" type="button" onClick={() => onDelete(content.id)}>
                    삭제
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
