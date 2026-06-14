import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

interface GenerateLayoutPayload {
  jobId: string;
  contentId: string;
  settingsJsonArray: string[];
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
const registryPath = path.join(generatedDir, 'generatedLayoutRegistry.tsx');
const defaultPromptPath = path.join(rootDir, 'scripts', 'prompts', 'generate-layout-page.prompt.md');
const templatePromptsDir = path.join(rootDir, 'scripts', 'prompts', 'templates');
const mockDbPath = path.join(rootDir, 'frontend', 'public', 'mock_db.json');

async function main() {
  const payload = readPayload();
  const settings = readSettings(payload);
  const template = asString(settings.template, 'custom');
  const componentName = `GeneratedLayout${toPascalIdentifier(payload.contentId)}`;
  const fileName = `${componentName}.tsx`;
  const targetPath = path.join(layoutsDir, fileName);
  const targetRelativePath = toPosixPath(path.relative(rootDir, targetPath));

  await fs.mkdir(layoutsDir, { recursive: true });
  const prompt = await buildCodexPrompt({
    componentName,
    targetRelativePath,
    template,
    settings,
    settingsJsonArray: payload.settingsJsonArray,
    mockDbSummary: await createMockDbSummary(settings)
  });

  console.log('generate-layout: invoking Codex CLI');
  await runCodexExec(prompt);
  await validateGeneratedComponent(targetPath, componentName);

  const manifest = await readManifest();
  const nextEntry: ManifestEntry = {
    contentId: payload.contentId,
    componentName,
    fileName,
    template,
    updatedAt: new Date().toISOString()
  };
  const nextManifest = [
    nextEntry,
    ...manifest.filter((entry) => entry.contentId !== payload.contentId)
  ];

  await fs.writeFile(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`, 'utf8');
  await fs.writeFile(registryPath, createRegistrySource(nextManifest), 'utf8');

  console.log(`generate-layout: wrote frontend/src/generated/layouts/${fileName}`);
  console.log(`generate-layout: updated frontend/src/generated/generatedLayoutRegistry.tsx`);
}

function readPayload(): GenerateLayoutPayload {
  const markerIndex = process.argv.indexOf('--input-base64');
  const encoded = markerIndex >= 0 ? process.argv[markerIndex + 1] : '';
  if (!encoded) {
    throw new Error('Missing --input-base64 payload');
  }
  return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as GenerateLayoutPayload;
}

function readSettings(payload: GenerateLayoutPayload) {
  if (payload.settings && typeof payload.settings === 'object') {
    return payload.settings;
  }

  const firstSettingsJson = payload.settingsJsonArray[0];
  if (!firstSettingsJson) {
    throw new Error('settingsJsonArray must include at least one JSON string.');
  }

  const parsed = JSON.parse(firstSettingsJson);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('settings JSON must be an object.');
  }
  return parsed as Record<string, unknown>;
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

function createRegistrySource(entries: ManifestEntry[]) {
  const imports = entries
    .map((entry) => `import ${entry.componentName} from './layouts/${entry.componentName}';`)
    .join('\n');
  const registryItems = entries
    .map((entry) => `  ${JSON.stringify(entry.contentId)}: ${entry.componentName}`)
    .join(',\n');

  return `import type { ReactElement } from 'react';
import type { GeneratedContent, PlantRecord } from '../types/content';
${imports ? `${imports}\n` : ''}
export type GeneratedLayoutComponent = (props: {
  content: GeneratedContent;
  plant: PlantRecord;
}) => ReactElement;

export const generatedLayoutRegistry: Record<string, GeneratedLayoutComponent> = {
${registryItems}
};
`;
}

async function buildCodexPrompt({
  componentName,
  targetRelativePath,
  template,
  settings,
  settingsJsonArray,
  mockDbSummary
}: {
  componentName: string;
  targetRelativePath: string;
  template: string;
  settings: Record<string, unknown>;
  settingsJsonArray: string[];
  mockDbSummary: unknown;
}) {
  const promptTemplatePath = process.env.CODEX_LAYOUT_PROMPT_PATH
    ? path.resolve(rootDir, process.env.CODEX_LAYOUT_PROMPT_PATH)
    : defaultPromptPath;
  const templateContent = await fs.readFile(promptTemplatePath, 'utf8');
  const templatePrompt = await readTemplatePrompt(template);

  return templateContent
    .replaceAll('{{componentName}}', componentName)
    .replaceAll('{{targetFile}}', targetRelativePath)
    .replaceAll('{{template}}', template)
    .replaceAll('{{templatePrompt}}', templatePrompt)
    .replaceAll('{{mockDbSummary}}', JSON.stringify(mockDbSummary, null, 2))
    .replaceAll('{{settingsJsonArray}}', JSON.stringify(settingsJsonArray, null, 2))
    .replaceAll('{{settingsJson}}', JSON.stringify(settings, null, 2));
}

async function readTemplatePrompt(template: string) {
  const safeTemplate = template.match(/^[a-zA-Z0-9_-]+$/) ? template : 'custom';
  const configuredDir = process.env.CODEX_LAYOUT_TEMPLATE_PROMPT_DIR
    ? path.resolve(rootDir, process.env.CODEX_LAYOUT_TEMPLATE_PROMPT_DIR)
    : templatePromptsDir;
  const promptPath = path.join(configuredDir, `${safeTemplate}.prompt.md`);

  try {
    return await fs.readFile(promptPath, 'utf8');
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return [
        '# Template-specific prompt: fallback',
        '',
        `No dedicated prompt file was found for template \`${template}\`.`,
        'Create a polished visitor-facing page that follows the common rules and avoids raw settings/DB dumps.'
      ].join('\n');
    }
    throw error;
  }
}

