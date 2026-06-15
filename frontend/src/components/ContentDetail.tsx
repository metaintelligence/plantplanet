import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import ContentPageRenderer from '../layouts/ContentPageRenderer';
import type { GeneratedContent, PlantRecord } from '../types/content';

type PreviewDevice = 'kiosk' | 'mobile' | 'static-poster' | 'responsive';
type KioskZoomMode = 'fit' | '0.5' | '0.75' | '1';

const KIOSK_STAGE_WIDTH = 1920;
const KIOSK_STAGE_HEIGHT = 1080;

interface ContentDetailProps {
  content: GeneratedContent | null;
  plant: PlantRecord | null;
  onBack: () => void;
  onRequestRevision: (content: GeneratedContent, revisionPrompt: string) => Promise<void>;
}

export default function ContentDetail({ content, plant, onBack, onRequestRevision }: ContentDetailProps) {
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [revisionError, setRevisionError] = useState('');
  const [submittingRevision, setSubmittingRevision] = useState(false);

  if (!content || !plant) {
    return (
      <div className="panel not-found-panel">
        <strong>콘텐츠를 찾을 수 없습니다.</strong>
        <span>서버 파일에 없는 콘텐츠이거나 식물 데이터가 변경되었습니다.</span>
        <button className="secondary-button" type="button" onClick={onBack}>
          콘텐츠 관리로 이동
        </button>
      </div>
    );
  }

  const fullLink = `${window.location.href.split('#')[0]}${content.routePath}`;
  const canRequestRevision = content.settings.layoutId === 'generated';
  const previewDevice = getPreviewDevice(content.settings.deploymentUse);

  const submitRevision = async () => {
    const prompt = revisionPrompt.trim();
    if (!prompt) {
      setRevisionError('수정 요청 내용을 입력해주세요.');
      return;
    }

    setSubmittingRevision(true);
    setRevisionError('');
    try {
      await onRequestRevision(content, prompt);
      setRevisionOpen(false);
      setRevisionPrompt('');
    } catch (error) {
      setRevisionError(error instanceof Error ? error.message : '수정 요청을 시작하지 못했습니다.');
    } finally {
      setSubmittingRevision(false);
    }
  };

  return (
    <div className={`content-detail-page content-detail-${previewDevice}`}>
      <header className="page-header">
        <div>
          <p className="eyebrow">Generated Page</p>
          <h1>{content.title}</h1>
          <p>생성된 콘텐츠는 아래 주소로 접근할 수 있습니다.</p>
          <code className="share-link">{fullLink}</code>
        </div>
        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={onBack}>
            목록
          </button>
          <button
            className="primary-button"
            type="button"
            disabled={!canRequestRevision}
            title={canRequestRevision ? '생성형AI 레이아웃 파일을 수정합니다.' : '기본 레이아웃 콘텐츠는 AI 수정 대상이 아닙니다.'}
            onClick={() => setRevisionOpen(true)}
          >
            AI 수정 요청
          </button>
        </div>
      </header>

      <div className={`content-detail-grid device-${previewDevice}`}>
        <DevicePreviewFrame content={content} plant={plant} device={previewDevice} />
      </div>

      {revisionOpen && (
        <div className="dialog-scrim" role="presentation">
          <section className="revision-dialog" role="dialog" aria-modal="true" aria-labelledby="revision-dialog-title">
            <div>
              <p className="eyebrow">Revision Request</p>
              <h2 id="revision-dialog-title">페이지 수정 요청</h2>
              <p>현재 생성형AI 레이아웃 파일에 반영할 수정 방향을 자연어로 입력해주세요.</p>
            </div>
            <label className="field full">
              <span>수정 요청 텍스트</span>
              <textarea
                value={revisionPrompt}
                placeholder="예: 첫 화면의 제목을 더 어린이 친화적으로 바꾸고, 퀴즈 버튼 대비를 높여줘."
                onChange={(event) => setRevisionPrompt(event.target.value)}
              />
            </label>
            {revisionError && <div className="error-banner compact">{revisionError}</div>}
            <div className="dialog-actions">
              <button
                className="secondary-button"
                type="button"
                disabled={submittingRevision}
                onClick={() => setRevisionOpen(false)}
              >
                취소
              </button>
              <button className="primary-button" type="button" disabled={submittingRevision} onClick={submitRevision}>
                {submittingRevision && <span className="button-spinner" aria-hidden="true" />}
                수정 요청 보내기
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function DevicePreviewFrame({
  content,
  plant,
  device
}: {
  content: GeneratedContent;
  plant: PlantRecord;
  device: PreviewDevice;
}) {
  const preview = devicePreviewMeta[device];
  const canvasRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [kioskZoomMode, setKioskZoomMode] = useState<KioskZoomMode>('fit');
  const kioskScale = kioskZoomMode === 'fit' ? fitScale : Number(kioskZoomMode);

  useEffect(() => {
    if (device !== 'kiosk') {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const updateFitScale = () => {
      const rect = canvas.getBoundingClientRect();
      const nextScale = Math.min(1, rect.width / KIOSK_STAGE_WIDTH, rect.height / KIOSK_STAGE_HEIGHT);
      setFitScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    updateFitScale();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateFitScale);
      return () => window.removeEventListener('resize', updateFitScale);
    }

    const observer = new ResizeObserver(updateFitScale);
    observer.observe(canvas);
    window.addEventListener('resize', updateFitScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateFitScale);
    };
  }, [device]);

  const canvasStyle =
    device === 'kiosk'
      ? ({
          '--preview-scale': kioskScale.toString(),
          '--preview-scaled-width': `${KIOSK_STAGE_WIDTH * kioskScale}px`,
          '--preview-scaled-height': `${KIOSK_STAGE_HEIGHT * kioskScale}px`
        } as CSSProperties)
      : undefined;

  return (
    <section className={`device-preview-shell ${device}`} aria-label={`${preview.label} 콘텐츠 미리보기`}>
      <div className="device-preview-header">
        <div>
          <p className="eyebrow">Preview</p>
          <h2>{preview.label}</h2>
        </div>
        <div className="device-preview-header-tools">
          {device === 'kiosk' && (
            <div className="device-preview-zoom" aria-label="키오스크 프리뷰 배율">
              {kioskZoomOptions.map((option) => (
                <button
                  className={kioskZoomMode === option.value ? 'active' : ''}
                  key={option.value}
                  type="button"
                  onClick={() => setKioskZoomMode(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
          <span>{preview.size}</span>
        </div>
      </div>
      <div className="device-preview-canvas" ref={canvasRef} style={canvasStyle}>
        <div className="device-preview-scale-box">
          <div className="device-preview-stage">
            <div className="device-preview-content-wrap">
              <ContentPageRenderer content={content} plant={plant} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const kioskZoomOptions: { label: string; value: KioskZoomMode }[] = [
  { label: '맞춤', value: 'fit' },
  { label: '50%', value: '0.5' },
  { label: '75%', value: '0.75' },
  { label: '100%', value: '1' }
];

function getPreviewDevice(deploymentUse: GeneratedContent['settings']['deploymentUse']): PreviewDevice {
  switch (deploymentUse) {
    case 'kiosk':
      return 'kiosk';
    case 'staticPoster':
      return 'static-poster';
    case 'mobile':
      return 'mobile';
    default:
      return 'responsive';
  }
}

const devicePreviewMeta: Record<PreviewDevice, { label: string; size: string }> = {
  kiosk: {
    label: '키오스크 FHD',
    size: '1920x1080'
  },
  mobile: {
    label: '모바일',
    size: '9:16'
  },
  'static-poster': {
    label: '정적 포스터',
    size: 'single page'
  },
  responsive: {
    label: '반응형',
    size: 'auto'
  }
};
