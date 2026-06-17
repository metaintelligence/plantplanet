import type { GeneratedContent, PlantRecord } from '../../types/content';

interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}

const categoryLabel: Record<PlantRecord['category'], string> = {
  tree: '나무',
  shrub: '관목',
  herb: '풀',
};

export default function GeneratedLayoutContentMqh2egpz({
  content,
  plant,
}: GeneratedLayoutProps) {
  const settings = content.settings;
  const seasonMessage =
    plant.seasonHighlights[settings.season] ?? plant.seasonHighlights.auto;

  const storyScenes = [
    {
      time: '아침',
      title: '동그란 잎이 물 위로 고개를 들어요',
      body: '연꽃 잎은 연못 물 위로 높이 올라와 햇빛을 받습니다. 잎 위에 맺힌 물방울은 또르르 굴러 작은 구슬처럼 빛납니다.',
    },
    {
      time: '한낮',
      title: '큰 꽃이 정원에 분홍 불빛을 켜요',
      body: `${plant.floweringSeason}에는 큰 분홍색 또는 흰색 꽃이 활짝 피어 수변 정원을 환하게 만듭니다.`,
    },
    {
      time: '오후',
      title: '연못 친구들이 조용히 모여요',
      body: '연꽃이 사는 습지는 물, 곤충, 식물이 함께 기대어 사는 자리입니다. 가까이서 만지기보다 한 걸음 떨어져 살펴보면 더 많은 움직임이 보입니다.',
    },
    {
      time: '저녁',
      title: '샤워기 모양 연밥이 내일을 준비해요',
      body: '꽃이 지난 자리에는 구멍이 송송 난 연밥이 남습니다. 그 안의 씨앗은 다음 계절 이야기를 품고 있습니다.',
    },
  ];

  const observationNotes = [
    '잎 표면에 물방울이 어떻게 맺히는지 보기',
    '꽃과 잎이 물 위로 올라온 높이 비교하기',
    '연밥의 구멍 배열을 천천히 살펴보기',
  ];

  return (
    <article
      aria-labelledby="lotus-story-title"
      style={{
        boxSizing: 'border-box',
        width: '100%',
        minHeight: '100svh',
        margin: 0,
        padding: 'clamp(22px, 3.4vw, 44px)',
        background:
          'linear-gradient(135deg, #fff7fb 0%, #edf8f1 46%, #f8fbff 100%)',
        color: '#1f2b27',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        wordBreak: 'keep-all',
        overflowWrap: 'break-word',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: 1500,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(360px, 0.95fr) minmax(480px, 1.05fr)',
          gap: 'clamp(22px, 3vw, 42px)',
          alignItems: 'stretch',
        }}
      >
        <section
          aria-label="연꽃 이야기 시작"
          style={{
            minWidth: 0,
            display: 'grid',
            gridTemplateRows: 'auto minmax(280px, 1fr) auto',
            gap: 16,
          }}
        >
          <header
            style={{
              minWidth: 0,
              borderRadius: 8,
              padding: '22px 24px',
              background: 'rgba(255, 255, 255, 0.78)',
              border: '1px solid rgba(75, 118, 101, 0.2)',
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                color: '#436d5f',
                fontSize: 18,
                lineHeight: 1.25,
                fontWeight: 800,
              }}
            >
              HanGarden 물가 정원에서 만나는 {categoryLabel[plant.category]}
            </p>
            <h1
              id="lotus-story-title"
              style={{
                margin: 0,
                color: '#17241f',
                fontSize: 'clamp(48px, 6vw, 84px)',
                lineHeight: 1,
                letterSpacing: 0,
              }}
            >
              연꽃의 하루
            </h1>
            <p
              style={{
                margin: '12px 0 0',
                color: '#65736d',
                fontSize: 20,
                lineHeight: 1.25,
                fontStyle: 'italic',
                fontWeight: 700,
              }}
            >
              {plant.scientificName}
            </p>
          </header>

          <figure
            style={{
              minWidth: 0,
              margin: 0,
              display: 'grid',
              gridTemplateRows: '1fr auto',
              gap: 8,
            }}
          >
            <div
              style={{
                minHeight: 0,
                aspectRatio: '4 / 3',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#d8efe5',
                border: '1px solid rgba(75, 118, 101, 0.22)',
                boxShadow: '0 18px 42px rgba(52, 90, 78, 0.16)',
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
                color: '#64736d',
                fontSize: 12,
                lineHeight: 1.35,
              }}
            >
              이미지: {plant.image.source}
            </figcaption>
          </figure>

          <section
            aria-label="오늘의 한 문장"
            style={{
              borderRadius: 8,
              padding: '18px 20px',
              background: '#24483f',
              color: '#fffdf8',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(20px, 2vw, 28px)',
                lineHeight: 1.34,
                fontWeight: 900,
              }}
            >
              물 위로 올라온 잎과 꽃을 따라가면, 작은 연못이 하나의
              살아있는 정원처럼 보입니다.
            </p>
          </section>
        </section>

        <main
          style={{
            minWidth: 0,
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            gap: 16,
          }}
        >
          <section
            aria-label="연꽃 기본 이야기"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: 12,
            }}
          >
            <div
              style={{
                minWidth: 0,
                borderRadius: 8,
                padding: '18px 20px',
                background: 'rgba(255, 255, 255, 0.82)',
                border: '1px solid rgba(75, 118, 101, 0.18)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 8px',
                  color: '#20352f',
                  fontSize: 26,
                  lineHeight: 1.15,
                }}
              >
                어디에 살까요?
              </h2>
              <p
                style={{
                  margin: 0,
                  color: '#30433e',
                  fontSize: 18,
                  lineHeight: 1.45,
                  fontWeight: 700,
                }}
              >
                연꽃은 연못과 늪처럼 물이 고인 습지를 좋아합니다. 따뜻한
                아시아와 오세아니아의 물가에서 오래 살아온 수생식물입니다.
              </p>
            </div>
            <div
              style={{
                minWidth: 0,
                borderRadius: 8,
                padding: '18px 20px',
                background: '#fff4f8',
                border: '1px solid rgba(178, 102, 133, 0.2)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 8px',
                  color: '#57304a',
                  fontSize: 26,
                  lineHeight: 1.15,
                }}
              >
                얼마나 클까요?
              </h2>
              <p
                style={{
                  margin: 0,
                  color: '#4a3543',
                  fontSize: 18,
                  lineHeight: 1.45,
                  fontWeight: 700,
                }}
              >
                잎은 아이 얼굴보다 훨씬 큰 30~60cm까지 자라고, 꽃도
                10~25cm로 큼직하게 피어납니다.
              </p>
            </div>
          </section>

          <section
            aria-label="연꽃의 하루 장면"
            style={{
              minWidth: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 12,
            }}
          >
            {storyScenes.map((scene) => (
              <section
                key={scene.time}
                style={{
                  minWidth: 0,
                  borderRadius: 8,
                  padding: '18px 18px 16px',
                  background: 'rgba(255, 255, 255, 0.86)',
                  border: '1px solid rgba(75, 118, 101, 0.18)',
                }}
              >
                <p
                  style={{
                    display: 'inline-flex',
                    margin: '0 0 10px',
                    borderRadius: 999,
                    padding: '5px 10px',
                    background: '#e3f2ea',
                    color: '#315f50',
                    fontSize: 14,
                    lineHeight: 1.2,
                    fontWeight: 900,
                  }}
                >
                  {scene.time}
                </p>
                <h2
                  style={{
                    margin: '0 0 8px',
                    color: '#17241f',
                    fontSize: 23,
                    lineHeight: 1.22,
                    letterSpacing: 0,
                  }}
                >
                  {scene.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: '#344640',
                    fontSize: 17,
                    lineHeight: 1.42,
                    fontWeight: 700,
                  }}
                >
                  {scene.body}
                </p>
              </section>
            ))}
          </section>

          <section
            aria-label="관찰과 보전 안내"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <div
              style={{
                minWidth: 0,
                borderRadius: 8,
                padding: '18px 20px',
                background: '#fffdf3',
                border: '1px solid rgba(167, 139, 72, 0.24)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 10px',
                  color: '#4c4327',
                  fontSize: 25,
                  lineHeight: 1.18,
                }}
              >
                눈으로 찾아볼 것
              </h2>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'grid',
                  gap: 8,
                }}
              >
                {observationNotes.map((note) => (
                  <li
                    key={note}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '14px 1fr',
                      gap: 9,
                      alignItems: 'start',
                      color: '#3e3a28',
                      fontSize: 17,
                      lineHeight: 1.34,
                      fontWeight: 800,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 10,
                        height: 10,
                        marginTop: 7,
                        borderRadius: 999,
                        background: '#d783a8',
                      }}
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                minWidth: 0,
                borderRadius: 8,
                padding: '18px 20px',
                background: '#eaf6f1',
                border: '1px solid rgba(75, 118, 101, 0.22)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 10px',
                  color: '#21493f',
                  fontSize: 25,
                  lineHeight: 1.18,
                }}
              >
                정원의 약속
              </h2>
              <p
                style={{
                  margin: 0,
                  color: '#2f4740',
                  fontSize: 17,
                  lineHeight: 1.42,
                  fontWeight: 800,
                }}
              >
                {seasonMessage} 물가 식물이 편히 살 수 있도록 물속에 손을
                넣거나 잎을 꺾지 말고, 연못 가장자리에서 조용히 바라봐 주세요.
              </p>
            </div>
          </section>
        </main>
      </div>
    </article>
  );
}
