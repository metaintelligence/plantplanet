import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { contentDetailText } from '../../data/contentDetailText';
import {
  devicePreviewMeta,
  getPreviewDeviceFromContent,
  previewZoomOptions,
  scaledPreviewConfigs,
  type PreviewZoomMode
} from '../../data/previewConfig';
import ContentPageRenderer from '../../layouts/ContentPageRenderer';
import type { GeneratedContent, PlantRecord } from '../../types/content';

interface DevicePreviewFrameProps {
  content: GeneratedContent;
  plant: PlantRecord;
  onOpenSettings: () => void;
}

export default function DevicePreviewFrame({ content, plant, onOpenSettings }: DevicePreviewFrameProps) {
  const device = getPreviewDeviceFromContent(content);
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

  const frameStyle = scaledConfig
    ? ({
        width: `${scaledConfig.frameWidth}px`,
        minWidth: `${scaledConfig.frameWidth}px`,
        zoom: frameScale
      } as CSSProperties)
    : undefined;

  return (
    <section className={`device-preview-shell ${device}`} aria-label={contentDetailText.preview.previewAria(preview.label)}>
      <div className="device-preview-header">
        <div>
          <p className="eyebrow">{contentDetailText.preview.eyebrow}</p>
          <h2>{preview.label}</h2>
        </div>
        <div className="device-preview-header-tools">
          <button className="secondary-button preview-settings-button" type="button" onClick={onOpenSettings}>
            {contentDetailText.preview.openSettings}
          </button>
          {(device === 'kiosk' || device === 'mobile') && (
            <div className="device-preview-zoom" aria-label={contentDetailText.preview.zoomAria(preview.label)}>
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
