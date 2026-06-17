import { wizardText } from '../../../data/wizardText';
import type { PlantRecord } from '../../../types/content';
import WizardSectionTitle from '../WizardSectionTitle';

interface PlantStepProps {
  plants: PlantRecord[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onOpenPlantInfo: (plant: PlantRecord) => void;
}

export default function PlantStep({ plants, selectedPlantId, onSelectPlant, onOpenPlantInfo }: PlantStepProps) {
  return (
    <section>
      <WizardSectionTitle title={wizardText.sections.plant} description={wizardText.stepDescriptions.plant} />
      <div className="plant-picker-grid">
        {plants.map((plant) => (
          <article className={selectedPlantId === plant.id ? 'plant-picker-card selected' : 'plant-picker-card'} key={plant.id}>
            <button className="plant-picker-select" type="button" onClick={() => onSelectPlant(plant.id)}>
              <img src={plant.image.url} alt={plant.image.alt} />
              <strong>{plant.koreanName}</strong>
              <span>{plant.scientificName}</span>
            </button>
            <button className="secondary-button plant-picker-info-button" type="button" onClick={() => onOpenPlantInfo(plant)}>
              {wizardText.buttons.info}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
