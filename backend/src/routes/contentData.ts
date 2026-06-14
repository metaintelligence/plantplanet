import { Router } from 'express';
import { z } from 'zod';
import { createFileDataStore, type GeneratedContentRecord } from '../services/fileDataStore.js';

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

const contentPatchSchema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  settings: z.unknown().optional(),
  settingsJson: z.string().optional(),
  routePath: z.string().optional(),
  sections: z.array(z.unknown()).optional()
});

export function createContentDataRouter(rootDir: string) {
  const router = Router();
  const store = createFileDataStore(rootDir);

  router.get('/contents', async (_request, response, next) => {
    try {
      response.json(await store.listContents());
    } catch (error) {
      next(error);
    }
  });

  router.get('/contents/:contentId', async (request, response, next) => {
    try {
      const content = await store.getContent(request.params.contentId);
      if (!content) {
        response.status(404).json({ message: '콘텐츠를 찾을 수 없습니다.' });
        return;
      }
      response.json(content);
    } catch (error) {
      next(error);
    }
  });

  router.put('/contents/:contentId', async (request, response, next) => {
    try {
      const parsed = generatedContentSchema.safeParse({
        ...request.body,
        id: request.params.contentId
      });
      if (!parsed.success) {
        response.status(400).json({ message: '콘텐츠 형식이 올바르지 않습니다.', issues: parsed.error.flatten() });
        return;
      }

      const contents = await store.upsertContent(parsed.data as GeneratedContentRecord);
      response.json(contents);
    } catch (error) {
      next(error);
    }
  });

  router.patch('/contents/:contentId', async (request, response, next) => {
    try {
      const parsed = contentPatchSchema.safeParse(request.body);
      if (!parsed.success) {
        response.status(400).json({ message: '콘텐츠 수정값이 올바르지 않습니다.', issues: parsed.error.flatten() });
        return;
      }

      const contents = await store.patchContent(request.params.contentId, parsed.data);
      response.json(contents);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/contents/:contentId', async (request, response, next) => {
    try {
      response.json(await store.removeContent(request.params.contentId));
    } catch (error) {
      next(error);
    }
  });

  router.get('/generation-jobs', async (_request, response, next) => {
    try {
      response.json(await store.listJobs());
    } catch (error) {
      next(error);
    }
  });

  return router;
}
