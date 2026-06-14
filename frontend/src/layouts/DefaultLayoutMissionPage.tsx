import type { GeneratedContent, PlantRecord } from '../types/content';

export default function DefaultLayoutMissionPage({
  content,
  plant
}: {
  content: GeneratedContent;
  plant: PlantRecord;
}) {
  const mission = content.sections[0];
  const supporting = content.sections.slice(1);

  return (
    <article className="default-layout-page mission-default-layout">
      <header className="mission-briefing">
        <div className="mission-code">FIELD MISSION</div>
        <div>
          <p className="layout-kicker">Mission</p>
          <h1>{content.title}</h1>
          <p>{mission?.body ?? `${plant.koreanName}를 관찰하며 현장 미션을 수행합니다.`}</p>
        </div>
      </header>

      <section className="mission-board">
        <figure>
          <img src={plant.image.url} alt={plant.image.alt} />
        </figure>
        <div className="mission-card-stack">
          {(mission?.items ?? plant.observationTips).map((item, index) => (
            <article className="mission-task-card" key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="mission-support-grid">
        {supporting.map((section) => (
          <article className="mission-support-card" key={section.title}>
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
