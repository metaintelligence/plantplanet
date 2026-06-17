import type { GeneratedContent, PlantRecord } from '../../types/content';

interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}

const categoryLabel: Record<PlantRecord['category'], string> = {
  tree: '상록활엽수',
  shrub: '관목',
  herb: '초본',
};

export default function GeneratedLayoutContentMqhmkje9({
  content,
  plant,
}: GeneratedLayoutProps) {
  const settings = content.settings;
  const summerNote =
    plant.seasonHighlights[settings.season] || plant.seasonHighlights.auto;

  const scenes = [
    {
      marker: '01',
      title: '붉은 꽃이 없는 겨울',
      enTitle: 'A winter without red flowers',
      body:
        '동백나무가 사라진 숲길을 상상해 보십시오. 한겨울부터 이른 봄까지 이어지던 붉은 꽃의 신호가 사라지고, 추운 계절에도 생명이 움직인다는 단서 하나가 조용히 줄어듭니다.',
    },
    {
      marker: '02',
      title: '빛을 붙잡는 여름 잎',
      enTitle: 'Summer leaves holding light',
      body: summerNote,
    },
    {
      marker: '03',
      title: '통째로 떨어지는 꽃의 기억',
      enTitle: 'The memory of a whole fallen flower',
      body:
        '동백꽃은 꽃잎을 하나씩 흩뜨리기보다 꽃 모양을 간직한 채 떨어지는 모습으로 잘 알려져 있습니다. 이 독특한 낙화 방식은 숲 바닥에서도 동백나무의 계절을 읽게 합니다.',
    },
  ];

  const observationPoints = [
    '잎 표면의 윤기와 두께를 손대지 않고 빛의 반사로 살펴보세요.',
    '숲길 가장자리에서는 뿌리 주변 흙을 밟지 않도록 한 걸음 물러서 보세요.',
    '겨울에 꽃을 찾는 생물과 난대림의 계절 변화가 어떻게 이어질지 떠올려 보세요.',
  ];

  const quickFacts = [
    ['학명', plant.scientificName],
    ['분류', `${plant.family} · ${categoryLabel[plant.category]}`],
    ['서식 맥락', '남부 해안과 섬 지역의 상록활엽수림'],
    ['개화 흐름', '겨울에서 이른 봄까지 이어지는 붉은 꽃'],
  ];

  return (
    <article
      aria-labelledby="camellia-story-title"
      style={{
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        minHeight: '100svh',
        margin: 0,
        padding: '16px 14px 28px',
        background: '#f7f3ea',
        color: '#18221d',
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
          maxWidth: 720,
          minWidth: 0,
          margin: '0 auto',
          display: 'grid',
          gap: 14,
        }}
      >
        <header
          style={{
            boxSizing: 'border-box',
            minWidth: 0,
            borderRadius: 8,
            overflow: 'hidden',
            background: '#172a21',
            color: '#fffaf0',
            border: '1px solid rgba(23, 42, 33, 0.18)',
          }}
        >
          <figure style={{ margin: 0, minWidth: 0 }}>
            <img
              src={plant.image.url}
              alt={plant.image.alt}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
              }}
            />
          </figure>

          <section
            style={{
              boxSizing: 'border-box',
              minWidth: 0,
              padding: '22px 18px 20px',
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                color: '#f3c1b1',
                fontSize: 13,
                lineHeight: 1.35,
                fontWeight: 850,
              }}
            >
              숲길에서 읽는 동백나무 이야기 · Camellia on the forest trail
            </p>
            <h1
              id="camellia-story-title"
              style={{
                margin: 0,
                fontSize: 'clamp(34px, 12vw, 54px)',
                lineHeight: 1.06,
                letterSpacing: 0,
              }}
            >
              사라진 붉은 계절을 상상하다
            </h1>
            <p
              style={{
                margin: '10px 0 0',
                color: '#d9e3d3',
                fontSize: 15,
                lineHeight: 1.42,
                fontStyle: 'italic',
                fontWeight: 700,
                overflowWrap: 'anywhere',
              }}
            >
              {plant.commonName} · {plant.scientificName}
            </p>
            <p
              style={{
                margin: '18px 0 0',
                color: '#fff7e8',
                fontSize: 19,
                lineHeight: 1.55,
                fontWeight: 800,
              }}
            >
              동백나무는 꽃이 드문 계절에 붉은 신호를 켜는 나무입니다. 이
              신호가 사라진다면, 우리는 한 종만이 아니라 난대림의 계절 감각과
              생물 사이의 연결을 함께 잃게 됩니다.
            </p>
          </section>
        </header>

        <main
          style={{
            boxSizing: 'border-box',
            display: 'grid',
            gap: 14,
            minWidth: 0,
          }}
        >
          <section
            aria-label="핵심 정보"
            style={{
              boxSizing: 'border-box',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 8,
              minWidth: 0,
              padding: 14,
              borderRadius: 8,
              background: '#fffaf2',
              border: '1px solid rgba(66, 83, 61, 0.16)',
            }}
          >
            {quickFacts.map(([label, value]) => (
              <div
                key={label}
                style={{
                  boxSizing: 'border-box',
                  display: 'grid',
                  gridTemplateColumns: '82px minmax(0, 1fr)',
                  gap: 10,
                  alignItems: 'start',
                  minWidth: 0,
                  padding: '10px 0',
                  borderBottom:
                    label === '개화 흐름'
                      ? '0'
                      : '1px solid rgba(66, 83, 61, 0.12)',
                }}
              >
                <strong
                  style={{
                    color: '#6b342b',
                    fontSize: 13,
                    lineHeight: 1.35,
                  }}
                >
                  {label}
                </strong>
                <span
                  style={{
                    minWidth: 0,
                    color: '#26352d',
                    fontSize: 15,
                    lineHeight: 1.45,
                    fontWeight: 700,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </section>

          <section
            aria-label="동백나무 보전 이야기"
            style={{
              boxSizing: 'border-box',
              minWidth: 0,
              display: 'grid',
              gap: 10,
            }}
          >
            {scenes.map((scene, index) => (
              <section
                key={scene.marker}
                style={{
                  boxSizing: 'border-box',
                  minWidth: 0,
                  padding: '17px 16px',
                  borderRadius: 8,
                  background: index === 1 ? '#eaf0df' : '#ffffff',
                  border: '1px solid rgba(66, 83, 61, 0.16)',
                }}
              >
                <p
                  style={{
                    display: 'inline-flex',
                    minHeight: 32,
                    alignItems: 'center',
                    margin: '0 0 10px',
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: index === 1 ? '#284c38' : '#8e372f',
                    color: '#fffaf0',
                    fontSize: 13,
                    lineHeight: 1.2,
                    fontWeight: 900,
                  }}
                >
                  Scene {scene.marker}
                </p>
                <h2
                  style={{
                    margin: 0,
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
                    margin: '4px 0 0',
                    color: '#66705f',
                    fontSize: 13,
                    lineHeight: 1.35,
                    fontWeight: 800,
                  }}
                >
                  {scene.enTitle}
                </p>
                <p
                  style={{
                    margin: '10px 0 0',
                    color: '#314039',
                    fontSize: 16,
                    lineHeight: 1.62,
                    fontWeight: 650,
                  }}
                >
                  {scene.body}
                </p>
              </section>
            ))}
          </section>

          <section
            aria-label="숲길 관찰 포인트"
            style={{
              boxSizing: 'border-box',
              minWidth: 0,
              padding: '18px 16px',
              borderRadius: 8,
              background: '#fff7e6',
              border: '1px solid rgba(142, 55, 47, 0.18)',
            }}
          >
            <h2
              style={{
                margin: 0,
                color: '#402b24',
                fontSize: 23,
                lineHeight: 1.24,
                letterSpacing: 0,
              }}
            >
              지금 이 자리에서 남길 수 있는 것
            </h2>
            <p
              style={{
                margin: '6px 0 14px',
                color: '#73584f',
                fontSize: 14,
                lineHeight: 1.45,
                fontWeight: 750,
              }}
            >
              What we can preserve by observing carefully
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 9,
                minWidth: 0,
              }}
            >
              {observationPoints.map((point, index) => (
                <p
                  key={point}
                  style={{
                    boxSizing: 'border-box',
                    display: 'grid',
                    gridTemplateColumns: '38px minmax(0, 1fr)',
                    gap: 10,
                    alignItems: 'center',
                    minWidth: 0,
                    minHeight: 52,
                    margin: 0,
                    padding: '10px',
                    borderRadius: 8,
                    background: '#ffffff',
                    color: '#2e3e35',
                    fontSize: 15,
                    lineHeight: 1.5,
                    fontWeight: 750,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      background: '#284c38',
                      color: '#fffaf0',
                      fontSize: 15,
                      fontWeight: 950,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span style={{ minWidth: 0 }}>{point}</span>
                </p>
              ))}
            </div>
          </section>

          <section
            aria-label="보전 메시지"
            style={{
              boxSizing: 'border-box',
              minWidth: 0,
              padding: '18px 16px',
              borderRadius: 8,
              background: '#1f3b2e',
              color: '#fffaf0',
            }}
          >
            <h2
              style={{
                margin: 0,
                color: '#ffe5da',
                fontSize: 22,
                lineHeight: 1.25,
                letterSpacing: 0,
              }}
            >
              동백을 지키는 일은 계절을 읽는 능력을 지키는 일입니다
            </h2>
            <p
              style={{
                margin: '10px 0 0',
                fontSize: 16,
                lineHeight: 1.62,
                fontWeight: 700,
              }}
            >
              {plant.conservationMessage} 오늘은 꽃을 꺾거나 낙화를 가져가지
              않고, 숲길에서 본 변화를 다음 계절까지 기억해 주세요.
            </p>
          </section>
        </main>

        <footer
          style={{
            boxSizing: 'border-box',
            minWidth: 0,
            color: '#6c7469',
            fontSize: 12,
            lineHeight: 1.4,
            overflowWrap: 'anywhere',
          }}
        >
          이미지: {plant.image.source} · {plant.image.license}
        </footer>
      </div>
    </article>
  );
}
