export type PlantName =
  | '구상나무'
  | '미선나무'
  | '동백나무'
  | '왕벚나무'
  | '금강초롱꽃'
  | '산수국';

export type TemplateType = 'intro' | 'storytelling' | 'quiz' | 'mission' | 'checklist';
export type PagePurpose = 'general' | 'education' | 'experience' | 'campaign' | 'promotion';
export type Audience = 'children' | 'adults' | 'foreigners';
export type Language = 'ko' | 'en' | 'ja' | 'zh';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'auto';
export type EstimatedTime = '10sec' | '30sec' | '1min' | '3min';

export interface GenerateInput {
  plantName: PlantName;
  template: TemplateType;
  purpose: PagePurpose;
  audience: Audience;
  language: Language;
  season: Season;
  estimatedTime: EstimatedTime;
  extraRequest: string;
}

export type Section =
  | {
      type: 'hero' | 'info' | 'story' | 'mission';
      title: string;
      body: string;
    }
  | {
      type: 'quiz';
      question: string;
      options: string[];
      answer: string;
    }
  | {
      type: 'checklist';
      title: string;
      items: string[];
    }
  | {
      type: 'similarPlants';
      title: string;
      plants: string[];
    };

export interface PageConfig {
  id: string;
  plantName: string;
  template: TemplateType;
  title: string;
  subtitle: string;
  audience: Audience;
  language: Language;
  season: Season;
  estimatedTime: EstimatedTime;
  sections: Section[];
}

export interface GenerateResponse {
  jobId: string;
  pageConfig: PageConfig;
  logs: string[];
}
