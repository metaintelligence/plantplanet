import fs from 'node:fs/promises';
import path from 'node:path';

type PlantName = '구상나무' | '미선나무' | '동백나무' | '왕벚나무' | '금강초롱꽃' | '연꽃';
type TemplateType = 'intro' | 'storytelling' | 'quiz' | 'mission';
type PagePurpose = 'general' | 'education' | 'experience' | 'campaign' | 'promotion' | 'route';
type Audience = 'children' | 'adults' | 'foreigners';
type Language = 'ko' | 'en' | 'ja' | 'zh';
type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'auto';
type EstimatedTime = '10sec' | '30sec' | '1min' | '3min';
type DeploymentUse = 'kiosk' | 'mobile' | 'staticPoster';
type FieldLocation = 'greenhouse' | 'garden' | 'outdoorGarden' | 'forestTrail' | 'park';
type FocusTopic =
  | 'appearance'
  | 'ecology'
  | 'nameOrigin'
  | 'cultureHistory'
  | 'usage'
  | 'conservation'
  | 'comparison'
  | 'funFacts';
type FeatureOption = 'voiceGuide' | 'qaAi' | 'similarPlantCards';

interface GenerateInput {
  plantName: PlantName;
  template: TemplateType | 'checklist';
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

interface CliPayload {
  jobId: string;
  input: GenerateInput;
}

const plantFacts: Record<PlantName, { feature: string; habitat: string; risk: string }> = {
  구상나무: {
    feature: '겨울에도 푸른 바늘잎과 위로 선 솔방울',
    habitat: '우리나라 높은 산지',
    risk: '기후변화로 서식지가 줄어드는 상황'
  },
  미선나무: {
    feature: '하얗고 향기로운 꽃과 부채 모양 열매',
    habitat: '햇빛이 잘 드는 산기슭',
    risk: '자생지가 제한적인 희귀 식물'
  },
  동백나무: {
    feature: '겨울과 이른 봄에 피는 붉은 꽃',
    habitat: '따뜻한 남부 해안과 숲',
    risk: '기후와 서식 환경 변화'
  },
  왕벚나무: {
    feature: '봄을 알리는 풍성한 연분홍 꽃',
    habitat: '제주와 동아시아 일부 지역',
    risk: '병해충과 무분별한 훼손'
  },
  금강초롱꽃: {
    feature: '종처럼 아래를 향해 피는 보랏빛 꽃',
    habitat: '깊은 산의 그늘진 곳',
    risk: '희귀 식물의 훼손과 채집'
  },
  연꽃: {
    feature: '물 위로 높게 올라오는 큰 잎과 꽃',
    habitat: '물이 고인 습지와 연못',
    risk: '습지 환경 변화'
  }
};

const templateTitles: Record<TemplateType, string> = {
  intro: '한눈에 만나는',
  storytelling: '이야기로 만나는',
  quiz: '맞혀보는',
  mission: '관찰 미션'
};

const purposeTone: Record<PagePurpose, string> = {
  general: '오늘의 식물 해설',
  education: '배움이 있는 식물 탐구',
  experience: '직접 해보는 현장 체험',
  campaign: '함께 지키는 자연 캠페인',
  promotion: '전시에서 만나는 특별 해설',
  route: '다음 장소로 이어지는 관람 동선'
};

export function generatePageConfig(input: GenerateInput, jobId = `generated-${Date.now()}`) {
  const template: TemplateType = input.template === 'checklist' ? 'mission' : input.template;
  const fact = plantFacts[input.plantName];
  const title =
    template === 'mission'
      ? `${input.plantName} 관찰 미션`
      : `${templateTitles[template]} ${input.plantName}`;

  const sections = [
    {
      type: 'hero',
      title: `${input.plantName}를 만나는 시간`,
      body: `${input.plantName}는 ${fact.habitat}와 관련이 깊고, ${fact.feature}이 주요 특징입니다.`
    },
    {
      type: 'info',
      title: purposeTone[input.purpose],
      body: `${input.estimatedTime} 동안 볼 수 있는 핵심 관찰 포인트를 정리합니다.`
    },
    {
      type: 'deployment',
      title: '현장 배포 설정',
      items: [
        input.deploymentUse,
        input.fieldLocation,
        `강조 항목: ${input.focusTopics.join(', ') || 'appearance'}`,
        input.featureOptions.length ? `추가 기능: ${input.featureOptions.join(', ')}` : '추가 기능 없음'
      ]
    }
  ];

  if (template === 'storytelling' || input.estimatedTime !== '10sec') {
    sections.push({
      type: 'story',
      title: `${input.plantName}의 이야기`,
      body: `${fact.risk}을 이해하며 식물을 더 오래 지켜보는 관찰 흐름을 만듭니다.`
    });
  }

  if (template === 'quiz' || template === 'mission' || input.estimatedTime !== '10sec') {
    sections.push({
      type: 'quiz',
      question: `${input.plantName}를 관찰할 때 가장 주목할 특징은 무엇일까요?`,
      options: [fact.feature, '꽃이 전혀 피지 않는 점', '밤에만 잎이 자라는 점'],
      answer: fact.feature
    });
  }

  if (template === 'mission' || input.purpose === 'experience') {
    sections.push({
      type: 'mission',
      title: '관찰 미션',
      body: `${input.plantName} 주변에서 ${fact.feature}을 찾아보고, 훼손하지 않고 사진이나 메모로만 기록해보세요.`
    });
    sections.push({
      type: 'checklist',
      title: '관찰 미션 체크',
      items: [
        `${input.plantName}의 대표 특징 확인하기`,
        `${fact.habitat}와 어떤 관련이 있는지 생각하기`,
        '식물을 만지거나 꺾지 않고 눈으로 관찰하기'
      ]
    });
  }

  if (input.extraRequest.trim()) {
    sections.push({
      type: 'info',
      title: '추가 요청 반영',
      body: input.extraRequest.trim()
    });
  }

  return {
    id: jobId,
    plantName: input.plantName,
    template,
    title,
    subtitle: `${fact.risk}을 이해하는 ${input.estimatedTime} 안내 페이지`,
    audience: input.audience,
    language: input.language,
    season: input.season,
    estimatedTime: input.estimatedTime,
    deploymentUse: input.deploymentUse,
    fieldLocation: input.fieldLocation,
    featureOptions: input.featureOptions,
    sections
  };
}

function readPayload(): CliPayload {
  const markerIndex = process.argv.indexOf('--input-base64');
  const encoded = markerIndex >= 0 ? process.argv[markerIndex + 1] : '';
  if (!encoded) {
    throw new Error('Missing --input-base64 payload');
  }
  return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as CliPayload;
}

async function main() {
  const payload = readPayload();
  const generatedDir = process.env.GENERATED_DIR
    ? path.resolve(process.env.GENERATED_DIR)
    : path.resolve(process.cwd(), 'generated');
  const outputPath = path.join(generatedDir, 'page-config.json');

  await fs.mkdir(generatedDir, { recursive: true });
  const config = generatePageConfig(payload.input, payload.jobId);
  await fs.writeFile(outputPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');

  console.log(`generate-page: ${payload.input.plantName} / ${config.template}`);
  console.log(`generate-page: wrote ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
