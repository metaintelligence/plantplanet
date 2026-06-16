import type { GeneratedContent, PlantRecord } from '../types/content';
import { generatedLayoutRegistry } from '../generated/generatedLayoutRegistry';
import DefaultLayoutIntroPage from './DefaultLayoutIntroPage';
import DefaultLayoutMissionPage from './DefaultLayoutMissionPage';
import DefaultLayoutQuizPage from './DefaultLayoutQuizPage';
import DefaultLayoutStorytellingPage from './DefaultLayoutStorytellingPage';

export default function ContentPageRenderer({
  content,
  plant
}: {
  content: GeneratedContent;
  plant: PlantRecord;
}) {
  const GeneratedLayout = content.settings.layoutId === 'generated' ? generatedLayoutRegistry[content.id] : null;
  if (GeneratedLayout) {
    return <GeneratedLayout content={content} plant={plant} />;
  }

  switch (content.settings.template) {
    case 'storytelling':
      return <DefaultLayoutStorytellingPage content={content} plant={plant} />;
    case 'quiz':
      return <DefaultLayoutQuizPage content={content} plant={plant} />;
    case 'mission':
      return <DefaultLayoutMissionPage content={content} plant={plant} />;
    case 'intro':
    default:
      return <DefaultLayoutIntroPage content={content} plant={plant} />;
  }
}
