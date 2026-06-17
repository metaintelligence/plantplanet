export const wizardSteps = ['plant', 'intent', 'template', 'layout', 'audience', 'field', 'review'] as const;

export type WizardStepKey = (typeof wizardSteps)[number];

export const wizardStepLabels: Record<WizardStepKey, string> = {
  plant: '대상 식물',
  intent: '목적/강조/톤',
  template: '콘텐츠 유형',
  layout: '레이아웃',
  audience: '대상/언어',
  field: '현장/추가 옵션',
  review: '선택 확인'
};
