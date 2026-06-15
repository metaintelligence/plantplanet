import type { PlantRecord, Season } from '../types/content';

interface PlantDataCardProps {
  plant: PlantRecord;
  onOpen: (plant: PlantRecord) => void;
}

const categoryLabels: Record<PlantRecord['category'], string> = {
  tree: '나무',
  shrub: '관목',
  herb: '초본'
};

const seasonLabels: Record<Season, string> = {
  spring: '봄',
  summer: '여름',
  autumn: '가을',
  winter: '겨울',
  auto: '대표 관찰 포인트'
};

export default function PlantDataCard({ plant, onOpen }: PlantDataCardProps) {
  return (
    <article className="plant-data-card">
      <button className="plant-data-summary" type="button" onClick={() => onOpen(plant)}>
        <img src={plant.image.url} alt={plant.image.alt} />
        <span className="plant-data-copy">
          <strong>{plant.koreanName}</strong>
          <em>{plant.scientificName}</em>
          <span>
            {categoryLabels[plant.category]} · {plant.family}
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
            <p className="eyebrow">Mock DB</p>
            <h2 id="plant-data-dialog-title">{plant.koreanName}</h2>
            <p>{plant.scientificName}</p>
          </div>
          <button className="secondary-button" type="button" onClick={onClose}>
            닫기
          </button>
        </header>

        <div className="plant-data-dialog-body">
          <img src={plant.image.url} alt={plant.image.alt} />
          <div className="plant-data-detail">
            <div className="plant-data-facts">
              <Fact label="구분" value={`${categoryLabels[plant.category]} · ${plant.family}`} />
              <Fact label="일반명" value={plant.commonName} />
              <Fact label="원산/분포" value={plant.origin} />
              <Fact label="서식 환경" value={plant.habitat} />
              <Fact label="크기" value={plant.size} />
              <Fact label="개화/관찰 시기" value={plant.floweringSeason} />
            </div>

            <section>
              <h3>주요 특징</h3>
              <ul>
                {plant.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>관찰 팁</h3>
              <ul>
                {plant.observationTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <section className="plant-season-grid">
              {Object.entries(plant.seasonHighlights).map(([season, text]) => (
                <div key={season}>
                  <span>{seasonLabels[season as Season]}</span>
                  <p>{text}</p>
                </div>
              ))}
            </section>

            <section className="plant-data-message">
              <h3>보전 메시지</h3>
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
