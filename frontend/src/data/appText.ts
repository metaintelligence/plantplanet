export const appText = {
  errors: {
    loadMockDbFailed: 'mock_db.json을 불러오지 못했습니다.',
    loadMockDbFallback: '목업 식물 데이터를 불러오지 못했습니다.',
    loadServerDataFallback: '서버 데이터를 불러오지 못했습니다.',
    loadingPlants: '식물 데이터를 불러오는 중입니다.',
    requestFailed: (status: number) => `요청에 실패했습니다. (${status})`
  },
  blocked: {
    title: '새 요청을 시작할 수 없습니다',
    withActiveJob: (title: string) => `"${title}" 작업이 진행 중입니다. 완료 후 다시 시도해 주세요.`,
    generic: '진행 중인 생성 작업이 있어 완료 후 다시 시도해 주세요.'
  },
  socket: {
    timeout: '20분 안에 로컬 생성 서버 완료 응답을 받지 못했습니다.',
    connectionFailed: '로컬 생성 서버 WebSocket에 연결하지 못했습니다.',
    closedBeforeComplete: '로컬 생성 서버 연결이 작업 완료 전에 종료되었습니다.'
  },
  generation: {
    defaultLayoutSavedTitle: '기본 레이아웃 저장 완료',
    defaultLayoutSavedMessage: (title: string) => `${title} 콘텐츠가 서버 파일로 저장되었습니다.`,
    socketQueuedMessage: '로컬 생성 서버 연결을 준비하고 있습니다.',
    socketOpenMessage: '로컬 생성 서버로 설정 JSON을 전송했습니다.',
    defaultServerErrorMessage: '로컬 생성 서버에서 페이지 생성 중 오류가 발생했습니다.',
    startedStatus: '백그라운드에서 페이지 생성 작업이 시작되었습니다.',
    startedTitle: '생성 작업 시작',
    startedMessage: (title: string) => `${title} 페이지를 백그라운드에서 생성하고 있습니다.`,
    completedFallback: 'CLI 페이지 생성과 프론트엔드 빌드가 완료되었습니다.',
    completedTitle: '페이지 생성 완료',
    completedMessage: (title: string) => `${title} 생성이 완료되었습니다. 최신 페이지 반영을 위해 곧 새로고침합니다.`,
    failedFallback: '페이지 생성 작업이 실패했습니다.',
    requestFailedFallback: '페이지 생성 요청을 시작하지 못했습니다.'
  },
  revision: {
    queuedMessage: '로컬 생성 서버 연결을 준비하고 있습니다.',
    socketOpenMessage: '로컬 생성 서버로 수정 요청을 전송했습니다.',
    defaultServerErrorMessage: '로컬 생성 서버에서 페이지 수정 중 오류가 발생했습니다.',
    startedStatus: '백그라운드에서 페이지 수정 작업이 시작되었습니다.',
    startedTitle: '수정 작업 시작',
    startedMessage: (title: string) => `${title} 페이지를 백그라운드에서 수정하고 있습니다.`,
    blockedTitle: '수정 요청 불가',
    blockedMessage: (title: string) => `"${title}" 작업이 진행 중입니다. 완료 후 다시 요청해 주세요.`,
    completedFallback: 'CLI 페이지 수정과 프론트엔드 빌드가 완료되었습니다.',
    completedTitle: '페이지 수정 완료',
    completedMessage: (title: string) => `${title} 수정이 완료되었습니다. 최신 페이지 반영을 위해 곧 새로고침합니다.`,
    failedFallback: '페이지 수정 작업이 실패했습니다.',
    requestFailedFallback: '페이지 수정 요청을 시작하지 못했습니다.',
    timeoutTitle: '수정 시간 초과',
    failedTitle: '수정 실패'
  },
  retry: {
    missingTitle: '재생성 요청 실패',
    missingMessage: (title: string) => `"${title}" 콘텐츠 원본을 찾지 못했습니다. 콘텐츠 목록을 확인해 주세요.`,
    startedTitle: '재생성 요청',
    startedMessage: (title: string) => `${title} 페이지 생성을 다시 시도합니다.`,
    failedTitle: '재생성 요청 실패',
    failedFallback: '페이지 재생성 요청을 시작하지 못했습니다.'
  },
  deletion: {
    confirm: '이 콘텐츠를 삭제할까요?',
    failedTitle: '삭제 실패',
    failedFallback: '콘텐츠를 삭제하지 못했습니다.'
  },
  statusTitles: {
    generationTimeout: '생성 시간 초과',
    generationFailed: '생성 실패'
  }
} as const;
