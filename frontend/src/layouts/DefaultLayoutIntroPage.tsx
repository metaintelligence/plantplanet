import type { GeneratedContent, PlantRecord } from '../types/content';

export default function DefaultLayoutIntroPage({
  content,
  plant
}: {
  content: GeneratedContent;
  plant: PlantRecord;
}) {
  const leadSection = content.sections[0];
  const detailSections = content.sections.slice(1);

  return (
    <article className="default-layout-page intro-default-layout">
      <header className="intro-profile-hero">
        <div className="intro-profile-copy">
          <p className="layout-kicker">Plant Profile</p>
          <h1>{content.title}</h1>
          <p>{leadSection?.body ?? content.summary}</p>
          <div className="intro-profile-tags">
            <span>{plant.koreanName}</span>
            <span>{plant.scientificName}</span>
            <span>{plant.family}</span>
          </div>
        </div>
        <figure>
          <img src={plant.image.url} alt={plant.image.alt} />
          <figcaption>{plant.image.source}</figcaption>
        </figure>
      </header>

      <section className="intro-fact-grid">
        <Fact label="원산/분포" value={plant.origin} />
        <Fact label="서식지" value={plant.habitat} />
        <Fact label="크기" value={plant.size} />
        <Fact label="개화/관찰" value={plant.floweringSeason} />
      </section>

      <section className="intro-section-grid">
        {detailSections.map((section) => (
          <section className="intro-info-card" key={section.title}>
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
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <article className="intro-fact-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
