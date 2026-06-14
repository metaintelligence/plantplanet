import type { GeneratedContent, GeneratedSection, PlantRecord } from '../types/content';

export default function DefaultLayoutQuizPage({
  content,
  plant
}: {
  content: GeneratedContent;
  plant: PlantRecord;
}) {
  const quizSection =
    content.sections.find((section) => section.title.includes('퀴즈')) ?? content.sections[1];
  const supportSections = content.sections.filter((section) => section !== quizSection);

  return (
    <article className="default-layout-page quiz-default-layout">
      <header className="quiz-header">
        <div>
          <p className="layout-kicker">Interactive Quiz</p>
          <h1>{content.title}</h1>
          <p>{quizSection?.body ?? `${plant.koreanName}의 특징을 맞혀보세요.`}</p>
        </div>
        <img src={plant.image.url} alt={plant.image.alt} />
      </header>

      <section className="quiz-stage">
        <div className="quiz-question-card">
          <span>Q</span>
          <h2>{quizSection?.body ?? `${plant.koreanName}의 특징은 무엇일까요?`}</h2>
          <div className="quiz-answer-grid">
            {(quizSection?.items ?? plant.features).map((item, index) => (
              <button className={index === 0 ? 'correct' : ''} key={item} type="button">
                <strong>{index + 1}</strong>
                {item}
              </button>
            ))}
          </div>
        </div>
        <aside className="quiz-hint-card">
          <h3>힌트</h3>
          <p>{plant.observationTips[0]}</p>
          <span>{plant.scientificName}</span>
        </aside>
      </section>

      <section className="quiz-explain-grid">
        {supportSections.map((section) => (
          <InfoBlock section={section} key={section.title} />
        ))}
      </section>
    </article>
  );
}

function InfoBlock({ section }: { section: GeneratedSection }) {
  return (
    <article className="quiz-explain-card">
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
  );
}
