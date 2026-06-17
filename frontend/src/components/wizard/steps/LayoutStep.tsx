import { layoutOptions } from '../../../data/contentOptions';
import { wizardText } from '../../../data/wizardText';
import type { ContentSettings } from '../../../types/content';
import { ChoiceGrid } from '../WizardFieldControls';

interface LayoutStepProps {
  layoutId: ContentSettings['layoutId'];
  onLayoutChange: (layoutId: ContentSettings['layoutId']) => void;
}

export default function LayoutStep({ layoutId, onLayoutChange }: LayoutStepProps) {
  return (
    <ChoiceGrid
      title={wizardText.sections.layout}
      description={wizardText.stepDescriptions.layout}
      items={layoutOptions}
      value={layoutId}
      onChange={onLayoutChange}
    />
  );
}
