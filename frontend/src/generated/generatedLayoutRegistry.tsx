import type { ReactElement } from 'react';
import type { GeneratedContent, PlantRecord } from '../types/content';

export type GeneratedLayoutComponent = (props: {
  content: GeneratedContent;
  plant: PlantRecord;
}) => ReactElement;

export const generatedLayoutRegistry: Record<string, GeneratedLayoutComponent> = {};
