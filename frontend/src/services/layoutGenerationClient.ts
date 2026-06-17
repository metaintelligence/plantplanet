import { appText } from '../data/appText';
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

interface SocketRequestOptions extends SendOptions {
  requestType: 'generate-layout' | 'revise-layout';
  requestPayload: Record<string, unknown>;
  socketOpenMessage: string;
  defaultServerErrorMessage: string;
}

export interface LayoutGenerationRequestHandle {
  jobId: string;
  done: Promise<LayoutGenerationServerMessage>;
  close: () => void;
}

export function startLayoutGenerationRequest(content: GeneratedContent, options: SendOptions = {}) {
  return startLayoutSocketRequest(content.id, {
    ...options,
    requestType: 'generate-layout',
    socketOpenMessage: appText.generation.socketOpenMessage,
    defaultServerErrorMessage: appText.generation.defaultServerErrorMessage,
    requestPayload: {
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
  });
}

export function startLayoutRevisionRequest(
  content: GeneratedContent,
  revisionPrompt: string,
  options: SendOptions = {}
) {
  const jobId = options.jobId ?? `${content.id}-revision-${Date.now().toString(36)}`;

  return startLayoutSocketRequest(jobId, {
    ...options,
    requestType: 'revise-layout',
    jobId,
    socketOpenMessage: appText.revision.socketOpenMessage,
    defaultServerErrorMessage: appText.revision.defaultServerErrorMessage,
    requestPayload: {
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
  });
}

function startLayoutSocketRequest(jobId: string, options: SocketRequestOptions) {
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
      const timeoutError = new Error(appText.socket.timeout);
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
      if (!startResolved) {
        startResolved = true;
        resolve(handle);
      }
    };

    socket.addEventListener('open', () => {
      options.onStatus?.(options.socketOpenMessage);
      socket.send(
        JSON.stringify({
          type: options.requestType,
          payload: options.requestPayload
        })
      );
    });

    socket.addEventListener('message', (event) => {
      const message = parseServerMessage(event.data, options.defaultServerErrorMessage);
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
        const error = new Error(message.message ?? options.defaultServerErrorMessage);
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
      const error = new Error(appText.socket.connectionFailed);
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
      const error = new Error(appText.socket.closedBeforeComplete);
      if (!startResolved) {
        reject(error);
        return;
      }
      failJob(error);
    });
  });
}

function parseServerMessage(data: unknown, defaultMessage: string): LayoutGenerationServerMessage {
  try {
    return JSON.parse(String(data)) as LayoutGenerationServerMessage;
  } catch {
    return {
      type: 'error',
      message: defaultMessage
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
