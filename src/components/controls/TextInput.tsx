import { useField } from 'formik';

interface FormGroupProps {
  name: string;
  type: 'email' | 'password' | 'text' | 'url' | 'number';
  label?: string;
  placeholder?: string;
  desc?: string;
  disabled?: boolean;
}

export function TextInput(
  props: FormGroupProps,
) {
  const [ field, meta ] = useField(props);

  const isInvalid = meta.touched && meta.error;

  return (
    <div className="mb-2">
      { props.label &&
        <label
          className="form-label"
          htmlFor={props.name}
        >
          {props.label}
        </label>
      }
      <input
        className={`form-control${isInvalid ? ' is-invalid' : ''}`}
        id={props.name}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        disabled={props.disabled === true}
      />
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
