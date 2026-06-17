import { exhibitionViewerConfig } from '../../data/exhibitionViewer';
import type { Marker } from './types';

function getMarkerCookieName(siteId: string) {
  return `hangarden_markers_${siteId}`;
}

export function readMarkersFromCookie(siteId: string): Marker[] {
  if (typeof document === 'undefined') {
    return [];
  }

  const cookieName = getMarkerCookieName(siteId);
  const cookieEntry = document.cookie.split('; ').find((entry) => entry.startsWith(`${cookieName}=`));

  if (!cookieEntry) {
    return [];
  }

  try {
    const rawValue = decodeURIComponent(cookieEntry.slice(cookieName.length + 1));
    const parsed = JSON.parse(rawValue) as Array<Partial<Marker>>;

    return parsed.flatMap((marker) => {
      if (typeof marker.id !== 'number' || typeof marker.x !== 'number' || typeof marker.y !== 'number') {
        return [];
      }

      return [
        {
          id: marker.id,
          x: marker.x,
          y: marker.y,
          contentId: typeof marker.contentId === 'string' ? marker.contentId : null
        }
      ];
    });
  } catch {
    return [];
  }
}

export function writeMarkersToCookie(siteId: string, markers: Marker[]) {
  if (typeof document === 'undefined') {
    return;
  }

  const cookieName = getMarkerCookieName(siteId);
  const serialized = encodeURIComponent(
    JSON.stringify(
      markers.map((marker) => ({
        id: marker.id,
        x: marker.x,
        y: marker.y,
        contentId: marker.contentId
      }))
    )
  );

  document.cookie = `${cookieName}=${serialized}; path=/; max-age=${exhibitionViewerConfig.cookieMaxAgeSeconds}; samesite=lax`;
}
