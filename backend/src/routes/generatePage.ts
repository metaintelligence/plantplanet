import { Router } from 'express';
import { generateInputSchema } from '../types/generateInput.js';
import { readLatestPageConfig, runGeneratePageCli } from '../services/cliRunner.js';

const router = Router();

router.post('/generate-page', async (request, response, next) => {
  try {
    const parsed = generateInputSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({
        message: '입력값이 허용된 형식과 다릅니다.',
        issues: parsed.error.flatten()
      });
      return;
    }

    const result = await runGeneratePageCli(parsed.data);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/generated-page/latest', async (_request, response, next) => {
  try {
    const latest = await readLatestPageConfig();
    if (!latest) {
      response.status(404).json({ message: '아직 생성된 page-config.json이 없습니다.' });
      return;
    }
    response.json(latest);
  } catch (error) {
    next(error);
  }
});

export default router;
