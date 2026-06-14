import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { GeneratedContent, PlantRecord } from '../../types/content';

interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}

type QuizQuestion = {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export default function GeneratedLayoutContentMqdvzrjq({
  content,
  plant,
}: GeneratedLayoutProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const settings = content.settings;
  const usesKorean = settings.languages.includes('ko');

  const audienceLabels: Record<string, string> = {
    children: '어린이',
    adults: '성인',
    foreigners: '외국인',
  };

  const seasonLabels: Record<string, string> = {
    spring: '봄',
    summer: '여름',
    autumn: '가을',
    winter: '겨울',
    auto: '오늘',
  };

  const focusLabels: Record<string, string> = {
    nameOrigin: '이름의 비밀',
    cultureHistory: '사람과 식물 이야기',
    appearance: '생김새 관찰',
    ecology: '생태 관찰',
    usage: '쓰임새',
    conservation: '보전 이야기',
    comparison: '비슷한 식물 비교',
    funFacts: '재미있는 발견',
  };

  const selectedSeason = seasonLabels[settings.season] ?? '오늘';
  const audience = settings.audience.map((item) => audienceLabels[item] ?? '방문객').join(', ');
  const focusTopics = settings.focusTopics
    .map((item) => focusLabels[item] ?? '관찰 주제')
    .slice(0, 2);

  const questions = useMemo<QuizQuestion[]>(() => {
    const primaryFeature = plant.features[0] ?? '오랫동안 눈에 띄는 꽃';
    const secondFeature = plant.features[1] ?? '새 꽃이 이어서 피는 특징';
    const firstTip = plant.observationTips[0] ?? '꽃의 색과 모양을 살펴보기';
    const secondTip = plant.observationTips[1] ?? '오늘 핀 꽃을 찾아보기';
    const springHint =
      plant.seasonHighlights.spring ??
      plant.seasonHighlights.auto ??
      '새잎과 꽃눈이 자라는 모습을 볼 수 있습니다.';

    return [
      {
        question: `${plant.koreanName}를 만나면 먼저 무엇을 살펴보면 좋을까요?`,
        choices: [firstTip, '잎을 만지며 세게 흔들기', '가지 이름표를 떼어 보기'],
        correctIndex: 0,
        explanation: `좋아요. ${firstTip}는 가까이 가지 않아도 할 수 있는 안전한 관찰이에요.`,
      },
      {
        question: `${plant.koreanName} 꽃의 큰 특징은 무엇일까요?`,
        choices: ['겨울에만 한 번 피어요', primaryFeature, '꽃이 전혀 피지 않아요'],
        correctIndex: 1,
        explanation: `${plant.koreanName}는 ${primaryFeature}로 기억하면 쉬워요. ${secondFeature}도 함께 찾아보세요.`,
      },
      {
        question: `${selectedSeason}에 ${plant.koreanName}에서 볼 수 있는 변화는 무엇일까요?`,
        choices: [springHint, '물속에서만 자라는 잎', '솔방울처럼 생긴 큰 열매만 보기'],
        correctIndex: 0,
        explanation: `${selectedSeason}에는 ${springHint} 작은 변화도 천천히 보면 잘 보여요.`,
      },
      {
        question: `${plant.koreanName}의 이름과 사람들의 기억을 연결하면 어떤 설명이 맞을까요?`,
        choices: [
          `${plant.commonName}라는 영어 이름도 있고, 우리에게는 문화적 의미가 큰 꽃이에요`,
          '식물 이름은 모두 한 가지 언어로만 불러야 해요',
          `${plant.scientificName}은 꽃 색을 매일 바꾸라는 뜻이에요`,
        ],
        correctIndex: 0,
        explanation: `${plant.conservationMessage} 이름은 외우기보다 식물과 사람이 맺은 이야기를 떠올리는 단서예요.`,
      },
    ];
  }, [plant, selectedSeason]);

  const observationHints = [
    plant.observationTips[0],
    plant.observationTips[1],
    `${plant.family} 식물이라는 점도 살짝 기억해 보기`,
  ].filter(Boolean).slice(0, 3);

  const authoredNotes = content.sections
    .map((section) => ({
      title: section.title,
      body: section.body,
      items: section.items,
    }))
    .filter((section) => section.title || section.body)
    .slice(0, 2);

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.reduce(
    (total, question, index) => total + (answers[index] === question.correctIndex ? 1 : 0),
    0,
  );

  return (
    <main className="ai-generated-layout" style={styles.page}>
      <section className="ai-generated-hero" style={styles.hero}>
        <div style={styles.heroText}>
          <p className="layout-kicker" style={styles.kicker}>
            {usesKorean ? `${audience}를 위한 ${focusTopics.join(' · ')} 퀴즈` : 'Garden quiz'}
          </p>
          <h1 style={styles.title}>{plant.koreanName} 시간여행 퀴즈</h1>
          <p style={styles.mission}>
            1분 동안 꽃의 이름, 봄의 변화, 사람들과 이어진 이야기를 찾아보세요.
          </p>
          <div className="ai-generated-chip-row" style={styles.chipRow}>
            <span style={styles.chip}>퀴즈 시작</span>
            <span style={styles.chip}>{selectedSeason} 관찰</span>
            <span style={styles.chip}>{plant.floweringSeason} 개화</span>
          </div>
        </div>
        <figure style={styles.figure}>
          <img src={plant.image.url} alt={plant.image.alt} style={styles.image} />
          <figcaption style={styles.caption}>{plant.koreanName}를 멀리서 먼저 관찰해 보세요.</figcaption>
        </figure>
      </section>

      <section style={styles.quizHeader}>
        <div>
          <p style={styles.sectionKicker}>오늘의 도전</p>
          <h2 style={styles.sectionTitle}>맞히면 바로 이유가 보여요</h2>
        </div>
        <div style={styles.scoreBox}>
          {answeredCount}/{questions.length} 완료 · 정답 {correctCount}
        </div>
      </section>

      <section style={styles.quizList} aria-label={`${plant.koreanName} 관찰 퀴즈`}>
        {questions.map((question, questionIndex) => {
          const selectedAnswer = answers[questionIndex];
          const hasAnswered = selectedAnswer !== undefined;

          return (
            <article key={question.question} className="ai-generated-section-card" style={styles.quizCard}>
              <div style={styles.questionNumber}>{questionIndex + 1}</div>
              <h3 style={styles.question}>{question.question}</h3>
              <div style={styles.choiceList}>
                {question.choices.map((choice, choiceIndex) => {
                  const isSelected = selectedAnswer === choiceIndex;
                  const isCorrect = question.correctIndex === choiceIndex;
                  const showCorrect = hasAnswered && isCorrect;
                  const showWrong = hasAnswered && isSelected && !isCorrect;

                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [questionIndex]: choiceIndex,
                        }))
                      }
                      style={{
                        ...styles.choiceButton,
                        ...(showCorrect ? styles.choiceCorrect : {}),
                        ...(showWrong ? styles.choiceWrong : {}),
                        ...(isSelected && !showCorrect && !showWrong ? styles.choiceSelected : {}),
                      }}
                      aria-pressed={isSelected}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {hasAnswered ? (
                <p
                  style={{
                    ...styles.feedback,
                    ...(selectedAnswer === question.correctIndex
                      ? styles.feedbackCorrect
                      : styles.feedbackWrong),
                  }}
                >
                  {selectedAnswer === question.correctIndex ? '정답이에요. ' : '괜찮아요, 다시 기억해 봐요. '}
                  {question.explanation}
                </p>
              ) : null}
            </article>
          );
        })}
      </section>

      <section className="ai-generated-focus-band" style={styles.hintBand}>
        <div>
          <p style={styles.hintBandKicker}>퀴즈 뒤에 해 보기</p>
          <h2 style={styles.hintBandTitle}>짧은 관찰 미션</h2>
        </div>
        <div style={styles.hintGrid}>
          {observationHints.map((hint) => (
            <p key={hint} style={styles.hint}>
              {hint}
            </p>
          ))}
        </div>
      </section>

      {authoredNotes.length > 0 ? (
        <section className="ai-generated-section-grid" style={styles.noteGrid}>
          {authoredNotes.map((section) => (
            <article key={`${section.title}-${section.body}`} style={styles.noteCard}>
              <h2 style={styles.noteTitle}>{section.title}</h2>
              <p style={styles.noteBody}>{section.body}</p>
              {section.items && section.items.length > 0 ? (
                <ul style={styles.noteList}>
                  {section.items.slice(0, 2).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      <section style={styles.closing}>
        <h2 style={styles.closingTitle}>정원에서의 약속</h2>
        <p style={styles.closingText}>{plant.conservationMessage}</p>
        <p style={styles.closingText}>
          꽃과 잎은 눈으로 살피고, 벌과 나비는 멀리서 기다려 주세요.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    background: '#f7f3ea',
    color: '#1f2a20',
    minHeight: '100%',
    padding: 'clamp(18px, 4vw, 40px)',
    fontFamily:
      'Pretendard, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
    gap: 'clamp(20px, 4vw, 40px)',
    alignItems: 'center',
    maxWidth: 1080,
    margin: '0 auto',
    padding: 'clamp(20px, 4vw, 42px)',
    background: '#ffffff',
    border: '1px solid #d8dfcd',
    borderRadius: 8,
    boxShadow: '0 18px 42px rgba(31, 42, 32, 0.12)',
  },
  heroText: {
    minWidth: 0,
  },
  kicker: {
    color: '#526238',
    fontSize: 14,
    fontWeight: 800,
    margin: '0 0 10px',
  },
  title: {
    color: '#172018',
    fontSize: 'clamp(34px, 7vw, 64px)',
    lineHeight: 1.02,
    letterSpacing: 0,
    margin: 0,
  },
  mission: {
    color: '#354338',
    fontSize: 'clamp(17px, 2.4vw, 22px)',
    lineHeight: 1.55,
    margin: '18px 0 0',
    maxWidth: 620,
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 22,
  },
  chip: {
    background: '#23472c',
    color: '#ffffff',
    borderRadius: 999,
    padding: '9px 13px',
    fontSize: 14,
    fontWeight: 800,
  },
  figure: {
    margin: 0,
  },
  image: {
    width: '100%',
    aspectRatio: '4 / 3',
    objectFit: 'cover',
    borderRadius: 8,
    display: 'block',
    border: '1px solid #bfc9b2',
  },
  caption: {
    color: '#405044',
    fontSize: 14,
    lineHeight: 1.45,
    marginTop: 9,
  },
  quizHeader: {
    maxWidth: 1080,
    margin: '22px auto 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    gap: 16,
    flexWrap: 'wrap',
  },
  sectionKicker: {
    color: '#66702d',
    fontSize: 13,
    fontWeight: 900,
    margin: '0 0 5px',
  },
  sectionTitle: {
    color: '#172018',
    fontSize: 'clamp(22px, 4vw, 32px)',
    lineHeight: 1.15,
    margin: 0,
  },
  scoreBox: {
    background: '#172018',
    color: '#ffffff',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 15,
    fontWeight: 800,
  },
  quizList: {
    maxWidth: 1080,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
    gap: 14,
  },
  quizCard: {
    position: 'relative',
    background: '#ffffff',
    border: '1px solid #d8dfcd',
    borderRadius: 8,
    padding: '20px 18px 18px',
    minHeight: 310,
  },
  questionNumber: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#d94e36',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 900,
    marginBottom: 12,
  },
  question: {
    color: '#1c251d',
    fontSize: 19,
    lineHeight: 1.35,
    margin: '0 0 14px',
  },
  choiceList: {
    display: 'grid',
    gap: 9,
  },
  choiceButton: {
    width: '100%',
    border: '2px solid #23472c',
    background: '#ffffff',
    color: '#172018',
    borderRadius: 8,
    padding: '12px 13px',
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 1.35,
    textAlign: 'left',
    cursor: 'pointer',
  },
  choiceSelected: {
    background: '#e9f0df',
  },
  choiceCorrect: {
    background: '#1f6b3a',
    borderColor: '#1f6b3a',
    color: '#ffffff',
  },
  choiceWrong: {
    background: '#b7352a',
    borderColor: '#b7352a',
    color: '#ffffff',
  },
  feedback: {
    borderRadius: 8,
    padding: '11px 12px',
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.5,
    margin: '13px 0 0',
  },
  feedbackCorrect: {
    background: '#e2f2df',
    color: '#173d21',
  },
  feedbackWrong: {
    background: '#fde7df',
    color: '#6c1f18',
  },
  hintBand: {
    maxWidth: 1080,
    margin: '18px auto 0',
    background: '#27341f',
    color: '#ffffff',
    borderRadius: 8,
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
    gap: 18,
  },
  hintGrid: {
    display: 'grid',
    gap: 10,
  },
  hintBandKicker: {
    color: '#dce9bf',
    fontSize: 13,
    fontWeight: 900,
    margin: '0 0 5px',
  },
  hintBandTitle: {
    color: '#ffffff',
    fontSize: 'clamp(22px, 4vw, 32px)',
    lineHeight: 1.15,
    margin: 0,
  },
  hint: {
    background: '#ffffff',
    color: '#172018',
    borderRadius: 8,
    padding: '12px 13px',
    margin: 0,
    fontSize: 15,
    fontWeight: 800,
    lineHeight: 1.45,
  },
  noteGrid: {
    maxWidth: 1080,
    margin: '14px auto 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
    gap: 12,
  },
  noteCard: {
    background: '#fffaf0',
    border: '1px solid #dacba7',
    borderRadius: 8,
    padding: 16,
  },
  noteTitle: {
    color: '#1d261e',
    fontSize: 18,
    margin: '0 0 8px',
  },
  noteBody: {
    color: '#374235',
    fontSize: 15,
    lineHeight: 1.55,
    margin: 0,
  },
  noteList: {
    color: '#374235',
    margin: '10px 0 0',
    paddingLeft: 20,
    fontSize: 14,
    lineHeight: 1.5,
  },
  closing: {
    maxWidth: 1080,
    margin: '14px auto 0',
    background: '#ffffff',
    border: '1px solid #d8dfcd',
    borderRadius: 8,
    padding: '18px 20px',
  },
  closingTitle: {
    color: '#172018',
    fontSize: 22,
    margin: '0 0 8px',
  },
  closingText: {
    color: '#334034',
    fontSize: 16,
    lineHeight: 1.55,
    margin: '6px 0 0',
  },
};
