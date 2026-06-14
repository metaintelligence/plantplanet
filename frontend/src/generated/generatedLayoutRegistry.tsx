import type { ReactElement } from 'react';
import type { GeneratedContent, PlantRecord } from '../types/content';
import GeneratedLayoutContentMqdwhy3o from './layouts/GeneratedLayoutContentMqdwhy3o';
import GeneratedLayoutContentMqdvzrjq from './layouts/GeneratedLayoutContentMqdvzrjq';

export type GeneratedLayoutComponent = (props: {
  content: GeneratedContent;
  plant: PlantRecord;
}) => ReactElement;

export const generatedLayoutRegistry: Record<string, GeneratedLayoutComponent> = {
  "content-mqdwhy3o": GeneratedLayoutContentMqdwhy3o,
  "content-mqdvzrjq": GeneratedLayoutContentMqdvzrjq
};
