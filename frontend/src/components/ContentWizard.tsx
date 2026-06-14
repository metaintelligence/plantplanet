import { useEffect, useMemo, useState } from 'react';
import {
  audienceOptions,
  deploymentOptions,
  estimatedTimeOptions,
  featureOptions,
  fieldLocationOptions,
  focusTopicOptions,
  labelOf,
  languageOptions,
  purposeOptions,
  seasonOptions,
  storyScenarioOptions,
  templateOptions,
  toneOptions,
  type Option
} from '../data/contentOptions';
import { createDefaultSettings, generateContentFromSettings } from '../lib/contentGenerator';
import type {
  Audience,
  ContentSettings,
  FeatureOption,
  FocusTopic,
  GeneratedContent,
  Language,
  PlantRecord
} from '../types/content';

interface ContentWizardProps {
  plants: PlantRecord[];
  editingContent: GeneratedContent | null;
  onSave: (content: GeneratedContent) => void;
  onCancel: () => void;
}

const generalSteps = ['mode', 'plant', 'template', 'audience', 'timing', 'review'] as const;
const advancedSteps = [
  'mode',
  'plant',
  'focus',
  'distribution',
  'layout',
  'intent',
  'audience',
  'field',
  'review'
] as const;

type StepKey = (typeof generalSteps)[number] | (typeof advancedSteps)[number];

