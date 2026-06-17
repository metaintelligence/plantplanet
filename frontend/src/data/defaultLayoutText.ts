export const defaultLayoutText = {
  intro: {
    kicker: '현장에서 만나는 오늘의 식물',
    facts: {
      origin: '원산/분포',
      habitat: '서식 환경',
      size: '크기',
      season: '개화/관찰 시기'
    }
  },
  storytelling: {
    kicker: '식물과 함께 걷는 이야기'
  },
  quiz: {
    kicker: '숲길에서 만나는 짧은 퀴즈',
    hintTitle: '힌트',
    fallbackLead: (plantName: string) => `${plantName}의 특징을 떠올리며 답을 골라 보세요.`,
    fallbackQuestion: (plantName: string) => `${plantName}에서 가장 먼저 눈에 띄는 특징은 무엇일까요?`
  },
  mission: {
    code: 'MISSION',
    kicker: '현장에서 바로 해보는 관찰 미션',
    fallbackLead: (plantName: string) => `${plantName} 앞에서 차례대로 관찰 미션을 수행해 보세요.`
  }
} as const;
