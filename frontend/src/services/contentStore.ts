import type { GeneratedContent } from '../types/content';

export interface ContentStore {
  list: () => GeneratedContent[];
  get: (id: string) => GeneratedContent | null;
  save: (content: GeneratedContent) => GeneratedContent[];
  remove: (id: string) => GeneratedContent[];
  clear: () => GeneratedContent[];
}

const COOKIE_NAME = 'hangarden_contents_v1';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const COOKIE_SOFT_LIMIT = 3800;

const isBrowser = () => typeof document !== 'undefined';

function readCookieValue() {
  if (!isBrowser()) {
    return '';
  }

  return (
    document.cookie
      .split('; ')
      .find((item) => item.startsWith(`${COOKIE_NAME}=`))
      ?.split('=')
      .slice(1)
      .join('=') ?? ''
  );
}

function readContents(): GeneratedContent[] {
  const raw = readCookieValue();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistContents(contents: GeneratedContent[]) {
  if (!isBrowser()) {
    return [];
  }

  let compacted = [...contents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  let encoded = encodeURIComponent(JSON.stringify(compacted));

  while (encoded.length > COOKIE_SOFT_LIMIT && compacted.length > 1) {
    compacted = compacted.slice(0, -1);
    encoded = encodeURIComponent(JSON.stringify(compacted));
  }

  document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  return compacted;
}

export const cookieContentStore: ContentStore = {
  list: () => readContents().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  get: (id) => readContents().find((content) => content.id === id) ?? null,
  save: (content) => {
    const current = readContents();
    const next = [content, ...current.filter((item) => item.id !== content.id)];
    return persistContents(next);
  },
  remove: (id) => persistContents(readContents().filter((content) => content.id !== id)),
  clear: () => persistContents([])
};
