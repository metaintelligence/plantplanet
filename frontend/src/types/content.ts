export type CreationMode = 'general' | 'advanced';
export type TemplateType = 'intro' | 'storytelling' | 'quiz' | 'mission' | 'checklist';
export type PagePurpose =
  | 'general'
  | 'education'
  | 'experience'
  | 'campaign'
  | 'promotion'
  | 'route';
export type Audience = 'children' | 'adults' | 'foreigners';
export type Language = 'ko' | 'en' | 'ja' | 'zh';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'auto';
export type EstimatedTime = '10sec' | '30sec' | '1min' | '3min';
export type DeploymentUse =
  | 'plantQr'
  | 'kiosk'
  | 'mobileCourse'
  | 'educationProgram'
  | 'sns';
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
export type Tone =
  | 'friendly'
  | 'fairytale'
  | 'museum'
  | 'emotional'
  | 'expert'
  | 'campaign';
export type StoryScenario =
  | 'extinction'
  | 'dayInLife'
  | 'timeTravel'
  | 'climateSurvival'
  | 'nameSecret';
export type LayoutId = 'generated' | 'default';
export type ContentStatus = 'draft' | 'published';

export interface PlantImage {
  url: string;
  alt: string;
  source: string;
  sourceUrl: string;
  license: string;
}

export interface PlantRecord {
  id: string;
  category: 'tree' | 'shrub' | 'herb';
  koreanName: string;
  scientificName: string;
  commonName: string;
  family: string;
  origin: string;
  habitat: string;
  size: string;
  floweringSeason: string;
  features: string[];
  conservationMessage: string;
  observationTips: string[];
  seasonHighlights: Record<Season, string>;
  image: PlantImage;
  similarPlantIds: string[];
}

export interface ContentSettings {
  mode: CreationMode;
  contentName: string;
  plantId: string;
  template: TemplateType;
  layoutId: LayoutId;
  purpose: PagePurpose;
  audience: Audience[];
  languages: Language[];
  season: Season;
  estimatedTime: EstimatedTime;
  deploymentUse: DeploymentUse;
  fieldLocation: FieldLocation;
  focusTopics: FocusTopic[];
  tone: Tone;
  featureOptions: FeatureOption[];
  storyScenario?: StoryScenario;
  extraRequest: string;
}

export interface GeneratedSection {
  title: string;
  body: string;
  items?: string[];
}

export interface GeneratedContent {
  id: string;
  title: string;
  summary: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  settings: ContentSettings;
  settingsJson: string;
  routePath: string;
  sections: GeneratedSection[];
}

export interface MockDatabase {
  version: string;
  description: string;
  plants: PlantRecord[];
}
