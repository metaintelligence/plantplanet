import type { GeneratedContent, PlantRecord } from '../types/content';

interface TemplatePageShellProps {
  content: GeneratedContent;
  plant: PlantRecord;
  variant: string;
  eyebrow: string;
}

export default function TemplatePageShell({ content, plant, variant, eyebrow }: TemplatePageShellProps) {
  return (
    <article className={`content-page-template ${variant}`}>
      <header className="content-hero">
        <img src={plant.image.url} alt={plant.image.alt} />
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.summary}</p>
          <div className="content-meta-row">
            <span>{plant.koreanName}</span>
            <span>{plant.scientificName}</span>
            <span>{content.status === 'published' ? '게시됨' : '초안'}</span>
          </div>
        </div>
      </header>

      <section className="generated-sections">
        {content.sections.map((section) => (
          <section className="generated-section" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </section>

      <footer className="image-credit">
        이미지: {plant.image.source} / {plant.image.license}
      </footer>
    </article>
  );
}
