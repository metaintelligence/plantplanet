export const exhibitionViewerConfig = {
  imageFrameExtra: 2,
  clickDistanceThreshold: 4,
  markerRadius: 6,
  minZoom: 0.25,
  maxZoom: 4,
  zoomInFactor: 1.12,
  zoomOutFactor: 0.9,
  cookieMaxAgeSeconds: 31_536_000
} as const;

export const exhibitionViewerText = {
  headerEyebrow: 'Exhibition Management',
  headerFallbackTitle: '전시 관리',
  stageAriaLabel: '전시공간 이미지 영역',
  imageAltFallback: '전시공간 이미지',
  zoomLabel: (zoom: number) => `${Math.round(zoom * 100)}%`,
  markerDialog: {
    eyebrow: 'Marker Content',
    title: '마커 콘텐츠 설정',
    close: '닫기',
    save: '완료',
    removeAssignment: '배치 해제',
    deleteMarker: '마커 삭제',
    emptyTitle: '배치된 콘텐츠가 아직 없습니다.',
    emptyDescription: '먼저 콘텐츠를 생성한 뒤 다시 배치해 주세요.',
    emptyCardTitle: '콘텐츠 설정 없음',
    emptyCardDescription: '이 마커에 배치할 콘텐츠를 선택해 주세요.',
    assignedMarkerAria: (title: string) => `${title} 마커 설정`,
    emptyMarkerAria: '마커 콘텐츠 설정 열기'
  }
} as const;
