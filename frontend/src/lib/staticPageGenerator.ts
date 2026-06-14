import type {
  DeploymentUse,
  EstimatedTime,
  FeatureOption,
  FieldLocation,
  FocusTopic,
  GenerateInput,
  PageConfig,
  PagePurpose,
  PlantName,
  Season,
  TemplateType
} from '../types/pageConfig';

const plantFacts: Record<PlantName, { feature: string; habitat: string; risk: string; sensory: string }> = {
  구상나무: {
    feature: '겨울에도 푸른 바늘잎과 단단한 솔방울',
    habitat: '우리나라 높은 산',
    risk: '기후변화로 서식지가 줄어드는 일',
    sensory: '짙은 초록 바늘잎과 위로 선 솔방울'
  },
  미선나무: {
    feature: '하얗고 향기로운 꽃과 부채 모양 열매',
    habitat: '충북의 햇빛 좋은 숲 가장자리',
    risk: '자생지가 훼손되는 일',
    sensory: '은은한 향기와 작은 부채 같은 열매'
  },
  동백나무: {
    feature: '겨울과 이른 봄에 피는 붉은 꽃',
    habitat: '남쪽 바닷가 숲',
    risk: '따뜻한 숲 환경이 달라지는 일',
    sensory: '윤기 있는 잎과 바닥에 통째로 떨어지는 꽃'
  },
  왕벚나무: {
    feature: '봄을 알리는 풍성한 연분홍 꽃',
    habitat: '제주와 온대 숲',
    risk: '병해충과 무분별한 훼손',
    sensory: '가지 끝에 모여 피는 연분홍 꽃송이'
  },
  금강초롱꽃: {
    feature: '종처럼 아래를 향해 피는 보랏빛 꽃',
    habitat: '깊은 산의 서늘한 숲',
    risk: '희귀 식물을 함부로 채집하는 일',
    sensory: '고개 숙인 종 모양 꽃과 차분한 보랏빛'
  },
  산수국: {
    feature: '가장자리 장식꽃과 계절에 따라 달라지는 꽃빛',
    habitat: '습기 있는 숲길과 계곡 주변',
    risk: '건조해지는 숲 환경',
    sensory: '작은 꽃 주변을 둘러싼 장식꽃'
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
  general: '일반 관람객에게 식물의 특징을 쉽게 소개합니다.',
  education: '학생과 어린이가 관찰하며 배울 수 있도록 문장을 짧게 구성합니다.',
  experience: '현장에서 바로 따라 할 수 있는 미션과 관찰 행동을 중심에 둡니다.',
  campaign: '생물다양성과 기후위기 메시지를 보전 가치와 함께 전합니다.',
  promotion: '전시와 계절 행사의 매력을 짧고 선명하게 안내합니다.',
  route: '다음 장소나 관련 식물로 자연스럽게 이동하도록 동선을 제안합니다.'
};

const seasonLabel: Record<Season, string> = {
  spring: '봄',
  summer: '여름',
  autumn: '가을',
  winter: '겨울',
  auto: '오늘'
};

const timeLabel: Record<EstimatedTime, string> = {
  '10sec': '10초',
  '30sec': '30초',
  '1min': '1분',
  '3min': '3분'
};

const deploymentLabel: Record<DeploymentUse, string> = {
  plantQr: '식물 표찰 QR',
  kiosk: '전시관 키오스크',
  mobileCourse: '모바일 관람 코스',
  educationProgram: '교육 프로그램',
  sns: 'SNS/홍보 페이지'
};

const locationLabel: Record<FieldLocation, string> = {
  greenhouse: '온실',
  garden: '정원',
  outdoorGarden: '야외 정원',
  forestTrail: '숲길',
  park: '공원'
};

const focusLabel: Record<FocusTopic, string> = {
  appearance: '생김새',
  ecology: '생태',
  nameOrigin: '이름 유래',
  cultureHistory: '문화/역사',
  usage: '활용',
  conservation: '보전 가치',
  comparison: '비교 학습',
  funFacts: '재미 요소'
};

const featureLabel: Record<FeatureOption, string> = {
  voiceGuide: '음성 해설',
  qaAi: '질문답변 AI',
  similarPlantCards: '유사식물카드'
};

export function generateStaticPageConfig(input: GenerateInput): PageConfig {
  const fact = plantFacts[input.plantName];
  const focusText = input.focusTopics.map((topic) => focusLabel[topic]).join(', ') || '생김새';
  const title =
    input.template === 'mission'
      ? `${input.plantName}를 지켜라!`
      : `${templateTitles[input.template]} ${input.plantName}`;

  const sections: PageConfig['sections'] = [
    {
      type: 'hero',
      title: `${seasonLabel[input.season]}에 만나는 ${input.plantName}`,
      body: `${locationLabel[input.fieldLocation]}에서 ${fact.sensory}을 관찰해보세요. ${timeLabel[input.estimatedTime]} 안에 핵심만 이해할 수 있게 구성했습니다.`
    },
    {
      type: 'deployment',
      title: '현장 배포 설정',
      items: [
        deploymentLabel[input.deploymentUse],
        locationLabel[input.fieldLocation],
        `주요 설명 항목: ${focusText}`,
        input.featureOptions.length
          ? `추가 기능: ${input.featureOptions.map((option) => featureLabel[option]).join(', ')}`
          : '추가 기능 없음'
      ]
    },
    {
      type: 'info',
      title: '콘텐츠 방향',
      body: `${purposeTone[input.purpose]} ${input.plantName}는 ${fact.habitat}에서 자라며, ${fact.feature}이 특징입니다.`
    }
  ];

  if (input.template === 'storytelling' || input.estimatedTime !== '10sec') {
    sections.push({
      type: 'story',
      title: `${input.plantName}의 이야기`,
      body: `${input.plantName}가 사는 환경이 달라지면 ${fact.risk}이 커질 수 있습니다. 오늘의 관찰은 이 식물을 오래 지키기 위한 첫 번째 기록입니다.`
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
      body: `${input.plantName} 주변에서 ${fact.sensory}을 찾아보고, 훼손하지 않고 사진이나 메모로만 기록해보세요.`
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
    id: `static-${Date.now()}`,
    plantName: input.plantName,
    template: input.template,
    title,
    subtitle: `${fact.risk}을 이해하는 ${timeLabel[input.estimatedTime]} 맞춤형 해설 페이지`,
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
