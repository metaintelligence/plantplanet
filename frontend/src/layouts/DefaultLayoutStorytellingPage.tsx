import type { GeneratedContent, PlantRecord } from '../types/content';

export default function DefaultLayoutStorytellingPage({
  content,
  plant
}: {
  content: GeneratedContent;
  plant: PlantRecord;
}) {
  const storyLead = content.sections[0];
  const chapters = content.sections.slice(1);

  return (
    <article className="default-layout-page storytelling-default-layout">
      <header className="story-cover" style={{ backgroundImage: `url(${plant.image.url})` }}>
        <div className="story-cover-panel">
          <p className="layout-kicker">Storytelling</p>
          <h1>{content.title}</h1>
          <p>{storyLead?.body ?? content.summary}</p>
        </div>
      </header>

      <section className="story-scroll">
        {chapters.map((chapter, index) => (
          <article className="story-chapter" key={chapter.title}>
            <span className="story-number">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{chapter.title}</h2>
              <p>{chapter.body}</p>
              {chapter.items && (
                <div className="story-note-list">
                  {chapter.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </article>
  );
}
