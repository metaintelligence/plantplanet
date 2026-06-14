import type { GeneratedContent, PlantRecord } from '../types/content';
import TemplatePageShell from './TemplatePageShell';

export default function ChecklistContentPage({
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
      variant="checklist-layout"
      eyebrow="관찰 체크리스트 페이지"
    />
  );
}
