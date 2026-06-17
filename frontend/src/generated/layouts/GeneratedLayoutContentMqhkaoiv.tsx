import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { GeneratedContent, PlantRecord } from '../../types/content';

interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}

type DisplayLanguage = 'ko' | 'ja';

const categoryLabel: Record<PlantRecord['category'], string> = {
  tree: '나무',
  shrub: '관목',
  herb: '초본',
};

const quickInfoLabels = {
  ko: {
    family: '분류',
    habitat: '사는 곳',
    season: '관찰 시기',
    size: '크기',
  },
  ja: {
    family: '分類',
    habitat: '生育地',
    season: '観察時期',
    size: '大きさ',
  },
};

const pageText = {
  ko: {
    eyebrow: '공원에서 지켜야 할 상록수',
    title: '소나무 보전 안내',
    languageKo: '한국어',
    languageJa: '日本語',
    scientificPrefix: '학명',
    heroCopy:
      '소나무는 익숙해서 더 쉽게 지나치지만, 산불과 병해충, 뿌리 주변 훼손에 민감한 숲의 기반 나무입니다.',
    currentTitle: '오늘의 보전 포인트',
    currentPoint:
      '바늘잎, 솔방울, 붉은 수피를 관찰하되 꺾거나 채집하지 마세요. 소나무를 오래 만나기 위한 첫 행동은 나무 주변을 그대로 두는 것입니다.',
    quickTitle: '소나무 이해하기',
    observeTitle: '훼손 없이 관찰하는 세 가지',
    observeLead:
      '가까이 만지는 관찰보다 한 걸음 떨어져 보는 관찰이 소나무와 숲 바닥을 함께 지킵니다.',
    meaningTitle: '한 그루를 지키면 숲의 회복력이 커집니다',
    meaningBody:
      '소나무는 한국 산림 경관과 문화에서 중요한 나무입니다. 공원에서 만나는 한 그루도 주변 생물의 쉼터가 되고, 건강한 숲을 이어 가는 씨앗과 그늘을 남깁니다. 산불 예방, 병해충 조기 발견, 뿌리 주변 토양 보호는 소나무 보전의 핵심입니다.',
    parkNote:
      '관람로 밖으로 들어가 뿌리 주변을 밟지 않고, 떨어진 솔방울과 가지도 제자리에 두세요. 작은 예절이 토양을 덜 단단하게 만들고 다음 세대의 소나무를 돕습니다.',
    sourcePrefix: '이미지',
    conservationBadge: '소나무 보전 캠페인',
    actionTitle: '지금 할 수 있는 보전 행동',
    actionItems: [
      '담배꽁초와 불씨를 남기지 않기',
      '잎, 가지, 솔방울을 꺾거나 가져가지 않기',
      '수피 상처나 병해충 흔적은 공원 관리자에게 알리기',
    ],
    localMessageTitle: '현장에서 기억할 한 문장',
    localMessage:
      '소나무는 보는 만큼 지켜지는 나무입니다. 오늘의 관찰을 채집이 아니라 보호의 시선으로 남겨 주세요.',
  },
  ja: {
    eyebrow: '公園で守りたい常緑樹',
    title: 'アカマツ保全ガイド',
    languageKo: '한국어',
    languageJa: '日本語',
    scientificPrefix: '学名',
    heroCopy:
      'アカマツは身近な木ですが、山火事、病害虫、根元の踏み固めに影響を受けやすい森の基盤となる木です。',
    currentTitle: '今日の保全ポイント',
    currentPoint:
      '針葉、松ぼっくり、赤みのある樹皮を観察しても、枝葉を折ったり採集したりしないでください。周囲をそのまま保つことが保全の第一歩です。',
    quickTitle: 'アカマツを知る',
    observeTitle: '傷つけずに見る三つの手がかり',
    observeLead:
      '近くで触るより、少し離れて観察することが木と林床を同時に守ります。',
    meaningTitle: '一本を守ることが森の回復力につながります',
    meaningBody:
      'アカマツは韓国の森林景観と文化の中で大切にされてきた木です。公園の一本も、生きもののすみかとなり、健やかな森を次へつなぐ種と木陰を残します。山火事の予防、病害虫の早期発見、根元の土を守ることが保全の要点です。',
    parkNote:
      '園路の外へ入って根元を踏み固めず、落ちている松ぼっくりや枝も持ち帰らずその場に残してください。小さなマナーが次の世代のマツを助けます。',
    sourcePrefix: '画像',
    conservationBadge: 'アカマツ保全キャンペーン',
    actionTitle: 'いま参加できる保全行動',
    actionItems: [
      'たばこの吸い殻や火種を残さない',
      '葉、枝、松ぼっくりを折ったり持ち帰ったりしない',
      '樹皮の傷や病害虫の跡を見つけたら管理者へ知らせる',
    ],
    localMessageTitle: '現地で覚えておきたい一文',
    localMessage:
      'アカマツは、見守ることで守られる木です。今日の観察を採集ではなく保全のまなざしとして残してください。',
  },
};

