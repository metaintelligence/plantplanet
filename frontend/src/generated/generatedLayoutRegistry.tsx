import type { ReactElement } from 'react';
import type { GeneratedContent, PlantRecord } from '../types/content';
import GeneratedLayoutContentMqgp6m9n from './layouts/GeneratedLayoutContentMqgp6m9n';
import GeneratedLayoutContentMqgk310v from './layouts/GeneratedLayoutContentMqgk310v';

export type GeneratedLayoutComponent = (props: {
  content: GeneratedContent;
  plant: PlantRecord;
}) => ReactElement;

export const generatedLayoutRegistry: Record<string, GeneratedLayoutComponent> = {
  "content-mqgp6m9n": GeneratedLayoutContentMqgp6m9n,
  "content-mqgk310v": GeneratedLayoutContentMqgk310v
};
