import { useState } from 'react';
import type { GeneratedContent, PlantRecord } from '../../types/content';

interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}

type QuizQuestion = {
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
};

const quizQuestions: QuizQuestion[] = [
  {
    question: '무궁화 꽃은 언제 가장 오래 만날 수 있을까요?',
    choices: ['봄이 시작될 때만', '여름부터 가을까지', '한겨울 눈 오는 날'],
    answer: 1,
    explanation:
      '맞아요. 무궁화는 7월부터 10월까지 큰 꽃을 이어서 피워요.',
  },
  {
    question: '무궁화를 가까이 볼 때 먼저 찾아볼 무늬는 무엇일까요?',
    choices: ['꽃 가운데의 진한 색', '잎 위의 하얀 가루', '줄기의 둥근 구멍'],
    answer: 0,
    explanation:
      '좋은 눈썰미예요. 무궁화는 꽃잎 가운데가 진한 색인 품종이 많아요.',
  },
  {
    question: '하루 동안 핀 꽃과 시든 꽃을 살필 때 알 수 있는 특징은?',
    choices: [
      '꽃이 하루씩 피고 져도 새 꽃이 계속 핀다',
      '꽃이 한 번 피면 겨울까지 그대로 있다',
      '꽃은 밤에만 잠깐 보인다',
    ],
    answer: 0,
    explanation:
      '정답이에요. 하루 꽃이 져도 새 꽃이 이어져 긴 시간 화사하게 보여요.',
  },
  {
    question: '공원에서 벌과 나비가 찾아온 무궁화를 볼 때 좋은 행동은?',
    choices: ['멀리서 조용히 관찰하기', '꽃가지를 흔들어 보기', '곤충을 손으로 잡아 보기'],
    answer: 0,
    explanation:
      '멋진 관찰 약속이에요. 꽃과 곤충을 지켜 주면 공원의 작은 생태도 함께 보호할 수 있어요.',
  },
];

