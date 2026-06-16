import type { GeneratedContent, PlantRecord } from '../../types/content';

interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}

const categoryLabel: Record<PlantRecord['category'], string> = {
  tree: '나무',
  shrub: '관목',
  herb: '초본',
};

export default function GeneratedLayoutContentMqgk310v({
  content,
  plant,
}: GeneratedLayoutProps) {
  const settings = content.settings;
  const seasonKey = settings.season;
  const seasonText =
    plant.seasonHighlights[seasonKey] ?? plant.seasonHighlights.auto;
  const mainFeatures = plant.features.slice(0, 3);
  const observationTips = [
    '부채처럼 펼쳐진 잎맥을 가까이 살펴보세요.',
    '잎끝이 살짝 갈라지는 모양을 찾아보세요.',
    '넓은 그늘이 정원 길의 열기를 어떻게 낮추는지 느껴보세요.',
  ];

  return (
    <article
      aria-labelledby="ginkgo-title"
      style={{
        boxSizing: 'border-box',
        minHeight: 'min(1080px, 100svh)',
        padding: 'clamp(28px, 4vw, 56px)',
        background:
          'linear-gradient(135deg, #f7f3df 0%, #edf5df 45%, #fdfaf0 100%)',
        color: '#1d2a1f',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        wordBreak: 'keep-all',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(420px, 0.9fr) minmax(520px, 1.1fr)',
          gap: 'clamp(28px, 4vw, 64px)',
          alignItems: 'stretch',
          maxWidth: 1760,
          margin: '0 auto',
        }}
      >
        <section
          aria-label="은행나무 대표 이미지"
          style={{
            minWidth: 0,
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            gap: 18,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: 'fit-content',
              borderRadius: 999,
              padding: '8px 14px',
              background: 'rgba(63, 103, 55, 0.14)',
              color: '#355b2f',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            정원에서 만나는 오래 사는 {categoryLabel[plant.category]}
          </div>

          <figure style={{ margin: 0, minWidth: 0 }}>
            <div
              style={{
                overflow: 'hidden',
                borderRadius: 28,
                border: '1px solid rgba(67, 86, 55, 0.22)',
                boxShadow: '0 24px 60px rgba(48, 67, 42, 0.18)',
                background: '#d8dfc4',
                aspectRatio: '4 / 3',
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
                marginTop: 10,
                color: '#63705c',
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              이미지: {plant.image.source}
            </figcaption>
          </figure>

          <div
            style={{
              borderRadius: 20,
              padding: '20px 22px',
              background: 'rgba(255, 255, 255, 0.68)',
              border: '1px solid rgba(84, 101, 68, 0.18)',
            }}
          >
            <p
              style={{
                margin: 0,
                color: '#3e4d36',
                fontSize: 22,
                lineHeight: 1.45,
                fontWeight: 700,
              }}
            >
              {seasonText}
            </p>
          </div>
        </section>

        <main
          style={{
            minWidth: 0,
            display: 'grid',
            gap: 22,
            alignContent: 'start',
          }}
        >
          <header style={{ minWidth: 0 }}>
            <p
              style={{
                margin: '0 0 12px',
                color: '#526442',
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              HanGarden 식물 해설
            </p>
            <h1
              id="ginkgo-title"
              style={{
                margin: 0,
                color: '#152016',
                fontSize: 'clamp(56px, 5.5vw, 96px)',
                lineHeight: 1,
                letterSpacing: 0,
              }}
            >
              {plant.koreanName}
            </h1>
            <p
              style={{
                margin: '14px 0 0',
                color: '#6b765c',
                fontSize: 24,
                fontStyle: 'italic',
                lineHeight: 1.25,
              }}
            >
              {plant.scientificName}
            </p>
            <p
              style={{
                margin: '24px 0 0',
                maxWidth: 900,
                color: '#273624',
                fontSize: 31,
                lineHeight: 1.34,
                fontWeight: 800,
              }}
            >
              은행나무는 부채 모양 잎만 보아도 알아볼 수 있는 나무입니다.
              긴 시간을 살아온 모습 덕분에 식물의 진화와 도시의 그늘을 함께
              이야기하기 좋습니다.
            </p>
          </header>

          <section
            aria-label="빠른 정보"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 12,
            }}
          >
            {[
              ['과', plant.family],
              ['사는 곳', '햇빛 드는 정원과 길가'],
              ['관찰 시기', plant.floweringSeason],
              ['크기', plant.size],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  boxSizing: 'border-box',
                  minWidth: 0,
                  borderRadius: 18,
                  padding: '18px 16px',
                  background: 'rgba(255, 255, 255, 0.74)',
                  border: '1px solid rgba(81, 101, 61, 0.18)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 8px',
                    color: '#6e7d5b',
                    fontSize: 15,
                    fontWeight: 800,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: '#263421',
                    fontSize: 20,
                    lineHeight: 1.3,
                    fontWeight: 800,
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 18,
              minWidth: 0,
            }}
          >
            <div
              style={{
                borderRadius: 24,
                padding: '24px 26px',
                background: '#fffdf4',
                border: '1px solid rgba(99, 110, 73, 0.2)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 16px',
                  color: '#263421',
                  fontSize: 28,
                  lineHeight: 1.2,
                }}
              >
                부채잎으로 알아보기
              </h2>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'grid',
                  gap: 12,
                }}
              >
                {mainFeatures.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '18px 1fr',
                      gap: 12,
                      color: '#34442d',
                      fontSize: 21,
                      lineHeight: 1.35,
                      fontWeight: 700,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 12,
                        height: 12,
                        marginTop: 8,
                        borderRadius: 999,
                        background: '#d8aa24',
                      }}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                borderRadius: 24,
                padding: '24px 26px',
                background: '#f4f8ec',
                border: '1px solid rgba(74, 100, 61, 0.2)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 16px',
                  color: '#263421',
                  fontSize: 28,
                  lineHeight: 1.2,
                }}
              >
                이름과 학명
              </h2>
              <p
                style={{
                  margin: 0,
                  color: '#34442d',
                  fontSize: 21,
                  lineHeight: 1.45,
                  fontWeight: 700,
                }}
              >
                학명 <em style={{ fontStyle: 'italic' }}>Ginkgo biloba</em>의
                biloba는 잎이 두 갈래로 나뉘어 보이는 특징과 연결해 기억할 수
                있습니다. 먼저 잎의 선을 따라가며 이름을 떠올려 보세요.
              </p>
            </div>
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: 18,
              minWidth: 0,
            }}
          >
            <div
              style={{
                borderRadius: 24,
                padding: '24px 26px',
                background: 'rgba(35, 58, 35, 0.92)',
                color: '#fffaf0',
              }}
            >
              <h2
                style={{
                  margin: '0 0 14px',
                  fontSize: 28,
                  lineHeight: 1.2,
                }}
              >
                지금 볼 포인트
              </h2>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 24,
                  display: 'grid',
                  gap: 9,
                }}
              >
                {observationTips.map((tip) => (
                  <li
                    key={tip}
                    style={{
                      paddingLeft: 6,
                      fontSize: 21,
                      lineHeight: 1.36,
                      fontWeight: 700,
                    }}
                  >
                    {tip}
                  </li>
                ))}
              </ol>
            </div>

            <aside
              style={{
                borderRadius: 24,
                padding: '24px 26px',
                background: 'rgba(255, 255, 255, 0.76)',
                border: '1px solid rgba(81, 101, 61, 0.18)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 12px',
                  color: '#263421',
                  fontSize: 28,
                  lineHeight: 1.2,
                }}
              >
                왜 의미 있을까요?
              </h2>
              <p
                style={{
                  margin: 0,
                  color: '#34442d',
                  fontSize: 21,
                  lineHeight: 1.43,
                  fontWeight: 700,
                }}
              >
                오래 사는 은행나무는 도시 생태와 살아있는 화석이라는 개념을
                함께 보여줍니다. 큰 나무가 만드는 그늘도 정원의 중요한
                생태적 역할입니다.
              </p>
            </aside>
          </section>
        </main>
      </div>
    </article>
  );
}
