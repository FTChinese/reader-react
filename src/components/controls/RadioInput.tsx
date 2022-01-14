import { useField } from 'formik';

export function RadioInput(
  props: {
    id: string;
    name: string;
    label: string;
    value: string;
    desc?: string;
    disabled?: boolean;
    checked?: boolean;
  }
) {
  const [ field, meta ] = useField(props.name);
  const isInvalid = meta.touched && meta.error;

  return (
    <div className="mb-3 mt-3">
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          id={props.id}
          name={props.name}
          checked={props.checked}
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={props.value}
        />
        <label
          className="form-check-label"
          htmlFor={props.id}
        >
          {props.label}
        </label>
      </div>
      {
        props.desc ? (
          <small className="form-text text-muted">{props.desc}</small>
        ) : null
      }
      {
        isInvalid ? (
          <div className="invalid-feedback">{meta.error}</div>
        ) : null
      }
    </div>
  );
}
