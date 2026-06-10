import { z } from 'zod';

export const generateInputSchema = z.object({
  plantName: z.enum(['구상나무', '미선나무', '동백나무', '왕벚나무', '금강초롱꽃', '산수국']),
  template: z.enum(['intro', 'storytelling', 'quiz', 'mission', 'checklist']),
  purpose: z.enum(['general', 'education', 'experience', 'campaign', 'promotion']),
  audience: z.enum(['children', 'adults', 'foreigners']),
  language: z.enum(['ko', 'en', 'ja', 'zh']),
  season: z.enum(['spring', 'summer', 'autumn', 'winter', 'auto']),
  estimatedTime: z.enum(['10sec', '30sec', '1min', '3min']),
  extraRequest: z.string().max(1000).default('')
});

export type GenerateInput = z.infer<typeof generateInputSchema>;
