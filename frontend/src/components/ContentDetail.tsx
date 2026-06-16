import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  audienceOptions,
  deploymentOptions,
  estimatedTimeOptions,
  featureOptions,
  fieldLocationOptions,
  focusTopicOptions,
  labelOf,
  languageOptions,
  layoutOptions,
  purposeOptions,
  seasonOptions,
  storyScenarioOptions,
  templateOptions,
  toneOptions
} from '../data/contentOptions';
import ContentPageRenderer from '../layouts/ContentPageRenderer';
import type { GeneratedContent, PlantRecord } from '../types/content';

type PreviewDevice = 'kiosk' | 'mobile' | 'static-poster' | 'responsive';
type PreviewZoomMode = 'fit' | '0.5' | '0.75' | '1';

interface ScaledPreviewConfig {
  frameWidth: number;
  frameHeight: number;
  screenWidth: number;
  screenHeight: number;
  stageWidth: number;
  stageHeight: number;
}

interface ContentDetailProps {
  content: GeneratedContent | null;
  plant: PlantRecord | null;
  onBack: () => void;
  onRequestRevision: (content: GeneratedContent, revisionPrompt: string) => Promise<void>;
}

export default function ContentDetail({ content, plant, onBack, onRequestRevision }: ContentDetailProps) {
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
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
          <p>생성된 콘텐츠는 아래 주소로 연결됩니다.</p>
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
            title={
              canRequestRevision
                ? '생성형AI 레이아웃 파일을 수정 요청합니다.'
                : '기본 레이아웃 콘텐츠는 AI 수정 대상이 아닙니다.'
            }
            onClick={() => setRevisionOpen(true)}
          >
            AI 수정 요청
          </button>
        </div>
      </header>

      <div className={`content-detail-grid device-${previewDevice}`}>
        <DevicePreviewFrame
          content={content}
          plant={plant}
          device={previewDevice}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      {settingsOpen && (
        <div className="dialog-scrim" role="presentation" onMouseDown={() => setSettingsOpen(false)}>
          <section
            className="generation-settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="generation-settings-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="generation-settings-header">
              <div>
                <p className="eyebrow">Generation Settings</p>
                <h2 id="generation-settings-title">생성값 보기</h2>
                <p>{content.title} 생성 시 선택했던 설정 요약입니다.</p>
              </div>
              <button className="secondary-button" type="button" onClick={() => setSettingsOpen(false)}>
                닫기
              </button>
            </div>

            <div className="generation-settings-grid">
              {buildSettingsSummary(content, plant).map((item) => (
                <div className="generation-settings-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            {content.settings.extraRequest.trim() && (
              <div className="generation-settings-note">
                <strong>추가 요청사항</strong>
                <p>{content.settings.extraRequest.trim()}</p>
              </div>
            )}
          </section>
        </div>
      )}

      {revisionOpen && (
        <div className="dialog-scrim" role="presentation">
          <section className="revision-dialog" role="dialog" aria-modal="true" aria-labelledby="revision-dialog-title">
            <div>
              <p className="eyebrow">Revision Request</p>
              <h2 id="revision-dialog-title">페이지 수정 요청</h2>
              <p>생성된 레이아웃에 반영할 수정 방향을 자연어로 입력해주세요.</p>
            </div>
            <label className="field full">
              <span>수정 요청 텍스트</span>
              <textarea
                value={revisionPrompt}
                placeholder="예: 첫 화면 제목을 더 짧게 바꾸고, 퀴즈 버튼 대비를 높여주세요."
                onChange={(event) => setRevisionPrompt(event.target.value)}
              />
            </label>
            {revisionError && <div className="error-banner compact">{revisionError}</div>}
            <div className="dialog-actions">
              <button className="secondary-button" type="button" disabled={submittingRevision} onClick={() => setRevisionOpen(false)}>
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
  device,
  onOpenSettings
}: {
  content: GeneratedContent;
  plant: PlantRecord;
  device: PreviewDevice;
  onOpenSettings: () => void;
}) {
  const preview = devicePreviewMeta[device];
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fitDeviceScale, setFitDeviceScale] = useState(1);
  const [previewZoomMode, setPreviewZoomMode] = useState<PreviewZoomMode>('fit');
  const scaledConfig = scaledPreviewConfigs[device];
  const previewScale = previewZoomMode === 'fit' ? fitDeviceScale : Number(previewZoomMode);
  const usesScaledDeviceFrame = Boolean(scaledConfig);
  const frameScale = usesScaledDeviceFrame ? previewScale : 1;

  useEffect(() => {
    if (!scaledConfig) {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const updateFrameMetrics = () => {
      const nextFitDeviceScale = Math.min(
        1,
        viewport.clientWidth / scaledConfig.frameWidth,
        viewport.clientHeight > 0 ? viewport.clientHeight / scaledConfig.frameHeight : 1
      );
      setFitDeviceScale(Number.isFinite(nextFitDeviceScale) && nextFitDeviceScale > 0 ? nextFitDeviceScale : 1);
    };

    updateFrameMetrics();
    window.addEventListener('resize', updateFrameMetrics);
    return () => {
      window.removeEventListener('resize', updateFrameMetrics);
    };
  }, [scaledConfig]);

  const canvasStyle = scaledConfig
    ? ({
        width: `${scaledConfig.screenWidth}px`,
        height: `${scaledConfig.screenHeight}px`
      } as CSSProperties)
    : undefined;

  const scaleBoxStyle = scaledConfig
    ? ({
        width: `${scaledConfig.screenWidth}px`,
        height: `${scaledConfig.screenHeight}px`
      } as CSSProperties)
    : undefined;

  const stageStyle = scaledConfig
    ? ({
        width: `${scaledConfig.stageWidth}px`,
        height: `${scaledConfig.stageHeight}px`,
        transform: 'none'
      } as CSSProperties)
    : undefined;

  const frameStyle =
    scaledConfig
      ? ({
          width: `${scaledConfig.frameWidth}px`,
          minWidth: `${scaledConfig.frameWidth}px`,
          zoom: frameScale
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
          <button className="secondary-button preview-settings-button" type="button" onClick={onOpenSettings}>
            생성값 보기
          </button>
          {(device === 'kiosk' || device === 'mobile') && (
            <div className="device-preview-zoom" aria-label="키오스크 미리보기 배율">
              {previewZoomOptions.map((option) => (
                <button
                  className={previewZoomMode === option.value ? 'active' : ''}
                  key={option.value}
                  type="button"
                  onClick={() => setPreviewZoomMode(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
          <span>{preview.size}</span>
        </div>
      </div>

      <div className="device-preview-viewport" ref={viewportRef}>
        <div className={`device-preview-frame ${device}`} style={frameStyle}>
          <div className="device-preview-canvas" style={canvasStyle}>
            <div className="device-preview-scale-box" style={scaleBoxStyle}>
              <div className="device-preview-stage" style={stageStyle}>
                <div className="device-preview-content-wrap">
                  <ContentPageRenderer content={content} plant={plant} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildSettingsSummary(content: GeneratedContent, plant: PlantRecord) {
  const { settings } = content;

  return [
    { label: '콘텐츠 이름', value: content.title },
    { label: '대상 식물', value: `${plant.koreanName} / ${plant.scientificName}` },
    { label: '생성 방식', value: settings.mode === 'advanced' ? '고급 생성' : '일반 생성' },
    { label: '콘텐츠 유형', value: labelOf(templateOptions, settings.template) },
    { label: '레이아웃 방식', value: labelOf(layoutOptions, settings.layoutId) },
    { label: '목적', value: labelOf(purposeOptions, settings.purpose) },
    { label: '톤', value: labelOf(toneOptions, settings.tone) },
    { label: '대상 관람객', value: joinLabels(audienceOptions, settings.audience) },
    { label: '언어', value: joinLabels(languageOptions, settings.languages) },
    { label: '계절', value: labelOf(seasonOptions, settings.season) },
    { label: '체험 시간', value: labelOf(estimatedTimeOptions, settings.estimatedTime) },
    { label: '배포 단말기', value: labelOf(deploymentOptions, settings.deploymentUse) },
    { label: '현장 위치', value: labelOf(fieldLocationOptions, settings.fieldLocation) },
    { label: '강조 콘텐츠', value: joinLabels(focusTopicOptions, settings.focusTopics) },
    {
      label: '추가 기능',
      value: settings.featureOptions.length ? joinLabels(featureOptions, settings.featureOptions) : '선택 없음'
    },
    ...(settings.template === 'storytelling'
      ? [{ label: '스토리 시나리오', value: labelOf(storyScenarioOptions, settings.storyScenario ?? 'nameSecret') }]
      : [])
  ];
}

function joinLabels<T extends string>(options: Array<{ value: T; label: string }>, values: T[]) {
  return values.length ? values.map((value) => labelOf(options, value)).join(', ') : '선택 없음';
}

const previewZoomOptions: { label: string; value: PreviewZoomMode }[] = [
  { label: '맞춤', value: 'fit' },
  { label: '50%', value: '0.5' },
  { label: '75%', value: '0.75' },
  { label: '100%', value: '1' }
];

const scaledPreviewConfigs: Partial<Record<PreviewDevice, ScaledPreviewConfig>> = {
  kiosk: {
    frameWidth: 1956,
    frameHeight: 1120,
    screenWidth: 1920,
    screenHeight: 1080,
    stageWidth: 1920,
    stageHeight: 1080
  },
  mobile: {
    frameWidth: 1108,
    frameHeight: 2380,
    screenWidth: 1080,
    screenHeight: 2340,
    stageWidth: 1080,
    stageHeight: 2340
  }
};

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
  kiosk: { label: '키오스크 FHD', size: '1920x1080' },
  mobile: { label: '모바일', size: '1080x2340' },
  'static-poster': { label: '정적 포스터', size: 'single page' },
  responsive: { label: '반응형', size: 'auto' }
};
