import { exhibitionSiteMap } from '../data/exhibitionSites';
import { exhibitionViewerText } from '../data/exhibitionViewer';
import type { GeneratedContent, PlantRecord } from '../types/content';
import ExhibitionMapViewer from './exhibition/ExhibitionMapViewer';

interface ExhibitionPageProps {
  siteId: string;
  contents: GeneratedContent[];
  plants: PlantRecord[];
}

export default function ExhibitionPage({ siteId, contents, plants }: ExhibitionPageProps) {
  const site = exhibitionSiteMap.get(siteId);

  return (
    <div className="exhibition-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{exhibitionViewerText.headerEyebrow}</p>
          <h1>{site?.name ?? exhibitionViewerText.headerFallbackTitle}</h1>
        </div>
      </header>

      <section className="exhibition-image-stage" aria-label={exhibitionViewerText.stageAriaLabel}>
        {site ? (
          <ExhibitionMapViewer
            siteId={siteId}
            imageSrc={site.imageSrc}
            imageAlt={site.name || exhibitionViewerText.imageAltFallback}
            contents={contents}
            plants={plants}
          />
        ) : (
          <div className="blank-exhibition-canvas" />
        )}
      </section>
    </div>
  );
}