export default function GeneratedLayoutContentMqgp6m9n({
  content,
  plant,
}: GeneratedLayoutProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    {},
  );

  const settings = content.settings;
  const seasonHint =
    plant.seasonHighlights[settings.season] ?? plant.seasonHighlights.auto;
  const answeredCount = Object.keys(selectedAnswers).length;
  const score = quizQuestions.reduce(
    (total, question, index) =>
      selectedAnswers[index] === question.answer ? total + 1 : total,
    0,
  );

  return (
    <article
      aria-labelledby="hibiscus-quiz-title"
      style={{
        width: '100%',
        maxWidth: '100%',
        minHeight: '100%',
        boxSizing: 'border-box',
        margin: 0,
        padding: '18px 14px 28px',
        background: '#fff7f4',
        color: '#241a18',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        wordBreak: 'keep-all',
        overflowWrap: 'break-word',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          minWidth: 0,
          boxSizing: 'border-box',
          margin: '0 auto',
          display: 'grid',
          gap: 18,
        }}
      >
        <header
          style={{
            minWidth: 0,
            boxSizing: 'border-box',
            display: 'grid',
            gap: 14,
          }}
        >
          <div
            style={{
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: 34,
                borderRadius: 999,
                padding: '6px 12px',
                background: '#ffe0dc',
                color: '#8d2f3d',
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              공원 꽃 탐정단
            </span>
            <span
              aria-label={`현재 ${answeredCount}문제 풀이 완료`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: 34,
                borderRadius: 999,
                padding: '6px 12px',
                background: '#2f5534',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {answeredCount}/{quizQuestions.length}개 해결
            </span>
          </div>

          <section
            style={{
              minWidth: 0,
              boxSizing: 'border-box',
              borderRadius: 8,
              padding: 16,
              background: '#ffffff',
              border: '1px solid #f1c5c1',
              boxShadow: '0 10px 24px rgba(117, 50, 50, 0.12)',
            }}
          >
            <p
              style={{
                margin: '0 0 8px',
                color: '#6e4743',
                fontSize: 15,
                fontWeight: 800,
                lineHeight: 1.35,
              }}
            >
              꽃잎 왕국의 오늘 문제
            </p>
            <h1
              id="hibiscus-quiz-title"
              style={{
                margin: 0,
                color: '#171413',
                fontSize: '34px',
                lineHeight: 1.12,
                letterSpacing: 0,
              }}
            >
              무궁화 퀴즈
            </h1>
            <p
              style={{
                margin: '10px 0 0',
                color: '#3d2d2a',
                fontSize: 18,
                lineHeight: 1.5,
                fontWeight: 700,
              }}
            >
              꽃 가운데 색, 새로 피는 꽃, 찾아오는 곤충을 보며 답을 골라
              보세요.
            </p>
          </section>

          <figure
            style={{
              margin: 0,
              minWidth: 0,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#e9c7c8',
                border: '1px solid #e6b8b3',
              }}
            >
              <img
                src={plant.image.url}
                alt={plant.image.alt}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <figcaption
              style={{
                marginTop: 6,
                color: '#6d605c',
                fontSize: 12,
                lineHeight: 1.35,
              }}
            >
              이미지: {plant.image.source}
            </figcaption>
          </figure>
        </header>

        <section
          aria-label="퀴즈 전 관찰 힌트"
          style={{
            minWidth: 0,
            boxSizing: 'border-box',
            display: 'grid',
            gap: 10,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: '#243b28',
              fontSize: 20,
              lineHeight: 1.25,
            }}
          >
            풀기 전 살짝 보기
          </h2>
          {[
            `무궁화는 ${plant.floweringSeason}에 꽃을 오래 보여 줘요.`,
            '꽃잎과 가운데 무늬 색이 어떻게 다른지 찾아보세요.',
            '벌과 나비는 만지지 말고 조금 떨어져서 지켜봐요.',
          ].map((hint) => (
            <p
              key={hint}
              style={{
                margin: 0,
                minWidth: 0,
                boxSizing: 'border-box',
                borderRadius: 8,
                padding: '12px 14px',
                background: '#eef7ea',
                border: '1px solid #c9dec4',
                color: '#233326',
                fontSize: 16,
                lineHeight: 1.45,
                fontWeight: 700,
              }}
            >
              {hint}
            </p>
          ))}
        </section>

        <main
          aria-label="무궁화 문제"
          style={{
            minWidth: 0,
            boxSizing: 'border-box',
            display: 'grid',
            gap: 14,
          }}
        >
          {quizQuestions.map((quiz, questionIndex) => {
            const selected = selectedAnswers[questionIndex];
            const isAnswered = selected !== undefined;

            return (
              <section
                key={quiz.question}
                style={{
                  minWidth: 0,
                  boxSizing: 'border-box',
                  borderRadius: 8,
                  padding: 14,
                  background: '#ffffff',
                  border: '1px solid #ead0c8',
                  boxShadow: '0 8px 20px rgba(72, 47, 38, 0.08)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 10px',
                    color: '#8d2f3d',
                    fontSize: 14,
                    fontWeight: 900,
                  }}
                >
                  {questionIndex + 1}번째 꽃잎 단서
                </p>
                <h2
                  style={{
                    margin: '0 0 12px',
                    color: '#1b1715',
                    fontSize: 21,
                    lineHeight: 1.32,
                    letterSpacing: 0,
                  }}
                >
                  {quiz.question}
                </h2>

                <div
                  style={{
                    minWidth: 0,
                    display: 'grid',
                    gap: 10,
                  }}
                >
                  {quiz.choices.map((choice, choiceIndex) => {
                    const isSelected = selected === choiceIndex;
                    const isCorrectChoice = quiz.answer === choiceIndex;
                    const showCorrect = isAnswered && isCorrectChoice;
                    const showWrong = isSelected && !isCorrectChoice;

                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() =>
                          setSelectedAnswers((current) => ({
                            ...current,
                            [questionIndex]: choiceIndex,
                          }))
                        }
                        aria-pressed={isSelected}
                        style={{
                          width: '100%',
                          maxWidth: '100%',
                          minHeight: 54,
                          minWidth: 0,
                          boxSizing: 'border-box',
                          borderRadius: 8,
                          border: showCorrect
                            ? '2px solid #2f7d3c'
                            : showWrong
                              ? '2px solid #b43c3c'
                              : '1px solid #d7bbb2',
                          padding: '12px 14px',
                          background: showCorrect
                            ? '#e4f6df'
                            : showWrong
                              ? '#ffe8e5'
                              : isSelected
                                ? '#fff0d6'
                                : '#fffaf6',
                          color: '#211816',
                          font: 'inherit',
                          fontSize: 17,
                          fontWeight: 800,
                          lineHeight: 1.35,
                          textAlign: 'left',
                          cursor: 'pointer',
                          touchAction: 'manipulation',
                        }}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {isAnswered ? (
                  <div
                    role="status"
                    style={{
                      marginTop: 12,
                      minWidth: 0,
                      boxSizing: 'border-box',
                      borderRadius: 8,
                      padding: '12px 14px',
                      background:
                        selected === quiz.answer ? '#ecf8e9' : '#fff3e1',
                      border:
                        selected === quiz.answer
                          ? '1px solid #b6dcae'
                          : '1px solid #efd1a4',
                      color: '#233326',
                      fontSize: 16,
                      lineHeight: 1.45,
                      fontWeight: 700,
                    }}
                  >
                    <strong>
                      {selected === quiz.answer ? '정답이에요! ' : '다시 볼까요? '}
                    </strong>
                    {quiz.explanation}
                  </div>
                ) : null}
              </section>
            );
          })}
        </main>

        <section
          aria-label="마무리"
          style={{
            minWidth: 0,
            boxSizing: 'border-box',
            borderRadius: 8,
            padding: 16,
            background: '#263d2a',
            color: '#ffffff',
          }}
        >
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: 22,
              lineHeight: 1.25,
              letterSpacing: 0,
            }}
          >
            {answeredCount === quizQuestions.length
              ? `꽃잎 점수 ${score}/${quizQuestions.length}`
              : '마지막 약속'}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.55,
              fontWeight: 700,
            }}
          >
            {seasonHint} 무궁화는 나라꽃으로 잘 알려진 식물이에요. 꽃을
            꺾지 않고 눈으로 살피면, 다음 친구도 같은 꽃 이야기를 만날 수
            있어요.
          </p>
        </section>
      </div>
    </article>
  );
}
