import fs from 'node:fs/promises';
import path from 'node:path';

type PlantName = '구상나무' | '미선나무' | '동백나무' | '왕벚나무' | '금강초롱꽃' | '산수국';
type TemplateType = 'intro' | 'storytelling' | 'quiz' | 'mission' | 'checklist';
type PagePurpose = 'general' | 'education' | 'experience' | 'campaign' | 'promotion';
type Audience = 'children' | 'adults' | 'foreigners';
type Language = 'ko' | 'en' | 'ja' | 'zh';
type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'auto';
type EstimatedTime = '10sec' | '30sec' | '1min' | '3min';

interface GenerateInput {
  plantName: PlantName;
  template: TemplateType;
  purpose: PagePurpose;
  audience: Audience;
  language: Language;
  season: Season;
  estimatedTime: EstimatedTime;
  extraRequest: string;
}

interface CliPayload {
  jobId: string;
  input: GenerateInput;
}

const plantFacts: Record<PlantName, { feature: string; habitat: string; risk: string }> = {
  구상나무: {
    feature: '겨울에도 푸른 바늘잎과 단단한 솔방울',
    habitat: '우리나라 높은 산',
    risk: '기후변화로 서식지가 줄어드는 일'
  },
  미선나무: {
    feature: '하얗고 향기로운 꽃과 부채 모양 열매',
    habitat: '충북의 햇빛 좋은 숲 가장자리',
    risk: '자생지가 훼손되는 일'
  },
  동백나무: {
    feature: '겨울과 이른 봄에 피는 붉은 꽃',
    habitat: '남쪽 바닷가 숲',
    risk: '따뜻한 숲 환경이 달라지는 일'
  },
  왕벚나무: {
    feature: '봄을 알리는 풍성한 연분홍 꽃',
    habitat: '제주와 온대 숲',
    risk: '병해충과 무분별한 훼손'
  },
  금강초롱꽃: {
    feature: '종처럼 아래를 향해 피는 보랏빛 꽃',
    habitat: '깊은 산의 서늘한 숲',
    risk: '희귀 식물을 함부로 채집하는 일'
  },
  산수국: {
    feature: '가장자리 장식꽃과 계절에 따라 달라지는 꽃빛',
    habitat: '습기 있는 숲길과 계곡 주변',
    risk: '건조해지는 숲 환경'
  }
};

const templateTitles: Record<TemplateType, string> = {
  intro: '한눈에 만나는',
  storytelling: '숲에서 들려오는',
  quiz: '맞혀보는',
  mission: '지켜라!',
  checklist: '관찰 노트'
};

const purposeTone: Record<PagePurpose, string> = {
  general: '오늘의 식물 해설',
  education: '배움이 있는 식물 탐구',
  experience: '직접 해보는 현장 체험',
  campaign: '함께 지키는 자연 캠페인',
  promotion: '전시장에서 만나는 특별 해설'
};

const audienceGuide: Record<Audience, string> = {
  children: '쉽고 짧은 문장으로 관찰 포인트를 알려줍니다.',
  adults: '생태적 의미와 보전 가치를 차분히 전합니다.',
  foreigners: '낯선 식물을 이해하기 쉽도록 맥락을 함께 설명합니다.'
};

const languageSuffix: Record<Language, string> = {
  ko: '',
  en: ' English preview',
  ja: ' 日本語プレビュー',
  zh: ' 中文预览'
};

const seasonLabel: Record<Season, string> = {
  spring: '봄',
  summer: '여름',
  autumn: '가을',
  winter: '겨울',
  auto: '오늘'
};

export function generatePageConfig(input: GenerateInput, jobId = `generated-${Date.now()}`) {
  const fact = plantFacts[input.plantName];
  const title =
    input.template === 'mission'
      ? `${input.plantName}를 지켜라!${languageSuffix[input.language]}`
      : `${templateTitles[input.template]} ${input.plantName}${languageSuffix[input.language]}`;

  const sections = [
    {
      type: 'hero',
      title: `${seasonLabel[input.season]}에 만나는 ${input.plantName}`,
      body: `${input.plantName}는 ${fact.habitat}에서 자라며, ${fact.feature}이 특징입니다.`
    },
    {
      type: 'info',
      title: purposeTone[input.purpose],
      body: audienceGuide[input.audience]
    }
  ];

  if (input.template === 'storytelling' || input.estimatedTime !== '10sec') {
    sections.push({
      type: 'story',
      title: `${input.plantName}의 이야기`,
      body: `${input.plantName}는 ${fact.habitat}에서 오래 살아온 식물입니다. 지금은 ${fact.risk}을 조심해야 합니다.`
    });
  }

  if (input.template === 'quiz' || input.template === 'mission' || input.estimatedTime !== '10sec') {
    sections.push({
      type: 'quiz',
      question: `${input.plantName}를 관찰할 때 가장 주목할 특징은 무엇일까요?`,
      options: [fact.feature, '잎이 전혀 없다는 점', '밤에만 자란다는 점'],
      answer: fact.feature
    });
  }

  if (input.template === 'mission' || input.purpose === 'experience') {
    sections.push({
      type: 'mission',
      title: '관찰 미션',
      body: `${input.plantName} 주변에서 ${fact.feature}을 찾아보고, 훼손하지 않고 눈으로만 기록해보세요.`
    });
  }

  if (input.template === 'checklist' || input.estimatedTime === '3min') {
    sections.push({
      type: 'checklist',
      title: '관찰 체크리스트',
      items: [
        `${input.plantName}의 잎 또는 꽃 모양 확인하기`,
        `자라는 장소가 ${fact.habitat}와 어떻게 닮았는지 살피기`,
        '식물을 만지거나 꺾지 않고 사진이나 메모로 남기기'
      ]
    });
  }

  sections.push({
    type: 'similarPlants',
    title: '함께 보면 좋은 식물',
    plants: Object.keys(plantFacts).filter((plant) => plant !== input.plantName).slice(0, 3)
  });

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
    template: input.template,
    title,
    subtitle: `${fact.risk}을 이해하는 ${input.estimatedTime} 해설 페이지`,
    audience: input.audience,
    language: input.language,
    season: input.season,
    estimatedTime: input.estimatedTime,
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

  console.log(`generate-page: ${payload.input.plantName} / ${payload.input.template}`);
  console.log(`generate-page: wrote ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
