export const contentGeneratorText = {
  summarySuffix: '콘텐츠',
  missionTitleSuffix: '관찰 미션',
  storytellingTitleSuffix: '이야기 산책',
  sectionTitles: {
    seasonalPoint: (seasonLabel: string) => `${seasonLabel} 관찰 포인트`,
    basicInfo: '기본 정보',
    settingsSummary: '생성 설정 요약',
    conservationMessage: '보전 메시지',
    quizLead: '시작 퀴즈',
    observationMission: '관찰 미션 시작'
  },
  labels: {
    audience: '대상 관람객',
    language: '언어',
    deploymentUse: '배포 단말',
    fieldLocation: '현장 위치',
    focusTopics: '강조 콘텐츠',
    estimatedTime: '예상 체험 시간',
    defaultFeatureFallback: '꽃과 줄기 관찰하기'
  },
  basicInfoBody: (scientificName: string, family: string, habitat: string, size: string) =>
    `${scientificName}, ${family}. ${habitat}에서 자라며 ${size} 정도까지 성장합니다.`,
  settingsSummaryBody: (purposeLabel: string, toneLabel: string) =>
    `${purposeLabel} 목적의 ${toneLabel} 콘텐츠입니다.`,
  quizLeadBody: (plantName: string) => `${plantName}의 특징으로 가장 잘 어울리는 것을 골라 보세요.`,
  missionLeadBody: (plantName: string) => `${plantName} 앞에서 아래 관찰 미션을 순서대로 수행해 보세요.`,
  storytellingBody: (plantName: string) =>
    `${plantName}를 주인공으로 현장 분위기를 따라가는 이야기 흐름으로 구성합니다.`
} as const;
