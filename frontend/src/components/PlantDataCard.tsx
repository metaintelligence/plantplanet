import { plantCategoryLabels, plantDataText, plantSeasonLabels } from '../data/plantDataText';
import type { PlantRecord, Season } from '../types/content';

interface PlantDataCardProps {
  plant: PlantRecord;
  onOpen: (plant: PlantRecord) => void;
}

export default function PlantDataCard({ plant, onOpen }: PlantDataCardProps) {
  return (
    <article className="plant-data-card">
      <button className="plant-data-summary" type="button" onClick={() => onOpen(plant)}>
        <img src={plant.image.url} alt={plant.image.alt} />
        <span className="plant-data-copy">
          <strong>{plant.koreanName}</strong>
          <em>{plant.scientificName}</em>
          <span>
            {plantCategoryLabels[plant.category]} · {plant.family}
          </span>
        </span>
      </button>
    </article>
  );
}

export function PlantDataDialog({
  plant,
  onClose
}: {
  plant: PlantRecord;
  onClose: () => void;
}) {
  return (
    <div className="dialog-scrim" role="presentation" onMouseDown={onClose}>
      <section
        className="plant-data-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="plant-data-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="plant-data-dialog-header">
          <div>
            <p className="eyebrow">{plantDataText.eyebrow}</p>
            <h2 id="plant-data-dialog-title">{plant.koreanName}</h2>
            <p>{plant.scientificName}</p>
          </div>
          <button className="secondary-button" type="button" onClick={onClose}>
            {plantDataText.close}
          </button>
        </header>

        <div className="plant-data-dialog-body">
          <img src={plant.image.url} alt={plant.image.alt} />
          <div className="plant-data-detail">
            <div className="plant-data-facts">
              <Fact label={plantDataText.fields.category} value={`${plantCategoryLabels[plant.category]} · ${plant.family}`} />
              <Fact label={plantDataText.fields.commonName} value={plant.commonName} />
              <Fact label={plantDataText.fields.origin} value={plant.origin} />
              <Fact label={plantDataText.fields.habitat} value={plant.habitat} />
              <Fact label={plantDataText.fields.size} value={plant.size} />
              <Fact label={plantDataText.fields.floweringSeason} value={plant.floweringSeason} />
            </div>

            <section>
              <h3>{plantDataText.sections.features}</h3>
              <ul>
                {plant.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>{plantDataText.sections.observationTips}</h3>
              <ul>
                {plant.observationTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <section className="plant-season-grid">
              {Object.entries(plant.seasonHighlights).map(([season, text]) => (
                <div key={season}>
                  <span>{plantSeasonLabels[season as Season]}</span>
                  <p>{text}</p>
                </div>
              ))}
            </section>

            <section className="plant-data-message">
              <h3>{plantDataText.sections.conservationMessage}</h3>
              <p>{plant.conservationMessage}</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
