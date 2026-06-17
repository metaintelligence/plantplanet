export const dashboardText = {
  intro: {
    eyebrow: 'HanGarden',
    title: '생성형 AI 기반 식물해설 콘텐츠 관리자',
    description:
      'HanGarden은 수목원 식물 데이터와 관람객 맥락을 조합해 모바일, 키오스크, 정적 포스터 환경에 맞는 해설 콘텐츠를 생성하고 관리하는 데모 플랫폼입니다.',
    create: '새 콘텐츠 만들기',
    manage: '콘텐츠 목록 보기'
  },
  lockedNotice: (title: string) =>
    `현재 "${title}" 작업이 진행 중입니다. 완료 전까지는 새 페이지 생성 요청을 시작할 수 없습니다.`,
  metrics: {
    plants: '목업 식물 데이터',
    created: '생성 콘텐츠',
    published: '게시 콘텐츠',
    running: '진행 중 요청'
  },
  mockDb: {
    eyebrow: 'Mock DB',
    title: '식물 데이터 조회'
  },
  recent: {
    eyebrow: 'Recent',
    title: '최근 콘텐츠',
    emptyTitle: '아직 생성된 콘텐츠가 없습니다.',
    emptyDescription: '콘텐츠 생성 마법사를 시작해 첫 페이지를 만들어보세요.',
    published: '게시됨',
    draft: '초안'
  },
  jobs: {
    eyebrow: 'Generation Queue',
    title: '요청 작업 현황',
    create: '새 요청',
    emptyTitle: '아직 요청된 생성 작업이 없습니다.',
    emptyDescription: '콘텐츠 생성 마법사를 완료하면 여기에서 작업 상태를 확인할 수 있습니다.'
  }
} as const;
