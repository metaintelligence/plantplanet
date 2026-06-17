import type { Option } from '../../data/contentOptions';

export function SelectField<T extends string>({
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

export function CheckboxGroup<T extends string>({
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
            <input checked={values.includes(option.value)} type="checkbox" onChange={() => onToggle(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ChoiceGrid<T extends string>({
  title,
  description,
  items,
  value,
  onChange
}: {
  title: string;
  description: string;
  items: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section>
      <div className="section-title">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
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
