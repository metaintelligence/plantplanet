import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

interface ReviseLayoutPayload {
  jobId: string;
  contentId: string;
  revisionPrompt: string;
  content?: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

interface ManifestEntry {
  contentId: string;
  componentName: string;
  fileName: string;
  template: string;
  updatedAt: string;
}

const rootDir = process.cwd();
const generatedDir = path.join(rootDir, 'frontend', 'src', 'generated');
const layoutsDir = path.join(generatedDir, 'layouts');
const manifestPath = path.join(generatedDir, 'layout-manifest.json');
const defaultPromptPath = path.join(rootDir, 'scripts', 'prompts', 'revise-layout-page.prompt.md');
const displayPromptsDir = path.join(rootDir, 'scripts', 'prompts', 'displays');

async function main() {
  const payload = readPayload();
  const manifest = await readManifest();
  const entry = manifest.find((item) => item.contentId === payload.contentId);

  if (!entry) {
    throw new Error(`생성형AI 레이아웃 파일을 찾을 수 없습니다: ${payload.contentId}`);
  }

  const targetPath = path.join(layoutsDir, entry.fileName);
  const targetRelativePath = toPosixPath(path.relative(rootDir, targetPath));
  const currentSource = await fs.readFile(targetPath, 'utf8');
  const prompt = await buildCodexPrompt({
    componentName: entry.componentName,
    targetRelativePath,
    currentSource,
    payload
  });

  console.log('revise-layout: invoking Codex CLI');
  await runCodexExec(prompt);
  await validateGeneratedComponent(targetPath, entry.componentName);

  const nextManifest = manifest.map((item) =>
    item.contentId === payload.contentId
      ? {
          ...item,
          updatedAt: new Date().toISOString()
        }
      : item
  );
  await fs.writeFile(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`, 'utf8');

  console.log(`revise-layout: updated ${targetRelativePath}`);
}

function readPayload(): ReviseLayoutPayload {
  const markerIndex = process.argv.indexOf('--input-base64');
  const encoded = markerIndex >= 0 ? process.argv[markerIndex + 1] : '';
  if (!encoded) {
    throw new Error('Missing --input-base64 payload');
  }
  return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as ReviseLayoutPayload;
}

async function readManifest(): Promise<ManifestEntry[]> {
  try {
    const content = await fs.readFile(manifestPath, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function buildCodexPrompt({
  componentName,
  targetRelativePath,
  currentSource,
  payload
}: {
  componentName: string;
  targetRelativePath: string;
  currentSource: string;
  payload: ReviseLayoutPayload;
}) {
  const promptTemplatePath = process.env.CODEX_LAYOUT_REVISION_PROMPT_PATH
    ? path.resolve(rootDir, process.env.CODEX_LAYOUT_REVISION_PROMPT_PATH)
    : defaultPromptPath;
  const templateContent = await fs.readFile(promptTemplatePath, 'utf8');
  const deploymentUse = asString(payload.settings?.deploymentUse, 'responsive');
  const displayPrompt = await readDisplayPrompt(deploymentUse);

  return templateContent
    .replaceAll('{{componentName}}', componentName)
    .replaceAll('{{targetFile}}', targetRelativePath)
    .replaceAll('{{contentId}}', payload.contentId)
    .replaceAll('{{revisionPrompt}}', payload.revisionPrompt)
    .replaceAll('{{deploymentUse}}', deploymentUse)
    .replaceAll('{{displayPrompt}}', displayPrompt)
    .replaceAll('{{settingsJson}}', JSON.stringify(payload.settings ?? {}, null, 2))
    .replaceAll('{{contentJson}}', JSON.stringify(payload.content ?? {}, null, 2))
    .replaceAll('{{currentSource}}', currentSource);
}

async function readDisplayPrompt(deploymentUse: string) {
  const safeDeploymentUse = deploymentUse.match(/^[a-zA-Z0-9_-]+$/) ? deploymentUse : 'responsive';
  const configuredDir = process.env.CODEX_LAYOUT_DISPLAY_PROMPT_DIR
    ? path.resolve(rootDir, process.env.CODEX_LAYOUT_DISPLAY_PROMPT_DIR)
    : displayPromptsDir;
  const promptPath = path.join(configuredDir, `${safeDeploymentUse}.prompt.md`);

  try {
    return await fs.readFile(promptPath, 'utf8');
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return [
        '# 배포 단말기별 레이아웃 규칙: 기본 fallback',
        '',
        `deploymentUse 값 \`${deploymentUse}\`에 대한 전용 규칙 파일을 찾지 못했습니다.`,
        '콘텐츠가 부모 컨테이너의 폭 안에서 자연스럽게 흐르도록 만들고, 루트 요소에서 overflow hidden으로 내용을 자르지 마세요.'
      ].join('\n');
    }
    throw error;
  }
}

function runCodexExec(prompt: string) {
  return new Promise<void>((resolve, reject) => {
    const args = ['-a', 'never', '-s', 'workspace-write', '-C', rootDir];

    const model = process.env.CODEX_LAYOUT_MODEL;
    if (model) {
      args.push('-m', model);
    }

    args.push('exec', '--ephemeral', '-');

    const codex = codexCommand();
    const child = spawn(codex.command, [...codex.args, ...args], {
      cwd: rootDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: false
    });

    const timeoutMs = Number(process.env.CODEX_LAYOUT_TIMEOUT_MS ?? 20 * 60 * 1000);
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Codex CLI timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      chunk
        .toString('utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line) => console.log(`codex: ${line}`));
    });

    child.stderr.on('data', (chunk: Buffer) => {
      chunk
        .toString('utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line) => console.log(`codex: ${line}`));
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Codex CLI failed with exit code ${code}`));
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}

async function validateGeneratedComponent(targetPath: string, componentName: string) {
  const content = await fs.readFile(targetPath, 'utf8');
  if (!content.includes(`export default function ${componentName}`)) {
    throw new Error(`Generated component must export default function ${componentName}.`);
  }
  if (!content.includes("import type { GeneratedContent, PlantRecord } from '../../types/content';")) {
    throw new Error('Generated component must import GeneratedContent and PlantRecord types.');
  }
}

function toPosixPath(value: string) {
  return value.split(path.sep).join('/');
}

function asString(value: unknown, fallback: string) {
  return typeof value === 'string' && value ? value : fallback;
}

function codexCommand() {
  if (process.platform === 'win32') {
    return {
      command: 'cmd.exe',
      args: ['/d', '/s', '/c', 'codex']
    };
  }

  return {
    command: 'codex',
    args: [] as string[]
  };
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
