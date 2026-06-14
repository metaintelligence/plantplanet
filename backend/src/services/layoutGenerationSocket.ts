import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, Server } from 'node:http';
import { WebSocket, WebSocketServer, type RawData } from 'ws';
import { z } from 'zod';
import {
  createFileDataStore,
  type GeneratedContentRecord,
  type LayoutGenerationJobRecord
} from './fileDataStore.js';
import { runLayoutGenerationCli } from './layoutCliRunner.js';

const generatedContentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  status: z.enum(['draft', 'published']),
  createdAt: z.string(),
  updatedAt: z.string(),
  settings: z.unknown(),
  settingsJson: z.string(),
  routePath: z.string(),
  sections: z.array(z.unknown())
});

const layoutGenerationMessageSchema = z.object({
  type: z.literal('generate-layout'),
  payload: z.object({
    settingsJsonArray: z.array(z.string()).min(1),
    settings: z.unknown().optional(),
    content: generatedContentSchema.optional(),
    contentId: z.string().optional(),
    contentTitle: z.string().optional(),
    plantName: z.string().optional(),
    template: z.string().optional(),
    routePath: z.string().optional(),
    requestedAt: z.string().optional()
  })
});

type SocketMessage = z.infer<typeof layoutGenerationMessageSchema>;

interface LayoutSocketOptions {
  rootDir: string;
}

export function attachLayoutGenerationSocket(server: Server, { rootDir }: LayoutSocketOptions) {
  const jobsDir = path.join(rootDir, 'generated', 'layout-jobs');
  const store = createFileDataStore(rootDir);
  const wss = new WebSocketServer({ server, path: '/ws/generate' });

  wss.on('connection', (socket, request) => {
    send(socket, {
      type: 'connected',
      message: 'HanGarden 레이아웃 생성 소켓에 연결되었습니다.'
    });

    socket.on('message', async (raw) => {
      let jobId: string | null = null;
      try {
        const parsed = parseSocketMessage(raw);
        jobId = parsed.payload.contentId ?? parsed.payload.content?.id ?? `layout-${randomUUID()}`;
        const content = parsed.payload.content;

        send(socket, {
          type: 'progress',
          jobId,
          message: '생성 설정 JSON을 수신했습니다.'
        });

        if (content) {
          await store.upsertContent(content as GeneratedContentRecord);
          send(socket, {
            type: 'progress',
            jobId,
            message: '콘텐츠 메타데이터를 서버 파일에 저장했습니다.'
          });
        }

        await store.upsertJob(buildGenerationJob(jobId, parsed));
        send(socket, {
          type: 'started',
          jobId,
          message: '서버 파일 기준 생성 작업이 시작되었습니다.'
        });

        await fs.mkdir(jobsDir, { recursive: true });
        await fs.writeFile(
          path.join(jobsDir, `${jobId}.json`),
          `${JSON.stringify(buildJobRecord(jobId, parsed, request), null, 2)}\n`,
          'utf8'
        );

        send(socket, {
          type: 'progress',
          jobId,
          message: '로컬 서버에 생성 작업 파일을 저장했습니다.'
        });

        await runLayoutGenerationCli(
          {
            jobId,
            contentId: parsed.payload.contentId ?? jobId,
            settingsJsonArray: parsed.payload.settingsJsonArray,
            settings: parsed.payload.settings
          },
          {
            rootDir,
            onProgress: (message) => {
              void store
                .patchJob(jobId!, {
                  status: 'running',
                  message
                })
                .catch(() => undefined);
              send(socket, {
                type: 'progress',
                jobId,
                message
              });
            }
          }
        );

        await store.patchJob(jobId, {
          status: 'completed',
          message: 'CLI 페이지 생성과 프론트엔드 빌드가 완료되었습니다.',
          completedAt: new Date().toISOString()
        });
        send(socket, {
          type: 'ack',
          jobId,
          message: 'CLI 페이지 생성과 프론트엔드 빌드가 완료되었습니다.'
        });
      } catch (error) {
        if (jobId) {
          await store
            .patchJob(jobId, {
              status: error instanceof Error && error.message.includes('timed out') ? 'timeout' : 'failed',
              message: error instanceof Error ? error.message : 'WebSocket message handling failed.'
            })
            .catch(() => undefined);
        }
        send(socket, {
          type: 'error',
          message: error instanceof Error ? error.message : 'WebSocket message handling failed.'
        });
      }
    });
  });

  return wss;
}

function parseSocketMessage(raw: RawData): SocketMessage {
  const text = rawDataToText(raw);
  const json = JSON.parse(text);
  const parsed = layoutGenerationMessageSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error('WebSocket 메시지 형식이 올바르지 않습니다.');
  }

  return parsed.data;
}

function rawDataToText(raw: RawData) {
  if (Buffer.isBuffer(raw)) {
    return raw.toString('utf8');
  }
  if (raw instanceof ArrayBuffer) {
    return Buffer.from(raw).toString('utf8');
  }
  if (Array.isArray(raw)) {
    return Buffer.concat(raw).toString('utf8');
  }
  return String(raw);
}

function buildJobRecord(jobId: string, message: SocketMessage, request: IncomingMessage) {
  return {
    jobId,
    receivedAt: new Date().toISOString(),
    remoteAddress: request.socket.remoteAddress,
    payload: message.payload
  };
}

function buildGenerationJob(jobId: string, message: SocketMessage): LayoutGenerationJobRecord {
  const now = new Date().toISOString();
  const content = message.payload.content;

  return {
    id: jobId,
    contentId: message.payload.contentId ?? content?.id ?? jobId,
    contentTitle: message.payload.contentTitle ?? content?.title ?? jobId,
    plantName: message.payload.plantName ?? readPlantId(content?.settings) ?? 'unknown',
    template: message.payload.template ?? readTemplate(content?.settings) ?? 'unknown',
    routePath: (message.payload.routePath ?? content?.routePath ?? `#/content/${jobId}`).replace(/^#/, ''),
    status: 'running',
    message: '백그라운드에서 페이지 생성 작업이 시작되었습니다.',
    createdAt: now,
    updatedAt: now
  };
}

function readPlantId(settings: unknown) {
  return typeof settings === 'object' && settings && 'plantId' in settings ? String(settings.plantId) : null;
}

function readTemplate(settings: unknown) {
  return typeof settings === 'object' && settings && 'template' in settings ? String(settings.template) : null;
}

function send(socket: WebSocket, payload: Record<string, unknown>) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}
