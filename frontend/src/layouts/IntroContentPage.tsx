import type { GeneratedContent, PlantRecord } from '../types/content';
import TemplatePageShell from './TemplatePageShell';

export default function IntroContentPage({ content, plant }: { content: GeneratedContent; plant: PlantRecord }) {
  return (
    <TemplatePageShell
      content={content}
      plant={plant}
      variant="intro-layout"
      eyebrow="식물 소개 페이지"
    />
  );
}
