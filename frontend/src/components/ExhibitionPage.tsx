import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import type { GeneratedContent, PlantRecord, TemplateType } from '../types/content';
import { exhibitionSites } from './AppShell';

const exhibitionImageBySiteId: Record<string, string> = {
  baekdudaegan: `${import.meta.env.BASE_URL}images/baekdu.jpg`,
  sejong: `${import.meta.env.BASE_URL}images/sejong.jpg`,
  'native-plants': `${import.meta.env.BASE_URL}images/korea.jpg`,
  'garden-culture': `${import.meta.env.BASE_URL}images/garden.jpg`
};

const templateLabels: Record<TemplateType, string> = {
  intro: '인트로',
  storytelling: '스토리텔링',
  quiz: '퀴즈',
  mission: '관찰 미션'
};

type Point = {
  x: number;
  y: number;
};

type Marker = Point & {
  id: number;
  contentId: string | null;
};

interface ExhibitionPageProps {
  siteId: string;
  contents: GeneratedContent[];
  plants: PlantRecord[];
}

export default function ExhibitionPage({ siteId, contents, plants }: ExhibitionPageProps) {
  const site = exhibitionSites.find((item) => item.id === siteId);
  const imageSrc = exhibitionImageBySiteId[siteId];

  return (
    <div className="exhibition-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Exhibition Management</p>
          <h1>{site?.name ?? '전시 관리'}</h1>
        </div>
      </header>

      <section className="exhibition-image-stage" aria-label="전시공간 편집 영역">
        {imageSrc ? (
          <ExhibitionMapViewer
            imageSrc={imageSrc}
            imageAlt={site?.name ?? '전시공간 도식'}
            contents={contents}
            plants={plants}
          />
        ) : (
          <div className="blank-exhibition-canvas" />
        )}
      </section>
    </div>
  );
}

