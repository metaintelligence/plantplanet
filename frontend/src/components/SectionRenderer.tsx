import type { Section } from '../types/pageConfig';

export default function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'hero':
    case 'info':
    case 'story':
    case 'mission':
      return (
        <section className={`preview-section ${section.type}`}>
          <h4>{section.title}</h4>
          <p>{section.body}</p>
        </section>
      );
    case 'quiz':
      return (
        <section className="preview-section quiz">
          <h4>퀴즈</h4>
          <p>{section.question}</p>
          <div className="quiz-options">
            {section.options.map((option) => (
              <button key={option} type="button">
                {option}
              </button>
            ))}
          </div>
        </section>
      );
    case 'checklist':
      return (
        <section className="preview-section checklist">
          <h4>{section.title}</h4>
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      );
    case 'similarPlants':
      return (
        <section className="preview-section similar">
          <h4>{section.title}</h4>
          <div className="plant-tags">
            {section.plants.map((plant) => (
              <span key={plant}>{plant}</span>
            ))}
          </div>
        </section>
      );
    case 'deployment':
      return (
        <section className="preview-section deployment">
          <h4>{section.title}</h4>
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      );
    default:
      return (
        <section className="preview-section fallback">
          <h4>지원 예정 섹션</h4>
          <p>{(section as { type: string }).type} 타입은 아직 미리보기 컴포넌트가 준비되지 않았습니다.</p>
        </section>
      );
  }
}
