import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { GeneratedContent, PlantRecord } from '../../types/content';

interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}

type StoryBeat = {
  title: string;
  body: string;
  cue: string;
};

export default function GeneratedLayoutContentMqdwhy3o({
  content,
  plant,
}: GeneratedLayoutProps) {
  const [activeBeat, setActiveBeat] = useState(0);
  const settings = content.settings;

  const seasonLabels: Record<string, string> = {
    spring: '봄',
    summer: '여름',
    autumn: '가을',
    winter: '겨울',
    auto: '오늘',
  };

  const audienceLabels: Record<string, string> = {
    children: '어린이',
    adults: '방문객',
    foreigners: '방문객',
  };

  const purposeLabels: Record<string, string> = {
    general: '정원 산책',
    education: '관찰 수업',
    experience: '현장 체험',
    campaign: '숲 지킴 약속',
    promotion: '전시 관람',
    route: '산책길 안내',
  };

  const locationLabels: Record<string, string> = {
    greenhouse: '온실',
    garden: '정원',
    outdoorGarden: '야외정원',
    forestTrail: '숲길',
    park: '공원',
  };

  const focusLabels: Record<string, string> = {
    appearance: '모양 관찰',
    ecology: '사는 곳',
    nameOrigin: '이름 이야기',
    cultureHistory: '우리 숲의 기억',
    usage: '쓰임새',
    conservation: '보전 약속',
    comparison: '비슷한 식물 비교',
    funFacts: '작은 발견',
  };

  const usesKorean = settings.languages.includes('ko');
  const selectedSeason = seasonLabels[settings.season] ?? '오늘';
  const audience = settings.audience
    .map((item) => audienceLabels[item] ?? '방문객')
    .join(', ');
  const purpose = purposeLabels[settings.purpose] ?? '정원 산책';
  const location = locationLabels[settings.fieldLocation] ?? '정원';
  const focusTopics = settings.focusTopics
    .map((item) => focusLabels[item] ?? '관찰 주제')
    .slice(0, 3);

  const authoredSections = useMemo(
    () =>
      content.sections
        .map((section) => ({
          title: section.title,
          body: section.body,
          items: section.items?.filter(Boolean) ?? [],
        }))
        .filter((section) => section.title || section.body || section.items.length > 0)
        .slice(0, 2),
    [content.sections],
  );

  const winterHighlight =
    plant.seasonHighlights[settings.season] ??
    plant.seasonHighlights.auto ??
    '오늘 이 식물이 보여 주는 모습을 천천히 살펴보세요.';

  const storyBeats: StoryBeat[] = [
    {
      title: '1. 겨울에도 남은 초록',
      body: `${plant.koreanName}는 ${selectedSeason} ${location}에서 조용히 초록빛을 지키고 있어요. ${winterHighlight}`,
      cue: '먼저 잎의 색을 바라보기',
    },
    {
      title: '2. 가까이 보면 보이는 단서',
      body: `${plant.features.slice(0, 2).join(', ')}을 눈으로 찾아보세요. ${plant.koreanName}의 이야기는 크고 화려한 장면보다 작은 모양에서 시작돼요.`,
      cue: plant.observationTips[0] ?? '잎과 줄기의 모양 살피기',
    },
    {
      title: '3. 오래 함께한 숲의 나무',
      body: `${plant.origin}에서 자라 온 ${plant.koreanName}는 ${plant.habitat}을 좋아해요. 우리가 만나는 한 그루도 숲의 시간과 이어져 있어요.`,
      cue: focusTopics.includes('우리 숲의 기억') ? '주변 숲길과 이어 보기' : '사는 곳 상상하기',
    },
    {
      title: '4. 사라지지 않게 지키는 마음',
      body: plant.conservationMessage,
      cue: '나무를 다치게 하지 않기',
    },
  ];

  const activeStory = storyBeats[activeBeat] ?? storyBeats[0];
  const observationPrompts = [
    plant.observationTips[0],
    plant.observationTips[1],
    plant.observationTips[2],
  ]
    .filter(Boolean)
    .slice(0, 3);

  return (
    <main className="ai-generated-layout" style={styles.page}>
      <section className="ai-generated-hero" style={styles.hero}>
        <div style={styles.heroCopy}>
          <p className="layout-kicker" style={styles.kicker}>
            {usesKorean ? `${audience}와 함께하는 ${purpose}` : purpose}
          </p>
          <h1 style={styles.title}>{plant.koreanName}, 겨울 숲을 지키는 초록 이야기</h1>
          <p style={styles.lead}>
            QR을 찍고 멈춘 자리에서 1분만 읽어 보세요. 잎과 수피와 솔방울을
            차례로 찾다 보면, 이 나무가 왜 지켜져야 하는지 자연스럽게 보입니다.
          </p>
          <div className="ai-generated-chip-row" style={styles.chipRow}>
            {focusTopics.map((topic) => (
              <span key={topic} style={styles.chip}>
                {topic}
              </span>
            ))}
          </div>
        </div>
        <figure style={styles.figure}>
          <img src={plant.image.url} alt={plant.image.alt} style={styles.image} />
          <figcaption style={styles.caption}>
            손으로 만지기보다 눈으로 천천히 따라가며 관찰해 주세요.
          </figcaption>
        </figure>
      </section>

      <section style={styles.storyShell} aria-label={`${plant.koreanName} 이야기 길`}>
        <div style={styles.storyNav}>
          {storyBeats.map((beat, index) => (
            <button
              key={beat.title}
              type="button"
              onClick={() => setActiveBeat(index)}
              style={{
                ...styles.storyButton,
                ...(activeBeat === index ? styles.storyButtonActive : {}),
              }}
              aria-pressed={activeBeat === index}
            >
              <span style={styles.storyButtonNumber}>{index + 1}</span>
              <span>{beat.cue}</span>
            </button>
          ))}
        </div>
        <article className="ai-generated-focus-band" style={styles.activePanel}>
          <p style={styles.panelKicker}>이야기 길</p>
          <h2 style={styles.panelTitle}>{activeStory.title}</h2>
          <p style={styles.panelBody}>{activeStory.body}</p>
          <p style={styles.scienceLine}>
            작은 이름표: {plant.scientificName} · {plant.family} · {plant.size}
          </p>
        </article>
      </section>

      <section style={styles.observation}>
        <div>
          <p style={styles.sectionKicker}>지금 여기서</p>
          <h2 style={styles.sectionTitle}>눈으로만 하는 세 가지 관찰</h2>
        </div>
        <div style={styles.promptGrid}>
          {observationPrompts.map((prompt) => (
            <p key={prompt} style={styles.prompt}>
              {prompt}
            </p>
          ))}
        </div>
      </section>

      {authoredSections.length > 0 ? (
        <section className="ai-generated-section-grid" style={styles.authoredGrid}>
          {authoredSections.map((section) => (
            <article key={`${section.title}-${section.body}`} style={styles.authoredCard}>
              <h2 style={styles.authoredTitle}>{section.title || `${plant.koreanName} 한 줄 이야기`}</h2>
              {section.body ? <p style={styles.authoredBody}>{section.body}</p> : null}
              {section.items.length > 0 ? (
                <ul style={styles.authoredList}>
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
        <h2 style={styles.closingTitle}>오늘의 숲 지킴 약속</h2>
        <p style={styles.closingText}>
          {plant.koreanName} 곁에서는 가지를 꺾지 않고, 솔방울과 잎은 떨어진 것만
          살펴봐 주세요. 작은 배려가 다음 방문객과 다음 계절의 숲을 남깁니다.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100%',
    background: '#f4f0e6',
    color: '#1d261c',
    padding: 'clamp(16px, 4vw, 38px)',
    fontFamily:
      'Pretendard, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  hero: {
    maxWidth: 1080,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(290px, 100%), 1fr))',
    gap: 'clamp(18px, 4vw, 36px)',
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid #d8d0bd',
    borderRadius: 8,
    padding: 'clamp(20px, 4vw, 40px)',
    boxShadow: '0 16px 34px rgba(38, 47, 31, 0.12)',
  },
  heroCopy: {
    minWidth: 0,
  },
  kicker: {
    margin: '0 0 10px',
    color: '#59672b',
    fontSize: 14,
    fontWeight: 900,
  },
  title: {
    margin: 0,
    maxWidth: 720,
    color: '#172016',
    fontSize: 'clamp(32px, 6vw, 56px)',
    lineHeight: 1.08,
    letterSpacing: 0,
  },
  lead: {
    margin: '16px 0 0',
    maxWidth: 640,
    color: '#384535',
    fontSize: 'clamp(16px, 2.2vw, 20px)',
    lineHeight: 1.6,
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 34,
    borderRadius: 999,
    background: '#24472b',
    color: '#ffffff',
    padding: '7px 12px',
    fontSize: 14,
    fontWeight: 800,
  },
  figure: {
    margin: 0,
  },
  image: {
    display: 'block',
    width: '100%',
    aspectRatio: '4 / 3',
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid #b9c2ad',
  },
  caption: {
    marginTop: 8,
    color: '#43513f',
    fontSize: 14,
    lineHeight: 1.45,
  },
  storyShell: {
    maxWidth: 1080,
    margin: '16px auto 0',
    display: 'grid',
    gridTemplateColumns: 'minmax(min(100%, 300px), 0.85fr) minmax(min(100%, 420px), 1.4fr)',
    gap: 14,
  },
  storyNav: {
    display: 'grid',
    gap: 8,
  },
  storyButton: {
    width: '100%',
    minHeight: 58,
    display: 'grid',
    gridTemplateColumns: '32px 1fr',
    alignItems: 'center',
    gap: 10,
    border: '2px solid #365236',
    borderRadius: 8,
    background: '#ffffff',
    color: '#1d261c',
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 850,
    lineHeight: 1.35,
    cursor: 'pointer',
  },
  storyButtonActive: {
    background: '#24472b',
    color: '#ffffff',
    borderColor: '#24472b',
  },
  storyButtonNumber: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: '#d95a3f',
    color: '#ffffff',
    fontWeight: 900,
  },
  activePanel: {
    minHeight: 258,
    borderRadius: 8,
    background: '#25331f',
    color: '#ffffff',
    padding: 'clamp(20px, 4vw, 34px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  panelKicker: {
    margin: '0 0 8px',
    color: '#dbe9b9',
    fontSize: 13,
    fontWeight: 900,
  },
  panelTitle: {
    margin: 0,
    color: '#ffffff',
    fontSize: 'clamp(24px, 4vw, 36px)',
    lineHeight: 1.18,
  },
  panelBody: {
    margin: '14px 0 0',
    color: '#f5f8ee',
    fontSize: 'clamp(16px, 2.3vw, 20px)',
    lineHeight: 1.65,
  },
  scienceLine: {
    margin: '16px 0 0',
    color: '#d7dfc8',
    fontSize: 14,
    lineHeight: 1.45,
  },
  observation: {
    maxWidth: 1080,
    margin: '14px auto 0',
    display: 'grid',
    gridTemplateColumns: 'minmax(min(100%, 250px), 0.8fr) 1.4fr',
    gap: 14,
    alignItems: 'start',
    background: '#ffffff',
    border: '1px solid #d8d0bd',
    borderRadius: 8,
    padding: '18px',
  },
  sectionKicker: {
    margin: '0 0 6px',
    color: '#6b742f',
    fontSize: 13,
    fontWeight: 900,
  },
  sectionTitle: {
    margin: 0,
    color: '#172016',
    fontSize: 'clamp(22px, 4vw, 30px)',
    lineHeight: 1.2,
  },
  promptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
    gap: 10,
  },
  prompt: {
    margin: 0,
    minHeight: 78,
    borderRadius: 8,
    background: '#eef3e3',
    color: '#1d331f',
    padding: '13px 14px',
    fontSize: 15,
    fontWeight: 800,
    lineHeight: 1.45,
  },
  authoredGrid: {
    maxWidth: 1080,
    margin: '14px auto 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
    gap: 12,
  },
  authoredCard: {
    borderRadius: 8,
    background: '#fffaf0',
    border: '1px solid #dacba7',
    padding: 16,
  },
  authoredTitle: {
    margin: '0 0 8px',
    color: '#1d261c',
    fontSize: 18,
    lineHeight: 1.3,
  },
  authoredBody: {
    margin: 0,
    color: '#3c4737',
    fontSize: 15,
    lineHeight: 1.55,
  },
  authoredList: {
    margin: '10px 0 0',
    paddingLeft: 20,
    color: '#3c4737',
    fontSize: 14,
    lineHeight: 1.5,
  },
  closing: {
    maxWidth: 1080,
    margin: '14px auto 0',
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid #d8d0bd',
    padding: '18px 20px',
  },
  closingTitle: {
    margin: '0 0 8px',
    color: '#172016',
    fontSize: 22,
    lineHeight: 1.25,
  },
  closingText: {
    margin: 0,
    color: '#344131',
    fontSize: 16,
    lineHeight: 1.6,
  },
};
