interface WizardSectionTitleProps {
  title: string;
  description: string;
}

export default function WizardSectionTitle({ title, description }: WizardSectionTitleProps) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
