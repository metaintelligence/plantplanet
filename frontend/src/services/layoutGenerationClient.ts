import type { GeneratedContent } from '../types/content';

export const LAYOUT_GENERATION_TIMEOUT_MS = 20 * 60 * 1000;

export interface LayoutGenerationServerMessage {
  type: 'connected' | 'started' | 'progress' | 'ack' | 'error';
  jobId?: string;
  message?: string;
}

interface SendOptions {
  onStatus?: (message: string) => void;
  plantName?: string;
  jobId?: string;
}

export interface LayoutGenerationRequestHandle {
  jobId: string;
  done: Promise<LayoutGenerationServerMessage>;
  close: () => void;
}

export function startLayoutGenerationRequest(content: GeneratedContent, options: SendOptions = {}) {
  return new Promise<LayoutGenerationRequestHandle>((resolve, reject) => {
    const socket = new WebSocket(resolveWebSocketUrl());
    let startResolved = false;
    let settled = false;
    let completeJob!: (message: LayoutGenerationServerMessage) => void;
    let failJob!: (error: Error) => void;

    const done = new Promise<LayoutGenerationServerMessage>((doneResolve, doneReject) => {
      completeJob = doneResolve;
      failJob = doneReject;
    });

    const timeoutId = window.setTimeout(() => {
      settled = true;
      socket.close();
      const timeoutError = new Error('20분 안에 로컬 생성 서버 완료 응답을 받지 못했습니다.');
      if (!startResolved) {
        reject(timeoutError);
        return;
      }
      failJob(timeoutError);
    }, LAYOUT_GENERATION_TIMEOUT_MS);

    const handle: LayoutGenerationRequestHandle = {
      jobId: content.id,
      done,
      close: () => {
        window.clearTimeout(timeoutId);
        socket.close();
      }
    };

    const resolveStart = () => {
      if (startResolved) {
        return;
      }
      startResolved = true;
      resolve(handle);
    };

    socket.addEventListener('open', () => {
      options.onStatus?.('로컬 생성 서버에 설정 JSON을 전송했습니다.');
      socket.send(
        JSON.stringify({
          type: 'generate-layout',
          payload: {
            contentId: content.id,
            content,
            contentTitle: content.title,
            plantName: options.plantName,
            template: content.settings.template,
            routePath: content.routePath.replace(/^#/, ''),
            settings: content.settings,
            settingsJson: content.settingsJson,
            requestedAt: new Date().toISOString()
          }
        })
      );
    });

    socket.addEventListener('message', (event) => {
      const message = parseServerMessage(event.data);
      if (message.message) {
        options.onStatus?.(message.message);
      }

      if (message.type === 'started' && message.jobId) {
        resolveStart();
      }

      if (message.type === 'ack') {
        window.clearTimeout(timeoutId);
        settled = true;
        socket.close();
        resolveStart();
        completeJob(message);
      }

      if (message.type === 'error') {
        window.clearTimeout(timeoutId);
        settled = true;
        socket.close();
        const error = new Error(message.message ?? '로컬 생성 서버에서 오류가 발생했습니다.');
        if (!startResolved) {
          reject(error);
          return;
        }
        failJob(error);
      }
    });

    socket.addEventListener('error', () => {
      window.clearTimeout(timeoutId);
      settled = true;
      const error = new Error('로컬 생성 서버 WebSocket에 연결하지 못했습니다.');
      if (!startResolved) {
        reject(error);
        return;
      }
      failJob(error);
    });

    socket.addEventListener('close', () => {
      if (settled) {
        return;
      }

      window.clearTimeout(timeoutId);
      const error = new Error('로컬 생성 서버 연결이 작업 완료 전에 종료되었습니다.');
      if (!startResolved) {
        reject(error);
        return;
      }
      failJob(error);
    });
  });
}

export function startLayoutRevisionRequest(
  content: GeneratedContent,
  revisionPrompt: string,
  options: SendOptions = {}
) {
  return new Promise<LayoutGenerationRequestHandle>((resolve, reject) => {
    const jobId = options.jobId ?? `${content.id}-revision-${Date.now().toString(36)}`;
    const socket = new WebSocket(resolveWebSocketUrl());
    let startResolved = false;
    let settled = false;
    let completeJob!: (message: LayoutGenerationServerMessage) => void;
    let failJob!: (error: Error) => void;

    const done = new Promise<LayoutGenerationServerMessage>((doneResolve, doneReject) => {
      completeJob = doneResolve;
      failJob = doneReject;
    });

    const timeoutId = window.setTimeout(() => {
      settled = true;
      socket.close();
      const timeoutError = new Error('20분 안에 로컬 생성 서버 완료 응답을 받지 못했습니다.');
      if (!startResolved) {
        reject(timeoutError);
        return;
      }
      failJob(timeoutError);
    }, LAYOUT_GENERATION_TIMEOUT_MS);

    const handle: LayoutGenerationRequestHandle = {
      jobId,
      done,
      close: () => {
        window.clearTimeout(timeoutId);
        socket.close();
      }
    };

    const resolveStart = () => {
      if (startResolved) {
        return;
      }
      startResolved = true;
      resolve(handle);
    };

    socket.addEventListener('open', () => {
      options.onStatus?.('로컬 생성 서버에 수정 요청을 전송했습니다.');
      socket.send(
        JSON.stringify({
          type: 'revise-layout',
          payload: {
            jobId,
            contentId: content.id,
            content,
            contentTitle: content.title,
            plantName: options.plantName,
            template: content.settings.template,
            routePath: content.routePath.replace(/^#/, ''),
            revisionPrompt,
            settings: content.settings,
            requestedAt: new Date().toISOString()
          }
        })
      );
    });

    socket.addEventListener('message', (event) => {
      const message = parseServerMessage(event.data);
      if (message.message) {
        options.onStatus?.(message.message);
      }

      if (message.type === 'started' && message.jobId) {
        resolveStart();
      }

      if (message.type === 'ack') {
        window.clearTimeout(timeoutId);
        settled = true;
        socket.close();
        resolveStart();
        completeJob(message);
      }

      if (message.type === 'error') {
        window.clearTimeout(timeoutId);
        settled = true;
        socket.close();
        const error = new Error(message.message ?? '로컬 생성 서버에서 오류가 발생했습니다.');
        if (!startResolved) {
          reject(error);
          return;
        }
        failJob(error);
      }
    });

    socket.addEventListener('error', () => {
      window.clearTimeout(timeoutId);
      settled = true;
      const error = new Error('로컬 생성 서버 WebSocket에 연결하지 못했습니다.');
      if (!startResolved) {
        reject(error);
        return;
      }
      failJob(error);
    });

    socket.addEventListener('close', () => {
      if (settled) {
        return;
      }

      window.clearTimeout(timeoutId);
      const error = new Error('로컬 생성 서버 연결이 작업 완료 전에 종료되었습니다.');
      if (!startResolved) {
        reject(error);
        return;
      }
      failJob(error);
    });
  });
}

function parseServerMessage(data: unknown): LayoutGenerationServerMessage {
  try {
    return JSON.parse(String(data)) as LayoutGenerationServerMessage;
  } catch {
    return {
      type: 'error',
      message: '로컬 생성 서버 응답을 해석하지 못했습니다.'
    };
  }
}

function resolveWebSocketUrl() {
  const configuredUrl = import.meta.env.VITE_GENERATOR_WS_URL;
  if (configuredUrl) {
    return configuredUrl;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const { hostname, host, port } = window.location;

  if (import.meta.env.DEV && port === '5173') {
    return `${protocol}//${hostname}:4000/ws/generate`;
  }

  return `${protocol}//${host}/ws/generate`;
}