function ExhibitionMapViewer({
  imageSrc,
  imageAlt,
  contents,
  plants
}: {
  imageSrc: string;
  imageAlt: string;
  contents: GeneratedContent[];
  plants: PlantRecord[];
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [dragging, setDragging] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const dragStateRef = useRef<{ pointerId: number; start: Point; origin: Point } | null>(null);
  const nextMarkerIdRef = useRef(1);
  const initializedRef = useRef(false);
  const IMAGE_FRAME_EXTRA = 2;
  const IMAGE_FRAME_PADDING = IMAGE_FRAME_EXTRA / 2;
  const CLICK_DISTANCE_THRESHOLD = 4;
  const MARKER_RADIUS = 6;
  const MARKER_CREATION_GUARD_RADIUS = MARKER_RADIUS * 2;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const updateViewportSize = () => {
      setViewportSize({ width: viewport.clientWidth, height: viewport.clientHeight });
    };

    updateViewportSize();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateViewportSize);
      return () => window.removeEventListener('resize', updateViewportSize);
    }

    const observer = new ResizeObserver(updateViewportSize);
    observer.observe(viewport);
    window.addEventListener('resize', updateViewportSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateViewportSize);
    };
  }, []);

  const contentLookup = useMemo(() => new Map(contents.map((content) => [content.id, content])), [contents]);
  const plantLookup = useMemo(() => new Map(plants.map((plant) => [plant.id, plant])), [plants]);

  const getRenderedSize = (nextZoom = zoom) => ({
    width: naturalSize.width * nextZoom + IMAGE_FRAME_EXTRA,
    height: naturalSize.height * nextZoom + IMAGE_FRAME_EXTRA
  });

  const clampPan = (nextPan: Point, nextZoom = zoom) => {
    const { width, height } = getRenderedSize(nextZoom);
    const centeredX = (viewportSize.width - width) / 2;
    const centeredY = (viewportSize.height - height) / 2;
    const minX = width > viewportSize.width ? viewportSize.width - width : centeredX;
    const maxX = width > viewportSize.width ? 0 : centeredX;
    const minY = height > viewportSize.height ? viewportSize.height - height : centeredY;
    const maxY = height > viewportSize.height ? 0 : centeredY;

    return {
      x: Math.min(maxX, Math.max(minX, nextPan.x)),
      y: Math.min(maxY, Math.max(minY, nextPan.y))
    };
  };

  useEffect(() => {
    if (!naturalSize.width || !naturalSize.height) {
      return;
    }

    const centeredSize = getRenderedSize(zoom);
    const centered = clampPan({
      x: (viewportSize.width - centeredSize.width) / 2,
      y: (viewportSize.height - centeredSize.height) / 2
    });

    setPan((current) => {
      if (!initializedRef.current) {
        initializedRef.current = true;
        return centered;
      }

      return clampPan(current);
    });
  }, [naturalSize.height, naturalSize.width, viewportSize.height, viewportSize.width, zoom]);

  const activeMarker = useMemo(
    () => markers.find((marker) => marker.id === activeMarkerId) ?? null,
    [activeMarkerId, markers]
  );

  const activeMarkerContent = activeMarker?.contentId ? contentLookup.get(activeMarker.contentId) ?? null : null;

  useEffect(() => {
    setSelectedContentId(activeMarkerContent?.id ?? null);
  }, [activeMarkerContent?.id]);

  const openMarkerDialog = (markerId: number) => {
    const marker = markers.find((item) => item.id === markerId);
    setActiveMarkerId(markerId);
    setSelectedContentId(marker?.contentId ?? null);
  };

  const closeMarkerDialog = () => {
    setActiveMarkerId(null);
    setSelectedContentId(null);
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!naturalSize.width || !naturalSize.height) {
      return;
    }

    event.preventDefault();

    const nextZoom = Math.min(4, Math.max(0.25, zoom * (event.deltaY < 0 ? 1.12 : 0.9)));
    if (nextZoom === zoom) {
      return;
    }

    const { width: currentWidth, height: currentHeight } = getRenderedSize(zoom);
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;
    const normalizedX = (centerX - pan.x) / currentWidth;
    const normalizedY = (centerY - pan.y) / currentHeight;
    const nextWidth = naturalSize.width * nextZoom + IMAGE_FRAME_EXTRA;
    const nextHeight = naturalSize.height * nextZoom + IMAGE_FRAME_EXTRA;
    const nextPan = {
      x: centerX - normalizedX * nextWidth,
      y: centerY - normalizedY * nextHeight
    };

    setZoom(nextZoom);
    setPan(clampPan(nextPan, nextZoom));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!naturalSize.width || !naturalSize.height) {
      return;
    }

    event.preventDefault();

    dragStateRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: pan
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();

    const deltaX = event.clientX - dragState.start.x;
    const deltaY = event.clientY - dragState.start.y;
    setPan(clampPan({ x: dragState.origin.x + deltaX, y: dragState.origin.y + deltaY }));
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const viewport = viewportRef.current;
    const deltaX = event.clientX - dragState.start.x;
    const deltaY = event.clientY - dragState.start.y;
    const moved = Math.hypot(deltaX, deltaY) > CLICK_DISTANCE_THRESHOLD;

    if (!moved && viewport && naturalSize.width && naturalSize.height) {
      const rect = viewport.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const nearbyMarker = markers.find((marker) => {
        const markerScreenX = pan.x + (marker.x + IMAGE_FRAME_PADDING) * zoom;
        const markerScreenY = pan.y + (marker.y + IMAGE_FRAME_PADDING) * zoom;

        return Math.hypot(localX - markerScreenX, localY - markerScreenY) <= MARKER_CREATION_GUARD_RADIUS;
      });

      if (nearbyMarker) {
        openMarkerDialog(nearbyMarker.id);
        dragStateRef.current = null;
        setDragging(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }

      const imageX = (localX - pan.x) / zoom - IMAGE_FRAME_PADDING;
      const imageY = (localY - pan.y) / zoom - IMAGE_FRAME_PADDING;

      if (imageX >= 0 && imageX <= naturalSize.width && imageY >= 0 && imageY <= naturalSize.height) {
        setMarkers((current) => [
          ...current,
          { id: nextMarkerIdRef.current++, x: imageX, y: imageY, contentId: null }
        ]);
      }
    }

    dragStateRef.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleSaveMarkerContent = () => {
    if (activeMarkerId === null || !selectedContentId) {
      return;
    }

    setMarkers((current) =>
      current.map((marker) =>
        marker.id === activeMarkerId
          ? {
              ...marker,
              contentId: selectedContentId
            }
          : marker
      )
    );
    closeMarkerDialog();
  };

  const handleRemoveAssignment = () => {
    if (activeMarkerId === null) {
      return;
    }

    setMarkers((current) =>
      current.map((marker) =>
        marker.id === activeMarkerId
          ? {
              ...marker,
              contentId: null
            }
          : marker
      )
    );
    closeMarkerDialog();
  };

  const handleDeleteMarker = () => {
    if (activeMarkerId === null) {
      return;
    }

    setMarkers((current) => current.filter((marker) => marker.id !== activeMarkerId));
    closeMarkerDialog();
  };

  const imageCardStyle = naturalSize.width
    ? ({
        width: `${naturalSize.width + IMAGE_FRAME_EXTRA}px`,
        height: `${naturalSize.height + IMAGE_FRAME_EXTRA}px`,
        transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
        transformOrigin: 'top left'
      } as CSSProperties)
    : undefined;

  return (
    <>
      <div
        ref={viewportRef}
        className={`exhibition-map-viewer ${dragging ? 'dragging' : ''}`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div className="exhibition-map-surface">
          <div className="exhibition-map-center">
            <div className="exhibition-map-card" style={imageCardStyle}>
              <img
                className="exhibition-stage-image"
                src={imageSrc}
                alt={imageAlt}
                draggable={false}
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight } = event.currentTarget;
                  initializedRef.current = false;
                  setNaturalSize({ width: naturalWidth, height: naturalHeight });
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                  setMarkers([]);
                  setActiveMarkerId(null);
                }}
              />
            </div>
          </div>

          <div className="exhibition-marker-layer">
            {markers.map((marker) => {
              const assignedContent = marker.contentId ? contentLookup.get(marker.contentId) ?? null : null;
              const assignedPlant = assignedContent ? plantLookup.get(assignedContent.settings.plantId) ?? null : null;

              return (
                <div
                  key={marker.id}
                  className={`exhibition-marker-item ${assignedContent ? 'assigned' : ''}`}
                  style={
                    {
                      left: `${pan.x + (marker.x + IMAGE_FRAME_PADDING) * zoom}px`,
                      top: `${pan.y + (marker.y + IMAGE_FRAME_PADDING) * zoom}px`
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    className={`exhibition-marker-mini-card ${assignedContent ? 'assigned' : 'empty'}`}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      openMarkerDialog(marker.id);
                    }}
                  >
                    {assignedContent ? (
                      <>
                        <strong>{assignedContent.title}</strong>
                        <span>{assignedPlant?.koreanName ?? assignedContent.settings.plantId}</span>
                        <span>{templateLabels[assignedContent.settings.template] ?? assignedContent.settings.template}</span>
                      </>
                    ) : (
                      <>
                        <strong>컨텐츠 설정 없음</strong>
                        <span>이 마커에 배치할 콘텐츠를 선택해 주세요.</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="exhibition-marker"
                    aria-label={assignedContent ? `${assignedContent.title} 마커 설정` : '새 마커 설정'}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      openMarkerDialog(marker.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="exhibition-map-hud">
          <span>{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {activeMarker ? (
        <div className="marker-dialog-scrim" role="presentation" onClick={closeMarkerDialog}>
          <div
            className="marker-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="marker-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="marker-dialog-header">
              <div>
                <p className="eyebrow">Marker Content</p>
                <h2 id="marker-dialog-title">마커 컨텐츠 설정</h2>
              </div>
              <button type="button" className="secondary-button" onClick={closeMarkerDialog}>
                닫기
              </button>
            </div>

            <div className="marker-dialog-body">
              {contents.length === 0 ? (
                <div className="marker-dialog-empty">
                  <strong>배치할 콘텐츠가 아직 없습니다.</strong>
                  <span>먼저 콘텐츠를 생성한 뒤 이 위치에 다시 배치해 주세요.</span>
                </div>
              ) : (
                <div className="marker-content-list" role="list">
                  {contents.map((content) => {
                    const plant = plantLookup.get(content.settings.plantId) ?? null;
                    const selected = selectedContentId === content.id;

                    return (
                      <button
                        key={content.id}
                        type="button"
                        role="listitem"
                        className={`marker-content-option ${selected ? 'selected' : ''}`}
                        onClick={() => setSelectedContentId(content.id)}
                      >
                        <strong>{content.title}</strong>
                        <span>{plant?.koreanName ?? content.settings.plantId}</span>
                        <span>{templateLabels[content.settings.template] ?? content.settings.template}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="marker-dialog-actions">
              <div className="marker-dialog-actions-left">
                <button type="button" className="danger-button" onClick={handleDeleteMarker}>
                  마커 삭제
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleRemoveAssignment}
                  disabled={!activeMarker.contentId}
                >
                  배치 해제
                </button>
              </div>
              <button
                type="button"
                className="primary-button"
                onClick={handleSaveMarkerContent}
                disabled={!selectedContentId}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
