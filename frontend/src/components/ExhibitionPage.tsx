import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import { exhibitionSites } from './AppShell';

const exhibitionImageBySiteId: Record<string, string> = {
  baekdudaegan: `${import.meta.env.BASE_URL}images/baekdu.jpg`,
  sejong: `${import.meta.env.BASE_URL}images/sejong.jpg`,
  'native-plants': `${import.meta.env.BASE_URL}images/korea.jpg`,
  'garden-culture': `${import.meta.env.BASE_URL}images/garden.jpg`
};

type Point = {
  x: number;
  y: number;
};

export default function ExhibitionPage({ siteId }: { siteId: string }) {
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
          <ExhibitionMapViewer imageSrc={imageSrc} imageAlt={site?.name ?? '전시공간 도식'} />
        ) : (
          <div className="blank-exhibition-canvas" />
        )}
      </section>
    </div>
  );
}

function ExhibitionMapViewer({ imageSrc, imageAlt }: { imageSrc: string; imageAlt: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStateRef = useRef<{ pointerId: number; start: Point; origin: Point } | null>(null);
  const initializedRef = useRef(false);
  const IMAGE_FRAME_EXTRA = 2;

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

  const displaySize = useMemo(
    () => ({
      width: naturalSize.width * zoom,
      height: naturalSize.height * zoom
    }),
    [naturalSize.height, naturalSize.width, zoom]
  );

  const getRenderedSize = (nextZoom = zoom) => {
    return {
      width: naturalSize.width * nextZoom + IMAGE_FRAME_EXTRA,
      height: naturalSize.height * nextZoom + IMAGE_FRAME_EXTRA
    };
  };

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
    const currentLeft = pan.x;
    const currentTop = pan.y;
    const normalizedX = (centerX - currentLeft) / currentWidth;
    const normalizedY = (centerY - currentTop) / currentHeight;

    const nextWidth = naturalSize.width * nextZoom + IMAGE_FRAME_EXTRA;
    const nextHeight = naturalSize.height * nextZoom + IMAGE_FRAME_EXTRA;
    const nextLeft = centerX - normalizedX * nextWidth;
    const nextTop = centerY - normalizedY * nextHeight;
    const nextPan = { x: nextLeft, y: nextTop };

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

    dragStateRef.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
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
              }}
            />
          </div>
        </div>
      </div>

      <div className="exhibition-map-hud">
        <span>{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
