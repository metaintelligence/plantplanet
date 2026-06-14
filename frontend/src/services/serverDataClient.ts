import type { ContentStatus, GeneratedContent } from '../types/content';
import type { LayoutGenerationJob } from '../types/generationJob';

export async function fetchContents() {
  return requestJson<GeneratedContent[]>('/api/contents');
}

export async function saveContentToServer(content: GeneratedContent) {
  return requestJson<GeneratedContent[]>(`/api/contents/${encodeURIComponent(content.id)}`, {
    method: 'PUT',
    body: JSON.stringify(content)
  });
}

export async function updateContentStatus(contentId: string, status: ContentStatus) {
  return requestJson<GeneratedContent[]>(`/api/contents/${encodeURIComponent(contentId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status
    })
  });
}

export async function deleteContentFromServer(contentId: string) {
  return requestJson<GeneratedContent[]>(`/api/contents/${encodeURIComponent(contentId)}`, {
    method: 'DELETE'
  });
}

export async function fetchGenerationJobs() {
  return requestJson<LayoutGenerationJob[]>('/api/generation-jobs');
}

async function requestJson<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers
    }
  });

  if (!response.ok) {
    const error = await readError(response);
    throw new Error(error);
  }

  return (await response.json()) as T;
}

async function readError(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message ?? `요청에 실패했습니다. (${response.status})`;
  } catch {
    return `요청에 실패했습니다. (${response.status})`;
  }
}
