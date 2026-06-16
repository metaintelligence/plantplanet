import { useState } from 'react';
import PlantDataCard, { PlantDataDialog } from './PlantDataCard';
import type { GeneratedContent, PlantRecord } from '../types/content';
import type { LayoutGenerationJob, LayoutGenerationJobStatus } from '../types/generationJob';

interface HomeDashboardProps {
  plants: PlantRecord[];
  contents: GeneratedContent[];
  generationJobs: LayoutGenerationJob[];
  onNavigate: (path: string) => void;
  onRegenerate: (job: LayoutGenerationJob) => void;
}

const activeStatuses = new Set<LayoutGenerationJobStatus>(['queued', 'running', 'revising']);
const retryableStatuses = new Set<LayoutGenerationJobStatus>(['failed', 'timeout']);

export default function HomeDashboard({ plants, contents, generationJobs, onNavigate, onRegenerate }: HomeDashboardProps) {
  const [selectedPlant, setSelectedPlant] = useState<PlantRecord | null>(null);
  const publishedCount = contents.filter((content) => content.status === 'published').length;
  const activeJobCount = generationJobs.filter((job) => activeStatuses.has(job.status)).length;
  const activeJob = generationJobs.find((job) => activeStatuses.has(job.status));

  return (
    <div className="dashboard-page">
      <section className="intro-band">
        <div>
          <p className="eyebrow">HanGarden</p>
          <h1>생성형 AI 기반 식물해설 콘텐츠 관리자</h1>
          <p>
            HanGarden은 수목원 식물 데이터와 관람객 맥락을 조합해 모바일, 키오스크, 정적 포스터 환경에 맞는 해설
            콘텐츠를 생성하고 관리하는 데모 플랫폼입니다.
          </p>
        </div>
        <div className="intro-actions">
          <button className="primary-button" type="button" onClick={() => onNavigate('/create')}>
            새 콘텐츠 만들기
          </button>
          <button className="secondary-button" type="button" onClick={() => onNavigate('/manage')}>
            콘텐츠 목록 보기
          </button>
        </div>
      </section>

      {activeJob && (
        <div className="notice-banner">
          현재 "{activeJob.contentTitle}" 작업이 진행 중입니다. 완료 전까지 신규 페이지 생성 요청은 시작할 수 없습니다.
        </div>
      )}

      <section className="metric-grid">
        <Metric label="목업 식물 데이터" value={`${plants.length}`} />
        <Metric label="생성 콘텐츠" value={`${contents.length}`} />
        <Metric label="게시 콘텐츠" value={`${publishedCount}`} />
        <Metric label="진행 중 요청" value={`${activeJobCount}`} />
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">Mock DB</p>
              <h2>식물 데이터 조회</h2>
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
              <p className="eyebrow">Recent</p>
              <h2>최근 콘텐츠</h2>
            </div>
          </div>
          {contents.length === 0 ? (
            <div className="empty-state">
              <strong>아직 생성된 콘텐츠가 없습니다.</strong>
              <span>콘텐츠 생성 마법사를 시작해 첫 페이지를 만들어보세요.</span>
            </div>
          ) : (
            <div className="recent-list dashboard-scroll-list recent-scroll-list">
              {contents.map((content) => (
                <button key={content.id} type="button" onClick={() => onNavigate(`/content/${content.id}`)}>
                  <strong>{content.title}</strong>
                  <span>{content.status === 'published' ? '게시됨' : '초안'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="panel job-panel">
        <div className="panel-heading compact">
          <div>
            <p className="eyebrow">Generation Queue</p>
            <h2>요청 작업 현황</h2>
          </div>
          <button className="secondary-button" type="button" onClick={() => onNavigate('/create')}>
            새 요청
          </button>
        </div>
        {generationJobs.length === 0 ? (
          <div className="empty-state">
            <strong>아직 요청된 생성 작업이 없습니다.</strong>
            <span>콘텐츠 생성 마법사를 완료하면 이곳에서 작업 상태를 확인할 수 있습니다.</span>
          </div>
        ) : (
          <div className="job-list dashboard-scroll-list job-scroll-list">
            {generationJobs.map((job) => (
              <article className="job-row" key={job.id}>
                <div className="job-row-main">
                  <div className="job-title-line">
                    {activeStatuses.has(job.status) && <span className="inline-spinner" />}
                    <strong>{job.contentTitle}</strong>
                    <StatusBadge status={job.status} />
                  </div>
                  <p>{job.message}</p>
                  <span>
                    {job.operation === 'revise' ? '수정 요청' : '생성 요청'} · {job.plantName} · {job.template} ·{' '}
                    {formatTime(job.updatedAt)}
                  </span>
                </div>
                {retryableStatuses.has(job.status) ? (
                  <button className="primary-button" type="button" onClick={() => onRegenerate(job)}>
                    재생성 요청
                  </button>
                ) : job.status === 'completed' ? (
                  <button className="secondary-button" type="button" onClick={() => onNavigate(normalizeRoute(job.routePath))}>
                    페이지 열기
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        )}
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

function normalizeRoute(routePath: string) {
  return routePath.replace(/^#/, '') || '/';
}

function StatusBadge({ status }: { status: LayoutGenerationJobStatus }) {
  const labels: Record<LayoutGenerationJobStatus, string> = {
    queued: '대기',
    running: '생성 중',
    revising: '수정 중',
    completed: '완료',
    failed: '실패',
    timeout: '시간 초과'
  };

  return <span className={`job-status ${status}`}>{labels[status]}</span>;
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
