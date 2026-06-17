import { useState } from 'react';
import { dashboardText } from '../data/dashboardText';
import { generationJobActiveStatuses } from '../data/generationJobs';
import GenerationJobList from './GenerationJobList';
import PlantDataCard, { PlantDataDialog } from './PlantDataCard';
import type { GeneratedContent, PlantRecord } from '../types/content';
import type { LayoutGenerationJob } from '../types/generationJob';

interface HomeDashboardProps {
  plants: PlantRecord[];
  contents: GeneratedContent[];
  generationJobs: LayoutGenerationJob[];
  onNavigate: (path: string) => void;
  onRegenerate: (job: LayoutGenerationJob) => void;
}

export default function HomeDashboard({
  plants,
  contents,
  generationJobs,
  onNavigate,
  onRegenerate
}: HomeDashboardProps) {
  const [selectedPlant, setSelectedPlant] = useState<PlantRecord | null>(null);
  const publishedCount = contents.length;
  const activeJobCount = generationJobs.filter((job) => generationJobActiveStatuses.has(job.status)).length;
  const activeJob = generationJobs.find((job) => generationJobActiveStatuses.has(job.status));

  return (
    <div className="dashboard-page">
      <section className="intro-band">
        <div>
          <p className="eyebrow">{dashboardText.intro.eyebrow}</p>
          <h1>{dashboardText.intro.title}</h1>
          <p>{dashboardText.intro.description}</p>
        </div>
        <div className="intro-actions">
          <button className="primary-button" type="button" onClick={() => onNavigate('/create')}>
            {dashboardText.intro.create}
          </button>
          <button className="secondary-button" type="button" onClick={() => onNavigate('/manage')}>
            {dashboardText.intro.manage}
          </button>
        </div>
      </section>

      {activeJob && <div className="notice-banner">{dashboardText.lockedNotice(activeJob.contentTitle)}</div>}

      <section className="metric-grid">
        <Metric label={dashboardText.metrics.plants} value={`${plants.length}`} />
        <Metric label={dashboardText.metrics.created} value={`${contents.length}`} />
        <Metric label={dashboardText.metrics.published} value={`${publishedCount}`} />
        <Metric label={dashboardText.metrics.running} value={`${activeJobCount}`} />
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">{dashboardText.mockDb.eyebrow}</p>
              <h2>{dashboardText.mockDb.title}</h2>
            </div>
          </div>
          <div className="plant-data-grid dashboard-scroll-list plant-scroll-list">
            {plants.map((plant) => (
              <PlantDataCard key={plant.id} plant={plant} onOpen={setSelectedPlant} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">{dashboardText.recent.eyebrow}</p>
              <h2>{dashboardText.recent.title}</h2>
            </div>
          </div>
          {contents.length === 0 ? (
            <div className="empty-state">
              <strong>{dashboardText.recent.emptyTitle}</strong>
              <span>{dashboardText.recent.emptyDescription}</span>
            </div>
          ) : (
            <div className="recent-list dashboard-scroll-list recent-scroll-list">
              {contents.map((content) => (
                <button key={content.id} type="button" onClick={() => onNavigate(`/content/${content.id}`)}>
                  <strong>{content.title}</strong>
                  <span>{content.status === 'published' ? dashboardText.recent.published : dashboardText.recent.draft}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="panel job-panel">
        <div className="panel-heading compact">
          <div>
            <p className="eyebrow">{dashboardText.jobs.eyebrow}</p>
            <h2>{dashboardText.jobs.title}</h2>
          </div>
          <button className="secondary-button" type="button" onClick={() => onNavigate('/create')}>
            {dashboardText.jobs.create}
          </button>
        </div>

        <div className="dashboard-scroll-list job-scroll-list">
          <GenerationJobList
            jobs={generationJobs}
            emptyTitle={dashboardText.jobs.emptyTitle}
            emptyDescription={dashboardText.jobs.emptyDescription}
            onNavigate={onNavigate}
            onRegenerate={onRegenerate}
          />
        </div>
      </section>

      {selectedPlant && <PlantDataDialog plant={selectedPlant} onClose={() => setSelectedPlant(null)} />}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
