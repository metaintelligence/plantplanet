import { labelOf, templateOptions } from '../data/contentOptions';
import type { ContentSettings } from '../types/content';

export function buildDefaultContentName(plantName: string, template: ContentSettings['template']) {
  return `${plantName}_${labelOf(templateOptions, template)}_${formatRequestDate(new Date())}`;
}

export function formatRequestDate(date: Date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());
  const hours = padDatePart(date.getHours());
  const minutes = padDatePart(date.getMinutes());
  const seconds = padDatePart(date.getSeconds());
  return `${year}${month}${day}_${hours}:${minutes}:${seconds}`;
}

function padDatePart(value: number) {
  return String(value).padStart(2, '0');
}
