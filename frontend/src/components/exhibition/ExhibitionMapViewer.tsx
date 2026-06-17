import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import { templateLabelMap } from '../../data/contentOptions';
import { exhibitionViewerConfig, exhibitionViewerText } from '../../data/exhibitionViewer';
import type { GeneratedContent, PlantRecord } from '../../types/content';
import MarkerContentDialog from './MarkerContentDialog';
import { readMarkersFromCookie, writeMarkersToCookie } from './storage';
import type { Marker, Point } from './types';

interface ExhibitionMapViewerProps {
  siteId: string;
  imageSrc: string;
  imageAlt: string;
  contents: GeneratedContent[];
  plants: PlantRecord[];
}

export default function ExhibitionMapViewer({
  siteId,
  imageSrc,
  imageAlt,
  contents,
  plants
}: ExhibitionMapViewerProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ pointerId: number; start: Point; origin: Point } | null>(null);
  const markerDragRef = useRef<{ pointerId: number; markerId: number; moved: boolean } | null>(null);
  const skipNextMarkerPersistRef = useRef(true);
  const nextMarkerIdRef = useRef(1);
  const initializedRef = useRef(false);

  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [dragging, setDragging] = useState(false);
  const [draggedMarkerId, setDraggedMarkerId] = useState<number | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const contentLookup = useMemo(() => new Map(contents.map((content) => [content.id, content])), [contents]);
  const plantLookup = useMemo(() => new Map(plants.map((plant) => [plant.id, plant])), [plants]);
  const activeMarker = useMemo(
    () => markers.find((marker) => marker.id === activeMarkerId) ?? null,
    [activeMarkerId, markers]
  );
  const activeMarkerContent = useMemo(
    () => (activeMarker?.contentId ? contentLookup.get(activeMarker.contentId) ?? null : null),
    [activeMarker?.contentId, contentLookup]
  );

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

  useEffect(() => {
    skipNextMarkerPersistRef.current = true;
    const storedMarkers = readMarkersFromCookie(siteId);
    nextMarkerIdRef.current = storedMarkers.reduce((maxId, marker) => Math.max(maxId, marker.id), 0) + 1;
    setMarkers(storedMarkers);
    setActiveMarkerId(null);
    setSelectedContentId(null);
  }, [siteId]);

  useEffect(() => {
    if (skipNextMarkerPersistRef.current) {
      skipNextMarkerPersistRef.current = false;
      return;
    }

    writeMarkersToCookie(siteId, markers);
  }, [markers, siteId]);

  useEffect(() => {
    setSelectedContentId(activeMarkerContent?.id ?? null);
  }, [activeMarkerContent?.id]);

  useEffect(() => {
    const validContentIds = new Set(contents.map((content) => content.id));

    setMarkers((current) => {
      let didChange = false;
      const next = current.map((marker) => {
        if (marker.contentId && !validContentIds.has(marker.contentId)) {
          didChange = true;
          return { ...marker, contentId: null };
        }

        return marker;
      });

      return didChange ? next : current;
    });
  }, [contents]);

  const getRenderedSize = (nextZoom = zoom) => ({
    width: naturalSize.width * nextZoom + exhibitionViewerConfig.imageFrameExtra,
    height: naturalSize.height * nextZoom + exhibitionViewerConfig.imageFrameExtra
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
    if (draggedMarkerId !== null || !naturalSize.width || !naturalSize.height) {
      return;
    }

    event.preventDefault();

    const nextZoom = Math.min(
      exhibitionViewerConfig.maxZoom,
      Math.max(
        exhibitionViewerConfig.minZoom,
        zoom * (event.deltaY < 0 ? exhibitionViewerConfig.zoomInFactor : exhibitionViewerConfig.zoomOutFactor)
      )
    );

    if (nextZoom === zoom) {
      return;
    }

    const { width: currentWidth, height: currentHeight } = getRenderedSize(zoom);
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;
    const normalizedX = (centerX - pan.x) / currentWidth;
    const normalizedY = (centerY - pan.y) / currentHeight;
    const nextWidth = naturalSize.width * nextZoom + exhibitionViewerConfig.imageFrameExtra;
    const nextHeight = naturalSize.height * nextZoom + exhibitionViewerConfig.imageFrameExtra;
    const nextPan = {
      x: centerX - normalizedX * nextWidth,
      y: centerY - normalizedY * nextHeight
    };

    setZoom(nextZoom);
    setPan(clampPan(nextPan, nextZoom));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (draggedMarkerId !== null || !naturalSize.width || !naturalSize.height) {
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
    if (draggedMarkerId !== null) {
      return;
    }

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
    if (draggedMarkerId !== null) {
      return;
    }

    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const viewport = viewportRef.current;
    const deltaX = event.clientX - dragState.start.x;
    const deltaY = event.clientY - dragState.start.y;
    const moved = Math.hypot(deltaX, deltaY) > exhibitionViewerConfig.clickDistanceThreshold;

    if (!moved && viewport && naturalSize.width && naturalSize.height) {
      const rect = viewport.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const imageFramePadding = exhibitionViewerConfig.imageFrameExtra / 2;
      const markerCreationGuardRadius = exhibitionViewerConfig.markerRadius * 2;

      const nearbyMarker = markers.find((marker) => {
        const markerScreenX = pan.x + (marker.x + imageFramePadding) * zoom;
        const markerScreenY = pan.y + (marker.y + imageFramePadding) * zoom;

        return Math.hypot(localX - markerScreenX, localY - markerScreenY) <= markerCreationGuardRadius;
      });

      if (nearbyMarker) {
        openMarkerDialog(nearbyMarker.id);
        dragStateRef.current = null;
        setDragging(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }

      const imageX = (localX - pan.x) / zoom - imageFramePadding;
      const imageY = (localY - pan.y) / zoom - imageFramePadding;

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

  const clampMarkerCoordinates = (imageX: number, imageY: number) => ({
    x: Math.min(naturalSize.width, Math.max(0, imageX)),
    y: Math.min(naturalSize.height, Math.max(0, imageY))
  });

  const updateMarkerPositionFromPointer = (markerId: number, clientX: number, clientY: number) => {
    const viewport = viewportRef.current;
    if (!viewport || !naturalSize.width || !naturalSize.height) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    const imageFramePadding = exhibitionViewerConfig.imageFrameExtra / 2;
    const nextPosition = clampMarkerCoordinates((localX - pan.x) / zoom - imageFramePadding, (localY - pan.y) / zoom - imageFramePadding);

    setMarkers((current) =>
      current.map((marker) => (marker.id === markerId ? { ...marker, ...nextPosition } : marker))
    );
  };

  const handleMarkerPointerDown = (markerId: number, event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    markerDragRef.current = {
      pointerId: event.pointerId,
      markerId,
      moved: false
    };
    setDraggedMarkerId(markerId);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleMarkerPointerMove = (markerId: number, event: ReactPointerEvent<HTMLElement>) => {
    const markerDrag = markerDragRef.current;
    if (!markerDrag || markerDrag.pointerId !== event.pointerId || markerDrag.markerId !== markerId) {
      return;
    }

    markerDrag.moved = true;
    updateMarkerPositionFromPointer(markerId, event.clientX, event.clientY);
  };

  const handleMarkerPointerUp = (markerId: number, event: ReactPointerEvent<HTMLElement>) => {
    const markerDrag = markerDragRef.current;
    if (!markerDrag || markerDrag.pointerId !== event.pointerId || markerDrag.markerId !== markerId) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    updateMarkerPositionFromPointer(markerId, event.clientX, event.clientY);

    if (!markerDrag.moved) {
      openMarkerDialog(markerId);
    }

    markerDragRef.current = null;
    setDraggedMarkerId(null);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleMarkerPointerCancel = (markerId: number, event: ReactPointerEvent<HTMLElement>) => {
    const markerDrag = markerDragRef.current;
    if (!markerDrag || markerDrag.pointerId !== event.pointerId || markerDrag.markerId !== markerId) {
      return;
    }

    markerDragRef.current = null;
    setDraggedMarkerId(null);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleSaveMarkerContent = () => {
    if (activeMarkerId === null || !selectedContentId) {
      return;
    }

    setMarkers((current) =>
      current.map((marker) => (marker.id === activeMarkerId ? { ...marker, contentId: selectedContentId } : marker))
    );
    closeMarkerDialog();
  };

  const handleRemoveAssignment = () => {
    if (activeMarkerId === null) {
      return;
    }

    setMarkers((current) =>
      current.map((marker) => (marker.id === activeMarkerId ? { ...marker, contentId: null } : marker))
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
        width: `${naturalSize.width + exhibitionViewerConfig.imageFrameExtra}px`,
        height: `${naturalSize.height + exhibitionViewerConfig.imageFrameExtra}px`,
        transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
        transformOrigin: 'top left'
      } as CSSProperties)
    : undefined;

  const imageFramePadding = exhibitionViewerConfig.imageFrameExtra / 2;

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
                  className={`exhibition-marker-item ${assignedContent ? 'assigned' : ''} ${
                    draggedMarkerId === marker.id ? 'dragging' : ''
                  }`}
                  style={
                    {
                      left: `${pan.x + (marker.x + imageFramePadding) * zoom}px`,
                      top: `${pan.y + (marker.y + imageFramePadding) * zoom}px`
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    className={`exhibition-marker-mini-card ${assignedContent ? 'assigned' : 'empty'}`}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      openMarkerDialog(marker.id);
                    }}
                  >
                    {assignedContent ? (
                      <>
                        <strong>{assignedContent.title}</strong>
                        <span>{assignedPlant?.koreanName ?? assignedContent.settings.plantId}</span>
                        <span>{templateLabelMap[assignedContent.settings.template] ?? assignedContent.settings.template}</span>
                      </>
                    ) : (
                      <>
                        <strong>{exhibitionViewerText.markerDialog.emptyCardTitle}</strong>
                        <span>{exhibitionViewerText.markerDialog.emptyCardDescription}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="exhibition-marker"
                    aria-label={
                      assignedContent
                        ? exhibitionViewerText.markerDialog.assignedMarkerAria(assignedContent.title)
                        : exhibitionViewerText.markerDialog.emptyMarkerAria
                    }
                    onPointerDown={(event) => handleMarkerPointerDown(marker.id, event)}
                    onPointerMove={(event) => handleMarkerPointerMove(marker.id, event)}
                    onPointerUp={(event) => handleMarkerPointerUp(marker.id, event)}
                    onPointerCancel={(event) => handleMarkerPointerCancel(marker.id, event)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="exhibition-map-hud">
          <span>{exhibitionViewerText.zoomLabel(zoom)}</span>
        </div>
      </div>

      <MarkerContentDialog
        activeMarker={activeMarker}
        contents={contents}
        plantLookup={plantLookup}
        selectedContentId={selectedContentId}
        onSelectContent={setSelectedContentId}
        onSave={handleSaveMarkerContent}
        onRemoveAssignment={handleRemoveAssignment}
        onDeleteMarker={handleDeleteMarker}
        onClose={closeMarkerDialog}
      />
    </>
  );
}