const translatedFacts = {
  ko: {
    family: '소나무과',
    habitat: '햇빛이 잘 드는 건조한 산지와 능선',
    season: '4~5월 수분, 가을부터 솔방울 관찰',
    size: '높이 15~30m',
  },
  ja: {
    family: 'マツ科',
    habitat: '日当たりのよい乾いた山地や尾根',
    season: '4~5月に受粉し、秋から松ぼっくりを観察',
    size: '高さ15~30m',
  },
};

const observationItems = {
  ko: [
    {
      title: '바늘잎은 눈으로만 보기',
      body: '두 개씩 모인 잎을 확인하되 가지 끝을 당기거나 꺾지 않습니다.',
    },
    {
      title: '붉은 수피의 상처 살피기',
      body: '줄기 위쪽의 붉은 갈색과 갈라진 무늬를 보고, 깊은 상처나 이상 흔적은 기록해 주세요.',
    },
    {
      title: '솔방울은 숲 바닥에 두기',
      body: '떨어진 솔방울도 씨앗과 작은 생물의 환경이 될 수 있으니 가져가지 않습니다.',
    },
  ],
  ja: [
    {
      title: '針葉は目で観察する',
      body: '二本ずつ束になる葉を確かめても、枝先を引いたり折ったりしません。',
    },
    {
      title: '赤い樹皮の傷を見る',
      body: '赤褐色の樹皮と割れ目を見ながら、深い傷や異常な跡がないかを観察します。',
    },
    {
      title: '松ぼっくりは林床に残す',
      body: '落ちた松ぼっくりも種や小さな生きものの環境になるため、持ち帰りません。',
    },
  ],
};

const styles = {
  root: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '100%',
    minHeight: '100svh',
    margin: 0,
    padding: '18px 14px 28px',
    background: '#f4f0e5',
    color: '#17241d',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
  },
  shell: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 720,
    minWidth: 0,
    margin: '0 auto',
  },
  card: {
    boxSizing: 'border-box',
    minWidth: 0,
    maxWidth: '100%',
    borderRadius: 8,
    border: '1px solid rgba(47, 78, 58, 0.16)',
    background: 'rgba(255, 255, 255, 0.86)',
  },
} satisfies Record<string, CSSProperties>;

