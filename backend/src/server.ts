import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContentDataRouter } from './routes/contentData.js';
import { attachLayoutGenerationSocket } from './services/layoutGenerationSocket.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? '0.0.0.0';
const serverDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(serverDir, '..', '..');
const frontendDistDir = path.join(rootDir, 'frontend', 'dist');
const frontendIndexPath = path.join(frontendDistDir, 'index.html');
const accessLogDir = path.join(rootDir, 'backend', 'logs');
const accessLogPath = path.join(accessLogDir, 'review-access.ndjson');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use((request, _response, next) => {
  const requestPath = request.originalUrl || request.path;
  const isPageVisit =
    request.method === 'GET' &&
    !requestPath.startsWith('/api/health') &&
    !requestPath.startsWith('/ws/') &&
    !/\.(css|js|map|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf)$/i.test(requestPath);

  if (!isPageVisit) {
    next();
    return;
  }

  fs.mkdirSync(accessLogDir, { recursive: true });

  const forwardedFor = request.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0];
  const ip = forwardedIp?.trim() || request.socket.remoteAddress || request.ip || 'unknown';
  const logEntry = JSON.stringify({
    time: new Date().toISOString(),
    ip,
    path: requestPath
  });

  fs.appendFile(accessLogPath, `${logEntry}\n`, (error) => {
    if (error) {
      console.error('접속 로그 저장 실패:', error);
    }
  });

  next();
});

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'plantplanet-page-generator',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', createContentDataRouter(rootDir));

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendDistDir));
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api')) {
      next();
      return;
    }
    response.sendFile(frontendIndexPath);
  });
}

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  response.status(500).json({ message });
});

const server = createServer(app);
attachLayoutGenerationSocket(server, { rootDir });

server.listen(port, host, () => {
  console.log(`HanGarden server listening on http://${host}:${port}`);
  console.log('WebSocket endpoint: /ws/generate');
});
