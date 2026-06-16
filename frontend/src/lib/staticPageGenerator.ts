import type {
  Audience,
  EstimatedTime,
  FeatureOption,
  FieldLocation,
  FocusTopic,
  Language,
  PageConfig,
  PagePurpose,
  PlantName,
  Season,
  TemplateType
} from '../types/pageConfig';

interface GenerateInput {
  plantName: PlantName;
  template: TemplateType;
  purpose: PagePurpose;
  audience: Audience;
  language: Language;
  season: Season;
  estimatedTime: EstimatedTime;
  deploymentUse: 'kiosk' | 'mobile' | 'staticPoster';
  fieldLocation: FieldLocation;
  focusTopics: FocusTopic[];
  featureOptions: FeatureOption[];
  extraRequest: string;
}

const plantFacts: Record<PlantName, { feature: string; habitat: string; risk: string; sensory: string }> = {
  구상나무: {
    feature: '보라빛 구과와 짧은 바늘잎이 특징입니다.',
    habitat: '서늘한 고산 지대',
    risk: '기후 변화로 서식지가 줄어들고 있습니다.',
    sensory: '단단한 바늘잎과 곧게 선 구과'
  },
  미선나무: {
    feature: '이른 봄에 은은한 향의 흰 꽃이 핍니다.',
    habitat: '햇빛이 잘 드는 비탈과 가장자리',
    risk: '자생지가 제한적이라 보전 가치가 큽니다.',
    sensory: '부드러운 꽃향기와 가느다란 가지'
  },
  동백나무: {
    feature: '겨울과 이른 봄에 붉은 꽃을 피웁니다.',
    habitat: '남부 해안의 상록 숲',
    risk: '기후와 생태 변화를 함께 관찰하기 좋습니다.',
    sensory: '윤기 있는 잎과 도톰한 꽃잎'
  },
  왕벚나무: {
    feature: '짧은 시기에 풍성한 꽃을 보여줍니다.',
    habitat: '정원과 공원, 산책 동선 주변',
    risk: '관람 수요가 높아 관리와 해설이 중요합니다.',
    sensory: '밝은 꽃구름과 넓게 퍼진 수형'
  },
  금강초롱꽃: {
    feature: '종 모양의 푸른빛 꽃이 아래로 늘어집니다.',
    habitat: '서늘하고 그늘진 산지',
    risk: '채집과 서식지 교란에 민감합니다.',
    sensory: '차분한 보랏빛과 종 모양 실루엣'
  },
  산수국: {
    feature: '가장자리 장식꽃과 가운데 작은 꽃이 함께 보입니다.',
    habitat: '습기가 있는 숲길과 계곡 가장자리',
    risk: '여름철 수분 환경 변화를 함께 관찰하기 좋습니다.',
    sensory: '겹겹의 꽃차례와 시원한 색감'
  },
  연꽃: {
    feature: '넓은 잎과 물 위로 올라오는 꽃이 인상적입니다.',
    habitat: '연못과 습지',
    risk: '수질과 계절 변화의 영향을 크게 받습니다.',
    sensory: '넓은 잎, 물결, 또렷한 꽃 중심부'
  },
  아카시아: {
    feature: '하얀 꽃송이와 향이 두드러집니다.',
    habitat: '공원과 길가, 햇볕이 좋은 곳',
    risk: '곤충과 꽃의 관계를 설명하기 좋습니다.',
    sensory: '달콤한 향과 길게 늘어진 꽃송이'
  },
  무궁화: {
    feature: '여름부터 가을까지 차례로 새 꽃을 올립니다.',
    habitat: '정원과 숲길 가장자리',
    risk: '문화적 상징성과 관찰 포인트를 함께 다루기 좋습니다.',
    sensory: '선명한 꽃잎과 중심부 무늬'
  },
  소나무: {
    feature: '사계절 푸른 잎과 강한 수형이 특징입니다.',
    habitat: '산지와 공원, 건조한 양지',
    risk: '기후 적응과 전통 경관 이야기에 잘 어울립니다.',
    sensory: '솔향, 거친 수피, 길게 모인 바늘잎'
  },
  단풍나무: {
    feature: '계절에 따라 잎 색 변화가 뚜렷합니다.',
    habitat: '계곡 주변과 정원, 산책길',
    risk: '계절 변화 관찰에 적합한 대표 수종입니다.',
    sensory: '얇은 잎맥과 강한 색 대비'
  },
  은행나무: {
    feature: '부채꼴 잎과 가을 황금빛 잎이 잘 알려져 있습니다.',
    habitat: '도심과 공원, 큰 길가',
    risk: '도시 경관과 계절 경험을 연결하기 좋습니다.',
    sensory: '부채 모양 잎과 강한 노란빛'
  }
};

