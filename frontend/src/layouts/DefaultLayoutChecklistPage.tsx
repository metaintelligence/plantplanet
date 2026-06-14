import type { GeneratedContent, PlantRecord } from '../types/content';

export default function DefaultLayoutChecklistPage({
  content,
  plant
}: {
  content: GeneratedContent;
  plant: PlantRecord;
}) {
  const checklist = content.sections[0];
  const details = content.sections.slice(1);

  return (
    <article className="default-layout-page checklist-default-layout">
      <header className="checklist-header">
        <div>
          <p className="layout-kicker">Observation Checklist</p>
          <h1>{content.title}</h1>
          <p>{checklist?.body ?? `${plant.koreanName}를 순서대로 관찰합니다.`}</p>
        </div>
        <div className="checklist-species-card">
          <img src={plant.image.url} alt={plant.image.alt} />
          <strong>{plant.koreanName}</strong>
          <span>{plant.scientificName}</span>
        </div>
      </header>

      <section className="checklist-board">
        {(checklist?.items ?? plant.observationTips).map((item, index) => (
          <label className="checklist-task" key={item}>
            <input type="checkbox" />
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
          </label>
        ))}
      </section>

      <section className="checklist-detail-list">
        {details.map((section) => (
          <article className="checklist-detail-card" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>
    </article>
  );
}
