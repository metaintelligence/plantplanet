import { spawn } from 'node:child_process';
import path from 'node:path';

export interface LayoutGenerationPayload {
  jobId: string;
  contentId: string;
  settingsJson: string;
  settings?: unknown;
}

export interface LayoutRevisionPayload {
  jobId: string;
  contentId: string;
  revisionPrompt: string;
  content?: unknown;
  settings?: unknown;
}

export interface LayoutGenerationResult {
  logs: string[];
}

interface RunOptions {
  rootDir: string;
  onProgress?: (message: string) => void;
}

const LAYOUT_GENERATION_TIMEOUT_MS = Number(process.env.LAYOUT_GENERATION_TIMEOUT_MS ?? 20 * 60 * 1000);
let activeJobId: string | null = null;

export async function runLayoutGenerationCli(
  payload: LayoutGenerationPayload,
  { rootDir, onProgress }: RunOptions
): Promise<LayoutGenerationResult> {
  return runLayoutCliScript('generate-layout-page.ts', payload, {
    rootDir,
    onProgress,
    startMessage: 'Codex CLI 레이아웃 생성 스크립트를 실행합니다.'
  });
}

export async function runLayoutRevisionCli(
  payload: LayoutRevisionPayload,
  { rootDir, onProgress }: RunOptions
): Promise<LayoutGenerationResult> {
  return runLayoutCliScript('revise-layout-page.ts', payload, {
    rootDir,
    onProgress,
    startMessage: 'Codex CLI 레이아웃 수정 스크립트를 실행합니다.'
  });
}

async function runLayoutCliScript(
  scriptFileName: string,
  payload: LayoutGenerationPayload | LayoutRevisionPayload,
  {
    rootDir,
    onProgress,
    startMessage
  }: RunOptions & {
    startMessage: string;
  }
): Promise<LayoutGenerationResult> {
  if (activeJobId) {
    throw new Error(`다른 생성 작업이 이미 실행 중입니다: ${activeJobId}`);
  }

  activeJobId = payload.jobId;
  const logs: string[] = [];

  try {
    const scriptPath = path.join(rootDir, 'scripts', scriptFileName);
    const tsxCliPath = path.join(rootDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');
    const inputPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
    const deadline = Date.now() + LAYOUT_GENERATION_TIMEOUT_MS;

    onProgress?.(startMessage);
    await runCommand(
      process.execPath,
      [tsxCliPath, scriptPath, '--input-base64', inputPayload],
      rootDir,
      logs,
      onProgress,
      { timeoutMs: remainingTimeout(deadline) }
    );

    onProgress?.('생성된 React 파일로 프론트엔드 빌드를 검증합니다.');
    await runCommand(npmCommand(), ['run', 'build', '-w', 'frontend'], rootDir, logs, onProgress, {
      shell: process.platform === 'win32',
      timeoutMs: remainingTimeout(deadline)
    });
    onProgress?.('프론트엔드 빌드가 완료되어 서버 정적 파일이 갱신되었습니다.');

    return { logs };
  } finally {
    activeJobId = null;
  }
}

function runCommand(
  command: string,
  args: string[],
  cwd: string,
  logs: string[],
  onProgress?: (message: string) => void,
  options: { shell?: boolean; timeoutMs?: number } = {}
) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: options.shell ?? false
    });
    const timeout = options.timeoutMs
      ? setTimeout(() => {
          child.kill();
          reject(new Error(`${command} ${args.join(' ')} timed out after ${options.timeoutMs}ms`));
        }, options.timeoutMs)
      : null;

    const handleChunk = (chunk: Buffer, prefix = '') => {
      chunk
        .toString('utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line) => {
          const message = `${prefix}${line}`;
          logs.push(message);
          onProgress?.(message);
        });
    };

    child.stdout.on('data', (chunk: Buffer) => handleChunk(chunk));
    child.stderr.on('data', (chunk: Buffer) => handleChunk(chunk, 'stderr: '));
    child.on('error', (error) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      reject(error);
    });
    child.on('close', (code) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`));
    });
  });
}

function remainingTimeout(deadline: number) {
  const remaining = deadline - Date.now();
  if (remaining <= 0) {
    throw new Error(`Layout generation timed out after ${LAYOUT_GENERATION_TIMEOUT_MS}ms`);
  }
  return remaining;
}

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}