const templateTitles: Record<TemplateType, string> = {
  intro: '식물 소개',
  storytelling: '이야기로 만나는',
  quiz: '퀴즈로 보는',
  mission: '관찰 미션'
};

const purposeTone: Record<PagePurpose, string> = {
  general: '핵심 특징을 빠르게 이해할 수 있게 정리합니다.',
  education: '관찰과 학습 포인트가 분명하게 드러나야 합니다.',
  experience: '직접 해보는 체험 흐름이 중심이 됩니다.',
  campaign: '보전과 실천 메시지를 자연스럽게 녹입니다.',
  promotion: '전시의 매력과 식물의 매력을 함께 보여줍니다.',
  route: '다음 동선으로 이어지는 안내 흐름을 만듭니다.'
};

const labelMap = {
  spring: '봄',
  summer: '여름',
  autumn: '가을',
  winter: '겨울',
  auto: '기본',
  '10sec': '10초',
  '30sec': '30초',
  '1min': '1분',
  '3min': '3분',
  greenhouse: '온실',
  garden: '정원',
  outdoorGarden: '야외 정원',
  forestTrail: '숲길',
  park: '공원',
  appearance: '외형',
  ecology: '생태',
  nameOrigin: '이름 유래',
  cultureHistory: '문화/역사',
  usage: '활용',
  conservation: '보전 가치',
  comparison: '비교 관찰',
  funFacts: '흥미 요소',
  voiceGuide: '음성 가이드',
  qaAi: '질문응답 AI',
  similarPlantCards: '유사 식물 카드'
} as const;

export function generateStaticPageConfig(input: GenerateInput): PageConfig {
  const fact = plantFacts[input.plantName];
  const focusText = input.focusTopics.map((topic) => labelMap[topic]).join(', ') || '외형';
  const title = input.template === 'mission' ? `${input.plantName} 관찰 미션` : `${templateTitles[input.template]} ${input.plantName}`;

  const sections: PageConfig['sections'] = [
    {
      type: 'hero',
      title: `${labelMap[input.season]}에 만나는 ${input.plantName}`,
      body: `${labelMap[input.fieldLocation]}에서 ${fact.sensory}를 중심으로 관찰해보세요. ${labelMap[input.estimatedTime]} 안에 핵심을 이해할 수 있도록 구성합니다.`
    },
    {
      type: 'info',
      title: purposeTone[input.purpose],
      body: `${input.plantName}는 ${fact.habitat}에서 잘 보이며, ${fact.feature}`
    },
    {
      type: 'deployment',
      title: '현장 배포 설정',
      items: [
        input.deploymentUse,
        labelMap[input.fieldLocation],
        `강조 콘텐츠: ${focusText}`,
        input.featureOptions.length
          ? `추가 기능: ${input.featureOptions.map((option) => labelMap[option]).join(', ')}`
          : '추가 기능 없음'
      ]
    }
  ];

  if (input.template === 'storytelling' || input.estimatedTime !== '10sec') {
    sections.push({
      type: 'story',
      title: `${input.plantName}의 이야기`,
      body: `${fact.risk}라는 맥락을 바탕으로, 오늘 이 식물을 어떻게 바라보면 좋을지 이야기 흐름으로 풀어냅니다.`
    });
  }

  if (input.template === 'quiz' || input.template === 'mission' || input.estimatedTime !== '10sec') {
    sections.push({
      type: 'quiz',
      question: `${input.plantName}의 특징으로 가장 알맞은 것은 무엇일까요?`,
      options: [fact.feature, '꽃이 전혀 피지 않는다', '물가에서만 자란다'],
      answer: fact.feature
    });
  }

  if (input.template === 'mission' || input.purpose === 'experience') {
    sections.push({
      type: 'mission',
      title: '관찰 미션',
      body: `${fact.sensory}를 직접 찾아보고, 손대지 않은 채 눈으로만 기록해 보세요.`
    });
    sections.push({
      type: 'checklist',
      title: '관찰 미션 체크',
      items: [
        `${input.plantName}의 대표 특징 확인하기`,
        `${fact.habitat}와 식물의 관계 떠올려보기`,
        '채집하지 않고 눈으로만 관찰하기'
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
    id: `static-${Date.now()}`,
    plantName: input.plantName,
    template: input.template,
    title,
    subtitle: `${fact.risk}를 이해하는 ${labelMap[input.estimatedTime]} 안내 페이지`,
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
