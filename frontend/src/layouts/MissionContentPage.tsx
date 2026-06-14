import type { GeneratedContent, PlantRecord } from '../types/content';
import TemplatePageShell from './TemplatePageShell';

export default function MissionContentPage({ content, plant }: { content: GeneratedContent; plant: PlantRecord }) {
  return (
    <TemplatePageShell
      content={content}
      plant={plant}
      variant="mission-layout"
      eyebrow="미션 페이지"
    />
  );
}
