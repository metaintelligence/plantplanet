import type { GeneratedContent, PlantRecord } from '../types/content';
import TemplatePageShell from './TemplatePageShell';

export default function QuizContentPage({ content, plant }: { content: GeneratedContent; plant: PlantRecord }) {
  return (
    <TemplatePageShell
      content={content}
      plant={plant}
      variant="quiz-layout"
      eyebrow="퀴즈 페이지"
    />
  );
}
