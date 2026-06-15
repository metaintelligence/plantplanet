import type { ContentStatus, GeneratedContent, PlantRecord } from '../types/content';

interface ContentManagerProps {
  contents: GeneratedContent[];
  plants: PlantRecord[];
  onCreate: () => void;
  onOpen: (contentId: string) => void;
  onEdit: (content: GeneratedContent) => void;
  onDelete: (contentId: string) => void;
  onChangeStatus: (content: GeneratedContent, status: ContentStatus) => void;
}

export default function ContentManager({
  contents,
  plants,
  onCreate,
  onOpen,
  onEdit,
  onDelete,
  onChangeStatus
}: ContentManagerProps) {
  return (
    <div className="manager-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Content Library</p>
          <h1>콘텐츠 관리</h1>
          <p>로컬 서버 파일에 저장된 데모 콘텐츠를 조회, 수정, 삭제하고 게시 상태를 관리합니다.</p>
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
                  <span className={content.status === 'published' ? 'status-dot published' : 'status-dot'}>
                    {content.status === 'published' ? '게시됨' : '초안'}
                  </span>
                  <h2>{content.title}</h2>
                  <p>{plant?.koreanName ?? content.settings.plantId} / {content.summary}</p>
                  <code>{fullLink}</code>
                </div>
                <div className="content-row-actions">
                  <button className="secondary-button" type="button" onClick={() => onOpen(content.id)}>
                    보기
                  </button>
                  <button className="secondary-button" type="button" onClick={() => onEdit(content)}>
                    수정
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() =>
                      onChangeStatus(content, content.status === 'published' ? 'draft' : 'published')
                    }
                  >
                    {content.status === 'published' ? '초안 전환' : '게시'}
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
