import { wizardStepLabels, wizardSteps, type WizardStepKey } from '../../data/wizardSteps';

interface WizardStepSidebarProps {
  stepIndex: number;
}

export default function WizardStepSidebar({ stepIndex }: WizardStepSidebarProps) {
  return (
    <aside className="wizard-steps">
      {wizardSteps.map((step, index) => (
        <div className={index === stepIndex ? 'active' : ''} key={step}>
          <span>{index + 1}</span>
          <strong>{wizardStepLabels[step as WizardStepKey]}</strong>
        </div>
      ))}
    </aside>
  );
}
