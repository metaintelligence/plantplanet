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
  { value: 'promotion', label: '전시 홍보' }
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

  return (
    <section className="admin-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Generator</p>
          <h2>생성 옵션</h2>
        </div>
        <span className={isLoading ? 'run-state active' : 'run-state'}>CLI</span>
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
