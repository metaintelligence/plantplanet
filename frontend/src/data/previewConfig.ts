import type { DeploymentUse, GeneratedContent } from '../types/content';

export type PreviewDevice = 'kiosk' | 'mobile' | 'static-poster' | 'responsive';
export type PreviewZoomMode = 'fit' | '0.5' | '0.75' | '1';

export interface ScaledPreviewConfig {
  frameWidth: number;
  frameHeight: number;
  screenWidth: number;
  screenHeight: number;
  stageWidth: number;
  stageHeight: number;
}

export const previewZoomOptions: { label: string; value: PreviewZoomMode }[] = [
  { label: '맞춤', value: 'fit' },
  { label: '50%', value: '0.5' },
  { label: '75%', value: '0.75' },
  { label: '100%', value: '1' }
];

export const scaledPreviewConfigs: Partial<Record<PreviewDevice, ScaledPreviewConfig>> = {
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

export const devicePreviewMeta: Record<PreviewDevice, { label: string; size: string }> = {
  kiosk: { label: '키오스크 FHD', size: '1920x1080' },
  mobile: { label: '모바일', size: '1080x2340' },
  'static-poster': { label: '정적 포스터', size: 'single page' },
  responsive: { label: '반응형', size: 'auto' }
};

export function getPreviewDevice(deploymentUse: DeploymentUse): PreviewDevice {
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

export function getPreviewDeviceFromContent(content: GeneratedContent): PreviewDevice {
  return getPreviewDevice(content.settings.deploymentUse);
}