export default function ContentWizard({ plants, editingContent, onSave, onCancel }: ContentWizardProps) {
  const [draft, setDraft] = useState<ContentSettings>(() =>
    editingContent?.settings ?? createDefaultSettings(plants[0]?.id ?? '')
  );
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const nextSettings = editingContent?.settings ?? createDefaultSettings(plants[0]?.id ?? '');
    setDraft(nextSettings);
    setStepIndex(0);
  }, [editingContent, plants]);

  const steps = draft.mode === 'advanced' ? advancedSteps : generalSteps;
  const step = steps[stepIndex] as StepKey;
  const selectedPlant = plants.find((plant) => plant.id === draft.plantId) ?? plants[0];
  const settingsJson = useMemo(() => JSON.stringify(draft, null, 2), [draft]);

  const update = <K extends keyof ContentSettings>(key: K, value: ContentSettings[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const toggleList = <K extends 'focusTopics' | 'featureOptions' | 'audience' | 'languages'>(
    key: K,
    value: ContentSettings[K][number]
  ) => {
    setDraft((current) => {
      const values = current[key] as string[];
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];
      return { ...current, [key]: nextValues };
    });
  };

  const canGoNext = step !== 'plant' || Boolean(draft.plantId);
  const isLastStep = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep && canGoNext) {
      setStepIndex((current) => current + 1);
    }
  };

  const handleGenerate = () => {
    if (!selectedPlant) {
      return;
    }
    onSave(generateContentFromSettings(draft, selectedPlant, editingContent ?? undefined));
  };

  return (
    <div className="wizard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Content Wizard</p>
          <h1>{editingContent ? '콘텐츠 수정' : '콘텐츠 생성'}</h1>
          <p>설정값을 단계적으로 수집한 뒤 JSON 문자열로 변환하고 기본 레이아웃 페이지를 생성합니다.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onCancel}>
          콘텐츠 관리로 이동
        </button>
      </header>

      <div className="wizard-layout">
        <aside className="wizard-steps">
          {steps.map((item, index) => (
            <div className={index === stepIndex ? 'active' : ''} key={item}>
              <span>{index + 1}</span>
              <strong>{stepLabel(item)}</strong>
            </div>
          ))}
        </aside>

        <section className="wizard-card">
          {step === 'mode' && (
            <ChoiceGrid
              title="생성 방식 선택"
              items={[
                { value: 'general', label: '일반 생성', description: '필수 설정만 입력하고 디폴트 레이아웃을 즉시 사용합니다.' },
                { value: 'advanced', label: '고급 생성', description: '배포 용도, 레이아웃, 톤, 기능 옵션까지 절차적으로 설정합니다.' }
              ]}
              value={draft.mode}
              onChange={(value) => update('mode', value)}
            />
          )}

          {step === 'plant' && (
            <section>
              <SectionTitle title="대상 식물 선택" description="mock_db.json의 식물 데이터를 기반으로 콘텐츠를 생성합니다." />
              <div className="plant-picker-grid">
                {plants.map((plant) => (
                  <button
                    className={draft.plantId === plant.id ? 'plant-picker-card selected' : 'plant-picker-card'}
                    key={plant.id}
                    type="button"
                    onClick={() => update('plantId', plant.id)}
                  >
                    <img src={plant.image.url} alt={plant.image.alt} />
                    <strong>{plant.koreanName}</strong>
                    <span>{plant.scientificName}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 'template' && (
            <section>
              <ChoiceGrid
                title="템플릿 선택"
                items={templateOptions}
                value={draft.template}
                onChange={(value) => update('template', value)}
              />
              <div className="form-grid">
                <SelectField
                  label="페이지 목적"
                  options={purposeOptions}
                  value={draft.purpose}
                  onChange={(value) => update('purpose', value)}
                />
                <div className="layout-choice selected">
                  <strong>Default Layout</strong>
                  <span>일반 생성은 기본 레이아웃을 즉시 사용합니다.</span>
                </div>
              </div>
            </section>
          )}

          {step === 'focus' && (
            <section>
              <SectionTitle title="주요 설명 항목" description="고급 생성에서 강조할 콘텐츠 소재를 선택합니다." />
              <CheckboxGroup
                options={focusTopicOptions}
                values={draft.focusTopics}
                onToggle={(value) => toggleList('focusTopics', value)}
              />
            </section>
          )}

          {step === 'distribution' && (
            <section>
              <ChoiceGrid
                title="템플릿 선택"
                items={templateOptions}
                value={draft.template}
                onChange={(value) => update('template', value)}
              />
              <div className="form-grid">
                <SelectField
                  label="배포 용도"
                  options={deploymentOptions}
                  value={draft.deploymentUse}
                  onChange={(value) => update('deploymentUse', value)}
                />
              </div>
            </section>
          )}

          {step === 'layout' && (
            <section>
              <SectionTitle title="페이지 레이아웃 선택" description="현재 데모에서는 템플릿별 기본 레이아웃만 선택할 수 있습니다." />
              <button className="layout-choice selected wide" type="button" onClick={() => update('layoutId', 'default')}>
                <strong>Default Layout</strong>
                <span>{labelOf(templateOptions, draft.template)} 템플릿의 기본 페이지 파일을 사용합니다.</span>
              </button>
            </section>
          )}

          {step === 'intent' && (
            <section className="form-grid">
              <SelectField
                label="페이지 목적"
                options={purposeOptions}
                value={draft.purpose}
                onChange={(value) => update('purpose', value)}
              />
              <SelectField
                label="페이지 톤"
                options={toneOptions}
                value={draft.tone}
                onChange={(value) => update('tone', value)}
              />
            </section>
          )}

          {step === 'audience' && (
            <section>
              <SectionTitle title="대상과 언어" description="문장 난이도와 다국어 대응을 결정합니다." />
              <CheckboxGroup
                label="대상 고객"
                options={audienceOptions}
                values={draft.audience}
                onToggle={(value) => toggleList('audience', value)}
              />
              <CheckboxGroup
                label="대상 언어"
                options={languageOptions}
                values={draft.languages}
                onToggle={(value) => toggleList('languages', value)}
              />
            </section>
          )}

          {step === 'timing' && (
            <section className="form-grid">
              <SelectField
                label="현재 계절"
                options={seasonOptions}
                value={draft.season}
                onChange={(value) => update('season', value)}
              />
              <SelectField
                label="목표 체험 시간"
                options={estimatedTimeOptions}
                value={draft.estimatedTime}
                onChange={(value) => update('estimatedTime', value)}
              />
            </section>
          )}

          {step === 'field' && (
            <section>
              <div className="form-grid">
                <SelectField
                  label="실제 현장"
                  options={fieldLocationOptions}
                  value={draft.fieldLocation}
                  onChange={(value) => update('fieldLocation', value)}
                />
                <SelectField
                  label="스토리 시나리오"
                  options={storyScenarioOptions}
                  value={draft.storyScenario ?? 'nameSecret'}
                  onChange={(value) => update('storyScenario', value)}
                />
                <SelectField
                  label="현재 계절"
                  options={seasonOptions}
                  value={draft.season}
                  onChange={(value) => update('season', value)}
                />
                <SelectField
                  label="목표 체험 시간"
                  options={estimatedTimeOptions}
                  value={draft.estimatedTime}
                  onChange={(value) => update('estimatedTime', value)}
                />
              </div>
              <CheckboxGroup
                label="추가 기능 옵션"
                options={featureOptions}
                values={draft.featureOptions}
                onToggle={(value) => toggleList('featureOptions', value)}
              />
              <label className="field full">
                <span>추가 요청사항</span>
                <textarea
                  value={draft.extraRequest}
                  placeholder="예: 초등학생도 이해할 수 있게, 기후위기 메시지를 강조해줘."
                  onChange={(event) => update('extraRequest', event.target.value)}
                />
              </label>
            </section>
          )}

          {step === 'review' && selectedPlant && (
            <section>
              <SectionTitle
                title="설정 JSON 확인"
                description={`${selectedPlant.koreanName} 콘텐츠 생성에 사용할 설정값입니다.`}
              />
              <pre className="json-preview">{settingsJson}</pre>
              <button className="primary-button" type="button" onClick={handleGenerate}>
                {editingContent ? '수정 내용 저장' : '콘텐츠 생성'}
              </button>
            </section>
          )}

          <footer className="wizard-footer">
            <button
              className="secondary-button"
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            >
              이전
            </button>
            {!isLastStep && (
              <button className="primary-button" type="button" disabled={!canGoNext} onClick={handleNext}>
                다음
              </button>
            )}
          </footer>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function ChoiceGrid<T extends string>({
  title,
  items,
  value,
  onChange
}: {
  title: string;
  items: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section>
      <SectionTitle title={title} description="항목을 선택하면 다음 단계에서 설정값으로 반영됩니다." />
      <div className="choice-grid">
        {items.map((item) => (
          <button
            className={value === item.value ? 'choice-card selected' : 'choice-card'}
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
          >
            <strong>{item.label}</strong>
            {item.description && <span>{item.description}</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

function SelectField<T extends string>({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: Option<T>[];
  value: T;
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

function CheckboxGroup<T extends Audience | Language | FocusTopic | FeatureOption>({
  label,
  options,
  values,
  onToggle
}: {
  label?: string;
  options: Option<T>[];
  values: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className="checkbox-group">
      {label && <legend>{label}</legend>}
      <div className="chip-grid">
        {options.map((option) => (
          <label className="check-chip" key={option.value}>
            <input
              checked={values.includes(option.value)}
              type="checkbox"
              onChange={() => onToggle(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function stepLabel(step: string) {
  const labels: Record<string, string> = {
    mode: '생성 방식',
    plant: '대상 식물',
    template: '템플릿',
    focus: '설명 항목',
    distribution: '배포/템플릿',
    layout: '레이아웃',
    intent: '목적/톤',
    audience: '대상/언어',
    timing: '계절/시간',
    field: '현장/기능',
    review: 'JSON 확인'
  };
  return labels[step] ?? step;
}
