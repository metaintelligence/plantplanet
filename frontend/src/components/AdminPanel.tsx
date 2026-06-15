import type { GenerateInput } from '../types/pageConfig';

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

const plantOptions: SelectOption<GenerateInput['plantName']>[] = [
  { value: '구상나무', label: '구상나무' },
  { value: '미선나무', label: '미선나무' },
  { value: '동백나무', label: '동백나무' },
  { value: '왕벚나무', label: '왕벚나무' },
  { value: '금강초롱꽃', label: '금강초롱꽃' },
  { value: '산수국', label: '산수국' }
];

const templateOptions: SelectOption<GenerateInput['template']>[] = [
  { value: 'intro', label: '식물 소개형' },
  { value: 'storytelling', label: '스토리텔링형' },
  { value: 'quiz', label: '퀴즈형' },
  { value: 'mission', label: '미션형' },
  { value: 'checklist', label: '관찰 체크리스트형' }
];

const purposeOptions: SelectOption<GenerateInput['purpose']>[] = [
  { value: 'general', label: '일반 해설' },
  { value: 'education', label: '교육' },
  { value: 'experience', label: '체험/미션' },
  { value: 'campaign', label: '캠페인' },
  { value: 'promotion', label: '전시 홍보' },
  { value: 'route', label: '관람 동선 유도' }
];

const audienceOptions: SelectOption<GenerateInput['audience']>[] = [
  { value: 'children', label: '아동' },
  { value: 'adults', label: '성인' },
  { value: 'foreigners', label: '외국인' }
];

const languageOptions: SelectOption<GenerateInput['language']>[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
  { value: 'ja', label: '일본어' },
  { value: 'zh', label: '중국어' }
];

const seasonOptions: SelectOption<GenerateInput['season']>[] = [
  { value: 'spring', label: '봄' },
  { value: 'summer', label: '여름' },
  { value: 'autumn', label: '가을' },
  { value: 'winter', label: '겨울' },
  { value: 'auto', label: '자동' }
];

const timeOptions: SelectOption<GenerateInput['estimatedTime']>[] = [
  { value: '10sec', label: '10초' },
  { value: '30sec', label: '30초' },
  { value: '1min', label: '1분' },
  { value: '3min', label: '3분' }
];

const deploymentOptions: SelectOption<GenerateInput['deploymentUse']>[] = [
  { value: 'kiosk', label: '전시관 키오스크' },
  { value: 'mobile', label: '모바일' },
  { value: 'staticPoster', label: '정적 포스터' }
];

const locationOptions: SelectOption<GenerateInput['fieldLocation']>[] = [
  { value: 'greenhouse', label: '온실' },
  { value: 'garden', label: '정원' },
  { value: 'outdoorGarden', label: '야외 정원' },
  { value: 'forestTrail', label: '숲길' },
  { value: 'park', label: '공원' }
];

const focusTopicOptions: SelectOption<GenerateInput['focusTopics'][number]>[] = [
  { value: 'appearance', label: '생김새' },
  { value: 'ecology', label: '생태' },
  { value: 'nameOrigin', label: '이름 유래' },
  { value: 'cultureHistory', label: '문화/역사' },
  { value: 'usage', label: '활용' },
  { value: 'conservation', label: '보전 가치' },
  { value: 'comparison', label: '비교 학습' },
  { value: 'funFacts', label: '재미 요소' }
];

const featureOptions: SelectOption<GenerateInput['featureOptions'][number]>[] = [
  { value: 'voiceGuide', label: '음성 해설' },
  { value: 'qaAi', label: '질문답변 AI' },
  { value: 'similarPlantCards', label: '유사식물카드' }
];

interface AdminPanelProps {
  input: GenerateInput;
  isLoading: boolean;
  onChange: (nextInput: GenerateInput) => void;
  onGenerate: () => void;
}

