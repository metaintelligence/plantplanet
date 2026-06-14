import type { GeneratedContent, PlantRecord } from '../types/content';
import TemplatePageShell from './TemplatePageShell';

export default function StorytellingContentPage({
  content,
  plant
}: {
  content: GeneratedContent;
  plant: PlantRecord;
}) {
  return (
    <TemplatePageShell
      content={content}
      plant={plant}
      variant="story-layout"
      eyebrow="스토리텔링 페이지"
    />
  );
}