async function createMockDbSummary(settings: Record<string, unknown>) {
  try {
    const content = await fs.readFile(mockDbPath, 'utf8');
    const database = JSON.parse(content) as {
      version?: string;
      description?: string;
      plants?: Array<Record<string, unknown>>;
    };
    const plants = Array.isArray(database.plants) ? database.plants : [];
    const selectedPlant = plants.find((plant) => plant.id === settings.plantId) ?? null;

    return {
      sourceFile: 'frontend/public/mock_db.json',
      version: database.version,
      description: database.description,
      plantRecordFields: [
        'id',
        'category',
        'koreanName',
        'scientificName',
        'commonName',
        'family',
        'origin',
        'habitat',
        'size',
        'floweringSeason',
        'features',
        'conservationMessage',
        'observationTips',
        'seasonHighlights',
        'image',
        'similarPlantIds'
      ],
      availablePlants: plants.map((plant) => ({
        id: plant.id,
        koreanName: plant.koreanName,
        scientificName: plant.scientificName,
        category: plant.category
      })),
      selectedPlant
    };
  } catch (error) {
    return {
      sourceFile: 'frontend/public/mock_db.json',
      unavailable: true,
      reason: error instanceof Error ? error.message : 'Unknown mock DB read error'
    };
  }
}

function runCodexExec(prompt: string) {
  return new Promise<void>((resolve, reject) => {
    const args = [
      '-a',
      'never',
      '-s',
      'workspace-write',
      '-C',
      rootDir
    ];

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

    const timeoutMs = Number(process.env.CODEX_LAYOUT_TIMEOUT_MS ?? 300000);
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

function toPascalIdentifier(value: string) {
  const words = value.match(/[a-zA-Z0-9]+/g) ?? ['Custom'];
  const pascal = words
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join('');
  return /^[0-9]/.test(pascal) ? `_${pascal}` : pascal;
}

function asString(value: unknown, fallback: string) {
  return typeof value === 'string' && value ? value : fallback;
}

function toPosixPath(value: string) {
  return value.split(path.sep).join('/');
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
