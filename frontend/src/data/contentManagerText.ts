export const contentManagerText = {
  header: {
    eyebrow: 'Content Library',
    title: '콘텐츠 관리',
    description: '로컬 서버 파일로 저장된 모든 콘텐츠를 조회하고 관리합니다.',
    create: '콘텐츠 생성'
  },
  empty: {
    title: '생성된 콘텐츠가 없습니다.',
    description: '생성 마법사에서 첫 콘텐츠를 만들면 이 목록에 표시됩니다.',
    create: '새 콘텐츠 만들기'
  },
  status: {
    published: '게시됨'
  },
  actions: {
    open: '보기',
    history: '작업 이력',
    delete: '삭제',
    close: '닫기'
  },
  history: {
    eyebrow: 'History',
    title: '작업 이력',
    description: (contentTitle: string) => `${contentTitle}의 생성 및 AI 수정 작업 기록입니다.`,
    fields: {
      contentName: '콘텐츠명',
      plant: '대상 식물',
      template: '유형'
    },
    emptyTitle: '아직 작업 이력이 없습니다.',
    emptyDescription: '이 콘텐츠에 대한 생성 또는 수정 작업이 기록되면 여기에서 확인할 수 있습니다.'
  }
} as const;
