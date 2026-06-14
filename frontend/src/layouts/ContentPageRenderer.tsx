import type { GeneratedContent, PlantRecord } from '../types/content';
import ChecklistContentPage from './ChecklistContentPage';
import IntroContentPage from './IntroContentPage';
import MissionContentPage from './MissionContentPage';
import QuizContentPage from './QuizContentPage';
import StorytellingContentPage from './StorytellingContentPage';

export default function ContentPageRenderer({
  content,
  plant
}: {
  content: GeneratedContent;
  plant: PlantRecord;
}) {
  switch (content.settings.template) {
    case 'storytelling':
      return <StorytellingContentPage content={content} plant={plant} />;
    case 'quiz':
      return <QuizContentPage content={content} plant={plant} />;
    case 'mission':
      return <MissionContentPage content={content} plant={plant} />;
    case 'checklist':
      return <ChecklistContentPage content={content} plant={plant} />;
    case 'intro':
    default:
      return <IntroContentPage content={content} plant={plant} />;
  }
}