export default function AdminPanel({ input, isLoading, onChange, onGenerate }: AdminPanelProps) {
  const updateField = <K extends keyof GenerateInput>(key: K, value: GenerateInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  const toggleListValue = <K extends 'focusTopics' | 'featureOptions'>(
    key: K,
    value: GenerateInput[K][number]
  ) => {
    const currentValues = input[key] as string[];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((currentValue) => currentValue !== value)
      : [...currentValues, value];
    onChange({ ...input, [key]: nextValues });
  };

  return (
    <section className="admin-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Generator</p>
          <h2>콘텐츠 생성 설정</h2>
        </div>
        <span className={isLoading ? 'run-state active' : 'run-state'}>AI Draft</span>
      </div>

      <div className="setting-group">
        <p className="setting-title">기본 생성 설정</p>
        <p className="setting-copy">대상 식물, 템플릿, 목적, 고객, 언어, 계절, 체험 시간을 기준으로 콘텐츠의 골격을 만듭니다.</p>
      </div>

      <div className="form-grid">
        <SelectField
          label="대상 식물"
          value={input.plantName}
          options={plantOptions}
          onChange={(value) => updateField('plantName', value)}
        />
        <SelectField
          label="페이지 템플릿"
          value={input.template}
          options={templateOptions}
          onChange={(value) => updateField('template', value)}
        />
        <SelectField
          label="페이지 목적"
          value={input.purpose}
          options={purposeOptions}
          onChange={(value) => updateField('purpose', value)}
        />
        <SelectField
          label="대상 고객"
          value={input.audience}
          options={audienceOptions}
          onChange={(value) => updateField('audience', value)}
        />
        <SelectField
          label="대상 언어"
          value={input.language}
          options={languageOptions}
          onChange={(value) => updateField('language', value)}
        />
        <SelectField
          label="현재 계절"
          value={input.season}
          options={seasonOptions}
          onChange={(value) => updateField('season', value)}
        />
        <SelectField
          label="목표 체험 시간"
          value={input.estimatedTime}
          options={timeOptions}
          onChange={(value) => updateField('estimatedTime', value)}
        />
      </div>

      <div className="setting-group">
        <p className="setting-title">현장 배포 설정</p>
        <p className="setting-copy">QR, 키오스크, 모바일 코스처럼 실제 설치 환경에 맞춰 페이지 밀도와 상호작용을 조정합니다.</p>
      </div>

      <div className="form-grid">
        <SelectField
          label="배포 용도"
          value={input.deploymentUse}
          options={deploymentOptions}
          onChange={(value) => updateField('deploymentUse', value)}
        />
        <SelectField
          label="실제 현장"
          value={input.fieldLocation}
          options={locationOptions}
          onChange={(value) => updateField('fieldLocation', value)}
        />
      </div>

      <CheckboxGroup
        label="주요 설명 항목"
        values={input.focusTopics}
        options={focusTopicOptions}
        onToggle={(value) => toggleListValue('focusTopics', value)}
      />

      <CheckboxGroup
        label="추가 기능 옵션"
        values={input.featureOptions}
        options={featureOptions}
        onToggle={(value) => toggleListValue('featureOptions', value)}
      />

      <label className="field full">
        <span>추가 요청사항</span>
        <textarea
          value={input.extraRequest}
          placeholder="예: 기후위기 메시지를 포함하고 어린이가 따라 하기 쉬운 미션을 넣어주세요."
          onChange={(event) => updateField('extraRequest', event.target.value)}
        />
      </label>

      <div className="button-row">
        <button className="primary-button" onClick={onGenerate} disabled={isLoading}>
          {isLoading ? '생성 중' : '페이지 생성'}
        </button>
        <button className="secondary-button" onClick={onGenerate} disabled={isLoading}>
          다시 생성
        </button>
        <button className="secondary-button" type="button">
          QR 보기
        </button>
        <button className="ghost-button" type="button">
          승인 대기
        </button>
      </div>
    </section>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGroup<T extends string>({
  label,
  values,
  options,
  onToggle
}: {
  label: string;
  values: T[];
  options: SelectOption<T>[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className="checkbox-group">
      <legend>{label}</legend>
      <div className="chip-grid">
        {options.map((option) => (
          <label key={option.value} className="check-chip">
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
