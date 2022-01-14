export function ProgressButton(
  props: {
    disabled: boolean;
    text: string;
    isSubmitting: boolean;
    variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary';
    styleClass?: string;
    inline?: boolean;
    asButton?: boolean;
    onClick?: () => void
  }
) {

  let styleClass = 'primary';
  if (props.variant) {
    styleClass = props.variant;
  }

  if (props.styleClass) {
    styleClass += ` ${props.styleClass}`;
  }

  const btn = (
    <button
      className={`btn btn-${styleClass}`}
      type={props.asButton ? 'button' : 'submit'}
      disabled={props.disabled}
      onClick={props.onClick}>
      {
        props.isSubmitting
        ? <span className="spinner-border spinner-border-sm"></span>
        : props.text
      }
    </button>
  );

  if (props.inline) {
    return btn;
  }

  return (
    <div className="d-grid">
      {btn}
    </div>
  );
}
