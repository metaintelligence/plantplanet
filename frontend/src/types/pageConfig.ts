export type PlantName =
  | '구상나무'
  | '미선나무'
  | '동백나무'
  | '왕벚나무'
  | '금강초롱꽃'
  | '산수국'
  | '연꽃'
  | '아카시아'
  | '무궁화'
  | '소나무'
  | '단풍나무'
  | '은행나무';

export type TemplateType = 'intro' | 'storytelling' | 'quiz' | 'mission';
export type PagePurpose = 'general' | 'education' | 'experience' | 'campaign' | 'promotion' | 'route';
export type Audience = 'children' | 'adults' | 'foreigners';
export type Language = 'ko' | 'en' | 'ja' | 'zh';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'auto';
export type EstimatedTime = '10sec' | '30sec' | '1min' | '3min';
export type DeploymentUse = 'kiosk' | 'mobile' | 'staticPoster';
export type FieldLocation = 'greenhouse' | 'garden' | 'outdoorGarden' | 'forestTrail' | 'park';
export type FocusTopic =
  | 'appearance'
  | 'ecology'
  | 'nameOrigin'
  | 'cultureHistory'
  | 'usage'
  | 'conservation'
  | 'comparison'
  | 'funFacts';
export type FeatureOption = 'voiceGuide' | 'qaAi' | 'similarPlantCards';

export interface GenerateInput {
  plantName: PlantName;
  template: TemplateType;
  purpose: PagePurpose;
  audience: Audience;
  language: Language;
  season: Season;
  estimatedTime: EstimatedTime;
  deploymentUse: DeploymentUse;
  fieldLocation: FieldLocation;
  focusTopics: FocusTopic[];
  featureOptions: FeatureOption[];
  extraRequest: string;
}

export type Section =
  | { type: 'hero' | 'info' | 'story' | 'mission'; title: string; body: string }
  | { type: 'quiz'; question: string; options: string[]; answer: string }
  | { type: 'checklist'; title: string; items: string[] }
  | { type: 'similarPlants'; title: string; plants: string[] }
  | { type: 'deployment'; title: string; items: string[] };

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
  deploymentUse: DeploymentUse;
  fieldLocation: FieldLocation;
  featureOptions: FeatureOption[];
  sections: Section[];
}

export interface GenerateResponse {
  jobId: string;
  pageConfig: PageConfig;
  logs: string[];
}
