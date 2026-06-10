import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GenerateInput } from '../types/generateInput.js';

const backendDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const rootDir = path.resolve(backendDir, '..');
const generatedDir = path.join(rootDir, 'generated');
const outputPath = path.join(generatedDir, 'page-config.json');
const scriptPath = path.join(rootDir, 'scripts', 'generate-page.ts');
const tsxCliPath = path.join(rootDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');

export interface CliResult {
  jobId: string;
  pageConfig: unknown;
  logs: string[];
}

export async function runGeneratePageCli(input: GenerateInput): Promise<CliResult> {
  const jobId = randomUUID();
  await fs.mkdir(generatedDir, { recursive: true });

  const logs: string[] = [`job:${jobId} CLI 실행 준비 완료`];
  const inputPayload = Buffer.from(JSON.stringify({ jobId, input }), 'utf8').toString('base64');

  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [tsxCliPath, scriptPath, '--input-base64', inputPayload], {
      cwd: rootDir,
      env: {
        ...process.env,
        GENERATED_DIR: generatedDir
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data', (chunk: Buffer) => {
      chunk
        .toString('utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line) => logs.push(line));
    });

    child.stderr.on('data', (chunk: Buffer) => {
      chunk
        .toString('utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line) => logs.push(`stderr: ${line}`));
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`generate-page CLI failed with exit code ${code}`));
    });
  });

  const pageConfig = JSON.parse(await fs.readFile(outputPath, 'utf8'));
  logs.push(`page-config.json 저장 완료: ${path.relative(rootDir, outputPath)}`);

  return {
    jobId,
    pageConfig,
    logs
  };
}

export async function readLatestPageConfig() {
  try {
    const content = await fs.readFile(outputPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}
