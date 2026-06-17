import type { PlantRecord, Season } from '../types/content';

export const plantCategoryLabels: Record<PlantRecord['category'], string> = {
  tree: '교목',
  shrub: '관목',
  herb: '초본'
};

export const plantSeasonLabels: Record<Season, string> = {
  spring: '봄',
  summer: '여름',
  autumn: '가을',
  winter: '겨울',
  auto: '기본 관찰 포인트'
};

export const plantDataText = {
  eyebrow: 'Mock DB',
  close: '닫기',
  fields: {
    category: '구분',
    commonName: '일반명',
    origin: '원산/분포',
    habitat: '서식 환경',
    size: '크기',
    floweringSeason: '개화/관찰 시기'
  },
  sections: {
    features: '주요 특징',
    observationTips: '관찰 포인트',
    conservationMessage: '보전 메시지'
  }
} as const;
