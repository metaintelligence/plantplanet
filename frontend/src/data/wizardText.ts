export const wizardText = {
  header: {
    eyebrow: 'Content Wizard',
    createTitle: '콘텐츠 생성',
    editTitle: '콘텐츠 수정',
    description:
      '대상 식물부터 차례대로 설정을 정리하면 선택한 레이아웃 방식에 따라 콘텐츠 페이지를 생성합니다.',
    backToManager: '콘텐츠 관리로 이동'
  },
  blocked: {
    withTitle: (title: string) => `"${title}" 작업이 진행 중입니다. 새 페이지 생성은 작업 완료 후 가능합니다.`,
    generic: '진행 중인 작업이 있어 페이지 생성을 잠시 중단합니다.'
  },
  stepDescriptions: {
    plant: 'mock_db.json 식물 데이터를 바탕으로 콘텐츠 대상을 선택합니다.',
    intent: '페이지 목적과 문장 분위기, 강조할 주제를 함께 정합니다.',
    template: '선택한 유형에 따라 방문자 경험의 기본 흐름이 달라집니다.',
    layout: '레이아웃 생성 방식을 선택합니다.',
    audience: '대상 관람객과 출력 언어를 선택합니다.',
    field: '배포 단말, 전시 공간, 별도 요청사항을 입력합니다.',
    review: '생성 전 마지막으로 전체 선택 결과를 한 번에 확인합니다.'
  },
  dynamicDescriptions: {
    review: (plantName: string) => `${plantName} 콘텐츠 생성 전에 지금까지 선택한 설정을 한 번에 확인합니다.`
  },
  sections: {
    plant: '대상 식물 선택',
    intent: '목적, 강조 콘텐츠, 톤',
    template: '콘텐츠 유형 선택',
    layout: '템플릿 레이아웃 선택',
    audience: '대상 관람객과 언어',
    field: '현장과 추가 조건',
    review: '콘텐츠 이름과 선택 결과 확인'
  },
  fields: {
    purpose: '목적',
    tone: '톤',
    focusTopics: '강조 콘텐츠',
    storyScenario: '스토리 시나리오',
    audience: '대상 관람객',
    languages: '출력 언어',
    deploymentUse: '배포 단말',
    fieldLocation: '실제 현장',
    season: '현재 계절',
    estimatedTime: '목표 체험 시간',
    featureOptions: '추가 기능 옵션',
    extraRequest: '추가 요청사항',
    contentName: '콘텐츠 이름'
  },
  placeholders: {
    extraRequest: '예: 초등학생 대상의 친근한 말투로 기후 위기 메시지를 자연스럽게 녹여 주세요.',
    contentName: (fallbackName: string) => fallbackName
  },
  alerts: {
    defaultLayout: '생성형AI를 사용하지 않고 기본 레이아웃을 재사용합니다.'
  },
  status: {
    emptyName: '콘텐츠 이름을 입력해 주세요.',
    defaultLayoutSaving: '기본 레이아웃 콘텐츠를 서버 파일로 저장하고 있습니다.',
    generatedLayoutSaving: '선택 결과를 바탕으로 생성 작업을 시작합니다.',
    submitLoading: '백그라운드 작업 시작 중',
    useDefaultLayout: '기본 레이아웃으로 저장',
    createContent: '콘텐츠 생성',
    applyEdit: '수정 내용 적용'
  },
  buttons: {
    previous: '이전',
    next: '다음',
    info: '정보 보기'
  },
  summary: {
    eyebrow: 'Selection Summary',
    extraRequestTitle: '추가 요청사항'
  }
} as const;
