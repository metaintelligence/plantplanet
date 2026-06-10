import SectionRenderer from './SectionRenderer';
import type { PageConfig } from '../types/pageConfig';

interface MobilePreviewProps {
  config: PageConfig | null;
  isLoading: boolean;
}

export default function MobilePreview({ config, isLoading }: MobilePreviewProps) {
  return (
    <section className="preview-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Preview</p>
          <h2>모바일 미리보기</h2>
        </div>
        {config && <span className="preview-meta">{config.estimatedTime}</span>}
      </div>

      <div className="phone-frame">
        <div className="phone-speaker" />
        <div className="phone-screen">
          {isLoading && <div className="loading-overlay">생성 중...</div>}
          {!config ? (
            <div className="empty-preview">
              <strong>생성된 페이지가 없습니다.</strong>
              <span>옵션을 선택한 뒤 페이지 생성을 눌러주세요.</span>
            </div>
          ) : (
            <article className="mobile-page">
              <div className="mobile-title-area">
                <span>{config.plantName}</span>
                <h3>{config.title}</h3>
                <p>{config.subtitle}</p>
              </div>
              {config.sections.map((section, index) => (
                <SectionRenderer key={`${section.type}-${index}`} section={section} />
              ))}
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