export default function GeneratedLayoutContentMqhkaoiv({
  content,
  plant,
}: GeneratedLayoutProps) {
  const [language, setLanguage] = useState<DisplayLanguage>('ko');
  const text = pageText[language];
  const labels = quickInfoLabels[language];
  const facts = translatedFacts[language];
  const observations = observationItems[language];
  const conservationSection = content.sections.find((section) =>
    section.title.includes('보전'),
  );
  const seasonPoint =
    content.settings.season === 'auto'
      ? text.currentPoint
      : plant.seasonHighlights[content.settings.season] ||
        plant.seasonHighlights.auto;
  const isKo = language === 'ko';

  const quickFacts = [
    [labels.family, facts.family],
    [labels.habitat, facts.habitat],
    [labels.season, facts.season],
    [labels.size, facts.size],
  ];

  const conservationMessage = isKo
    ? plant.conservationMessage || conservationSection?.body || text.meaningBody
    : text.meaningBody;

  return (
    <article aria-labelledby="pine-intro-title" style={styles.root}>
      <div style={styles.shell}>
        <header
          style={{
            boxSizing: 'border-box',
            minWidth: 0,
            display: 'grid',
            gap: 14,
          }}
        >
          <div
            aria-label="language"
            style={{
              boxSizing: 'border-box',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              minWidth: 0,
            }}
          >
            {(['ko', 'ja'] as DisplayLanguage[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                style={{
                  boxSizing: 'border-box',
                  minHeight: 48,
                  minWidth: 0,
                  borderRadius: 8,
                  border:
                    language === item
                      ? '2px solid #244b34'
                      : '1px solid rgba(47, 78, 58, 0.2)',
                  background: language === item ? '#244b34' : '#fffaf0',
                  color: language === item ? '#fffaf0' : '#244b34',
                  fontSize: 15,
                  fontWeight: 800,
                  letterSpacing: 0,
                  cursor: 'pointer',
                }}
              >
                {item === 'ko' ? text.languageKo : text.languageJa}
              </button>
            ))}
          </div>

          <figure
            style={{
              boxSizing: 'border-box',
              minWidth: 0,
              margin: 0,
              borderRadius: 8,
              overflow: 'hidden',
              background: '#d7e2d1',
              border: '1px solid rgba(47, 78, 58, 0.2)',
            }}
          >
            <img
              src={plant.image.url}
              alt={isKo ? plant.image.alt : 'Japanese red pine'}
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
              ...styles.card,
              padding: '22px 18px 20px',
              background: '#fffaf0',
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                color: '#456547',
                fontSize: 14,
                lineHeight: 1.35,
                fontWeight: 900,
              }}
            >
              {text.eyebrow} · {isKo ? categoryLabel[plant.category] : 'tree'}
            </p>
            <h1
              id="pine-intro-title"
              style={{
                margin: 0,
                color: '#14251b',
                fontSize: 'clamp(34px, 12vw, 56px)',
                lineHeight: 1.08,
                letterSpacing: 0,
              }}
            >
              {text.title}
            </h1>
            <p
              style={{
                margin: '8px 0 0',
                color: '#687365',
                fontSize: 15,
                lineHeight: 1.35,
                fontStyle: 'italic',
                fontWeight: 700,
                overflowWrap: 'anywhere',
              }}
            >
              {text.scientificPrefix} {plant.scientificName}
            </p>
            <p
              style={{
                margin: '18px 0 0',
                color: '#24362a',
                fontSize: 20,
                lineHeight: 1.5,
                fontWeight: 800,
              }}
            >
              {text.heroCopy}
            </p>
          </section>
        </header>

        <main
          style={{
            boxSizing: 'border-box',
            display: 'grid',
            gap: 14,
            marginTop: 14,
            minWidth: 0,
          }}
        >
          <section
            style={{
              ...styles.card,
              padding: '18px',
              background: '#21442f',
              color: '#fffaf0',
            }}
          >
            <p
              style={{
                display: 'inline-block',
                margin: '0 0 10px',
                padding: '6px 10px',
                borderRadius: 999,
                background: 'rgba(255, 250, 240, 0.16)',
                color: '#f7e7bd',
                fontSize: 12,
                lineHeight: 1.2,
                fontWeight: 900,
              }}
            >
              {text.conservationBadge}
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: 1.25,
                letterSpacing: 0,
              }}
            >
              {text.currentTitle}
            </h2>
            <p
              style={{
                margin: '10px 0 0',
                fontSize: 17,
                lineHeight: 1.58,
                fontWeight: 650,
              }}
            >
              {seasonPoint}
            </p>
          </section>

          <section style={{ ...styles.card, padding: '18px' }}>
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: 22,
                lineHeight: 1.25,
                letterSpacing: 0,
              }}
            >
              {text.quickTitle}
            </h2>
            <div
              style={{
                boxSizing: 'border-box',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 8,
                minWidth: 0,
              }}
            >
              {quickFacts.map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    boxSizing: 'border-box',
                    display: 'grid',
                    gridTemplateColumns: '88px minmax(0, 1fr)',
                    gap: 10,
                    minWidth: 0,
                    padding: '12px',
                    borderRadius: 8,
                    background: '#efe8d8',
                  }}
                >
                  <strong
                    style={{
                      color: '#496048',
                      fontSize: 14,
                      lineHeight: 1.35,
                    }}
                  >
                    {label}
                  </strong>
                  <span
                    style={{
                      minWidth: 0,
                      color: '#24342a',
                      fontSize: 15,
                      lineHeight: 1.45,
                      fontWeight: 650,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...styles.card, padding: '18px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.25,
                letterSpacing: 0,
              }}
            >
              {text.observeTitle}
            </h2>
            <p
              style={{
                margin: '8px 0 14px',
                color: '#526052',
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              {text.observeLead}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 10,
                minWidth: 0,
              }}
            >
              {observations.map((item, index) => (
                <section
                  key={item.title}
                  style={{
                    boxSizing: 'border-box',
                    display: 'grid',
                    gridTemplateColumns: '42px minmax(0, 1fr)',
                    gap: 12,
                    alignItems: 'start',
                    minWidth: 0,
                    padding: '14px 12px',
                    borderRadius: 8,
                    background: index === 1 ? '#e8efdf' : '#fffaf0',
                    border: '1px solid rgba(47, 78, 58, 0.12)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 42,
                      height: 42,
                      borderRadius: 8,
                      background: '#b95b38',
                      color: '#fffaf0',
                      fontSize: 18,
                      fontWeight: 950,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <strong
                      style={{
                        display: 'block',
                        color: '#203027',
                        fontSize: 17,
                        lineHeight: 1.35,
                      }}
                    >
                      {item.title}
                    </strong>
                    <span
                      style={{
                        display: 'block',
                        marginTop: 4,
                        color: '#526052',
                        fontSize: 15,
                        lineHeight: 1.45,
                      }}
                    >
                      {item.body}
                    </span>
                  </span>
                </section>
              ))}
            </div>
          </section>

          <section
            style={{
              ...styles.card,
              padding: '18px',
              background: '#fffaf0',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.25,
                letterSpacing: 0,
              }}
            >
              {text.actionTitle}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 9,
                marginTop: 12,
                minWidth: 0,
              }}
            >
              {text.actionItems.map((item) => (
                <p
                  key={item}
                  style={{
                    boxSizing: 'border-box',
                    margin: 0,
                    minWidth: 0,
                    padding: '13px 14px',
                    borderRadius: 8,
                    background: '#e6edde',
                    color: '#274432',
                    fontSize: 15,
                    lineHeight: 1.5,
                    fontWeight: 800,
                  }}
                >
                  {item}
                </p>
              ))}
            </div>
          </section>

          <section
            style={{
              ...styles.card,
              padding: '18px',
              background: '#fffaf0',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.25,
                letterSpacing: 0,
              }}
            >
              {text.meaningTitle}
            </h2>
            <p
              style={{
                margin: '10px 0 0',
                color: '#2d3d31',
                fontSize: 16,
                lineHeight: 1.62,
              }}
            >
              {conservationMessage}
            </p>
            <p
              style={{
                margin: '12px 0 0',
                padding: '12px',
                borderRadius: 8,
                background: '#e8efe1',
                color: '#274432',
                fontSize: 15,
                lineHeight: 1.5,
                fontWeight: 750,
              }}
            >
              {text.parkNote}
            </p>
            <section
              style={{
                boxSizing: 'border-box',
                marginTop: 12,
                padding: '14px',
                borderRadius: 8,
                background: '#284834',
                color: '#fffaf0',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 17,
                  lineHeight: 1.3,
                  letterSpacing: 0,
                }}
              >
                {text.localMessageTitle}
              </h3>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: 15,
                  lineHeight: 1.55,
                  fontWeight: 700,
                }}
              >
                {text.localMessage}
              </p>
            </section>
          </section>
        </main>

        <footer
          style={{
            boxSizing: 'border-box',
            marginTop: 12,
            color: '#6c7469',
            fontSize: 12,
            lineHeight: 1.4,
            overflowWrap: 'anywhere',
          }}
        >
          {text.sourcePrefix}: {plant.image.source} · {plant.image.license}
        </footer>
      </div>
    </article>
  );
}
