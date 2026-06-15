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
  layoutOptions,
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
  DeploymentUse,
  FeatureOption,
  FocusTopic,
  GeneratedContent,
  Language,
  LayoutId,
  PlantRecord
} from '../types/content';

interface ContentWizardProps {
  plants: PlantRecord[];
  editingContent: GeneratedContent | null;
  generationBlocked: boolean;
  activeJobTitle?: string;
  onGenerate: (content: GeneratedContent) => Promise<void>;
  onCancel: () => void;
}

const generalSteps = ['mode', 'plant', 'intent', 'template', 'audience', 'timing', 'review'] as const;
const advancedSteps = ['mode', 'plant', 'intent', 'template', 'layout', 'audience', 'field', 'review'] as const;
const selectableDeploymentValues = new Set(deploymentOptions.map((option) => option.value));

type StepKey = (typeof generalSteps)[number] | (typeof advancedSteps)[number];

export default function ContentWizard({
  plants,
  editingContent,
  generationBlocked,
  activeJobTitle,
  onGenerate,
  onCancel
}: ContentWizardProps) {
  const [draft, setDraft] = useState<ContentSettings>(() =>
    createWizardSettings(editingContent, plants[0]?.id ?? '')
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentNameTouched, setContentNameTouched] = useState(() =>
    Boolean(editingContent?.settings.contentName || editingContent?.title)
  );

  useEffect(() => {
    const nextSettings = createWizardSettings(editingContent, plants[0]?.id ?? '');
    setDraft(nextSettings);
    setStepIndex(0);
    setGenerationStatus('');
    setContentNameTouched(Boolean(editingContent?.settings.contentName || editingContent?.title));
  }, [editingContent, plants]);

  const steps = draft.mode === 'advanced' ? advancedSteps : generalSteps;
  const step = steps[stepIndex] as StepKey;
  const selectedPlant = plants.find((plant) => plant.id === draft.plantId) ?? plants[0];
  const settingsJson = useMemo(() => JSON.stringify(draft, null, 2), [draft]);
  const canGenerate = Boolean(draft.contentName.trim()) && !isSubmitting && !generationBlocked;

  useEffect(() => {
    if (stepIndex > steps.length - 1) {
      setStepIndex(steps.length - 1);
    }
  }, [stepIndex, steps.length]);

  useEffect(() => {
    if (step !== 'review' || !selectedPlant || contentNameTouched) {
      return;
    }

    const nextName = buildDefaultContentName(selectedPlant.koreanName, draft.template);
    setDraft((current) => (current.contentName === nextName ? current : { ...current, contentName: nextName }));
  }, [contentNameTouched, draft.template, selectedPlant, step]);

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

  const handleModeChange = (mode: ContentSettings['mode']) => {
    setDraft((current) => ({
      ...current,
      mode,
      layoutId: mode === 'advanced' ? current.layoutId : 'generated'
    }));
  };

  const handleLayoutChange = (layoutId: LayoutId) => {
    if (layoutId === 'default') {
      window.alert('생성형AI를 사용하지 않고 기본 레이아웃을 재사용합니다.');
    }
    update('layoutId', layoutId);
  };

  const handleTemplateChange = (template: ContentSettings['template']) => {
    setDraft((current) => ({
      ...current,
      template,
      storyScenario: template === 'storytelling' ? current.storyScenario ?? 'nameSecret' : undefined
    }));
  };

  const canGoNext = step !== 'plant' || Boolean(draft.plantId);
  const isLastStep = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep && canGoNext) {
      setStepIndex((current) => current + 1);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPlant) {
      return;
    }

    if (generationBlocked) {
      setGenerationStatus(
        activeJobTitle
          ? `"${activeJobTitle}" 작업이 진행 중입니다. 완료 후 새 요청을 시작할 수 있습니다.`
          : '진행 중인 생성 작업이 있어 새 요청을 시작할 수 없습니다.'
      );
      return;
    }

    const contentName = draft.contentName.trim();
    if (!contentName) {
      setGenerationStatus('콘텐츠 이름을 입력해주세요.');
      return;
    }

    const generationSettings: ContentSettings = {
      ...draft,
      contentName,
      layoutId: draft.mode === 'advanced' ? draft.layoutId : 'generated'
    };
    const generatedContent = generateContentFromSettings(generationSettings, selectedPlant, editingContent ?? undefined);

    setIsSubmitting(true);
    setGenerationStatus(
      generationSettings.layoutId === 'default'
        ? '기본 레이아웃 콘텐츠를 서버 파일에 저장합니다.'
        : '설명 포함 생성 요청 JSON을 준비했습니다.'
    );

    try {
      await onGenerate(generatedContent);
    } catch (error) {
      setGenerationStatus(error instanceof Error ? error.message : '로컬 생성 서버 요청에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wizard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Content Wizard</p>
          <h1>{editingContent ? '콘텐츠 수정' : '콘텐츠 생성'}</h1>
          <p>설정값을 단계적으로 수집한 뒤 설명 포함 JSON으로 변환하고, 선택한 레이아웃 방식에 따라 콘텐츠를 생성합니다.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onCancel}>
          콘텐츠 관리로 이동
        </button>
      </header>

      {generationBlocked && (
        <div className="notice-banner">
          {activeJobTitle
            ? `"${activeJobTitle}" 작업이 진행 중입니다. 신규 페이지 생성은 작업 완료 후 가능합니다.`
            : '진행 중인 작업이 있어 신규 페이지 생성은 잠시 중단됩니다.'}
        </div>
      )}

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
                { value: 'general', label: '일반 생성', description: '필수 설정 중심으로 생성형AI 레이아웃 작업을 요청합니다.' },
                { value: 'advanced', label: '고급 생성', description: '목적, 톤, 단말기, 레이아웃 방식까지 세부 설정합니다.' }
              ]}
              value={draft.mode}
              onChange={handleModeChange}
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

          {step === 'intent' && (
            <section>
              <SectionTitle title="목적, 강조 콘텐츠, 톤" description="페이지 목적을 먼저 정하고, 강조할 소재와 문장 톤을 함께 선택합니다." />
              <div className="form-grid">
                <SelectField
                  label="목적"
                  options={purposeOptions}
                  value={draft.purpose}
                  onChange={(value) => update('purpose', value)}
                />
                <SelectField
                  label="톤"
                  options={toneOptions}
                  value={draft.tone}
                  onChange={(value) => update('tone', value)}
                />
              </div>
              <CheckboxGroup
                label="강조 콘텐츠"
                options={focusTopicOptions}
                values={draft.focusTopics}
                onToggle={(value) => toggleList('focusTopics', value)}
              />
            </section>
          )}

          {step === 'template' && (
            <section>
              <ChoiceGrid
                title="콘텐츠 유형 선택"
                items={templateOptions}
                value={draft.template}
                onChange={handleTemplateChange}
              />
              {draft.template === 'storytelling' && (
                <div className="form-grid">
                  <SelectField
                    label="스토리 시나리오"
                    options={storyScenarioOptions}
                    value={draft.storyScenario ?? 'nameSecret'}
                    onChange={(value) => update('storyScenario', value)}
                  />
                </div>
              )}
            </section>
          )}

          {step === 'layout' && (
            <ChoiceGrid
              title="템플릿 레이아웃 선택"
              items={layoutOptions}
              value={draft.layoutId}
              onChange={handleLayoutChange}
            />
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
                label="배포 단말기"
                options={deploymentOptions}
                value={draft.deploymentUse}
                onChange={(value) => update('deploymentUse', value)}
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
            </section>
          )}

          {step === 'field' && (
            <section>
              <SectionTitle title="현장, 단말기, 세부 조건" description="실제 배포 환경과 현장 맥락을 생성 프롬프트에 반영합니다." />
              <div className="form-grid">
                <SelectField
                  label="배포 단말기"
                  options={deploymentOptions}
                  value={draft.deploymentUse}
                  onChange={(value) => update('deploymentUse', value)}
                />
                <SelectField
                  label="실제 현장"
                  options={fieldLocationOptions}
                  value={draft.fieldLocation}
                  onChange={(value) => update('fieldLocation', value)}
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
                title="콘텐츠 이름과 생성 요청 JSON 확인"
                description={`${selectedPlant.koreanName} 콘텐츠 생성에 사용할 이름과 CLI가 해석할 요청 패킷입니다.`}
              />
              <label className="field content-name-field">
                <span>콘텐츠 이름</span>
                <input
                  required
                  value={draft.contentName}
                  placeholder={buildDefaultContentName(selectedPlant.koreanName, draft.template)}
                  onChange={(event) => {
                    setContentNameTouched(true);
                    update('contentName', event.target.value);
                  }}
                />
              </label>
              <pre className="json-preview">{settingsJson}</pre>
              {generationStatus && <div className="socket-status">{generationStatus}</div>}
              <button className="primary-button" type="button" disabled={!canGenerate} onClick={handleGenerate}>
                {isSubmitting && <span className="button-spinner" aria-hidden="true" />}
                {isSubmitting
                  ? '백그라운드 작업 시작 중'
                  : draft.mode === 'advanced' && draft.layoutId === 'default'
                    ? '기본 레이아웃으로 저장'
                    : editingContent
                      ? '수정 내용 저장'
                      : '콘텐츠 생성'}
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
    intent: '목적/강조/톤',
    template: '콘텐츠 유형',
    layout: '레이아웃',
    audience: '대상/언어',
    timing: '단말기/시간',
    field: '현장/단말기',
    review: 'JSON 확인'
  };
  return labels[step] ?? step;
}

function createWizardSettings(editingContent: GeneratedContent | null, fallbackPlantId: string): ContentSettings {
  const settings = editingContent?.settings ?? createDefaultSettings(fallbackPlantId);
  const deploymentUse = selectableDeploymentValues.has(settings.deploymentUse)
    ? settings.deploymentUse
    : ('mobile' as DeploymentUse);

  return {
    ...settings,
    deploymentUse,
    storyScenario: settings.template === 'storytelling' ? settings.storyScenario ?? 'nameSecret' : undefined,
    contentName: settings.contentName || editingContent?.title || '',
    layoutId: settings.mode === 'advanced' ? settings.layoutId ?? 'generated' : 'generated'
  };
}

function buildDefaultContentName(plantName: string, template: ContentSettings['template']) {
  return `${plantName}_${labelOf(templateOptions, template)}_${formatRequestDate(new Date())}`;
}

function formatRequestDate(date: Date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());
  const hours = padDatePart(date.getHours());
  const minutes = padDatePart(date.getMinutes());
  const seconds = padDatePart(date.getSeconds());

  return `${year}${month}${day}_${hours}:${minutes}:${seconds}`;
}

function padDatePart(value: number) {
  return String(value).padStart(2, '0');
}
