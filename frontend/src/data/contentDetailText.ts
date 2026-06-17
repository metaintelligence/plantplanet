export const contentDetailText = {
  missing: {
    title: '콘텐츠를 찾을 수 없습니다.',
    description: '서버 파일에 없는 콘텐츠이거나 생성 데이터가 변경되었습니다.',
    back: '콘텐츠 관리로 이동'
  },
  header: {
    eyebrow: 'Generated Page',
    description: '생성된 콘텐츠는 아래 주소로 연결됩니다.',
    back: '목록',
    revise: 'AI 수정 요청',
    reviseTitle: '생성형 AI 레이아웃 파일에 수정 요청을 보냅니다.',
    reviseDisabledTitle: '기본 레이아웃 콘텐츠는 AI 수정 대상이 아닙니다.'
  },
  preview: {
    eyebrow: 'Preview',
    openSettings: '생성값 보기',
    zoomAria: (label: string) => `${label} 미리보기 배율`,
    previewAria: (label: string) => `${label} 콘텐츠 미리보기`
  },
  settingsDialog: {
    eyebrow: 'Generation Settings',
    title: '생성값 보기',
    close: '닫기',
    description: (contentTitle: string) => `${contentTitle} 생성 시 선택한 설정 요약입니다.`,
    extraRequestTitle: '추가 요청사항'
  },
  revisionDialog: {
    eyebrow: 'Revision Request',
    title: '페이지 수정 요청',
    description: '생성된 레이아웃에 반영할 수정 방향을 자연어로 입력해 주세요.',
    fieldLabel: '수정 요청 텍스트',
    placeholder: '예: 첫 화면 제목을 더 크게 바꾸고 퀴즈 버튼 간격을 넓혀 주세요.',
    cancel: '취소',
    submit: '수정 요청 보내기',
    emptyPrompt: '수정 요청 내용을 입력해 주세요.',
    failedFallback: '수정 요청을 시작하지 못했습니다.'
  }
} as const;
