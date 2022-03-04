import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/types';
import { CircleLoader } from '../progress/LoadIndicator';

export function ProgressButton(
  props: {
    disabled: boolean;
    text: string;
    progress: boolean;
    variant?: ButtonVariant;
    className?: string;
    block?: boolean;
    onClick?: () => void
  }
) {

  let styleClass = 'primary';

  if (props.className) {
    styleClass += ` ${props.className}`;
  }

  const btn = (
    <Button
      disabled={props.disabled}
      variant={props.variant}
      className={props.className}
      onClick={props.onClick}
      size="sm"
      type="button"
    >
      <CircleLoader
        progress={props.progress}
        small={true}
      />
      {
        !props.progress &&
         <span>{props.text}</span>
      }
    </Button>
  );

  if (props.block) {
    return (
      <div className="d-grid">
        {btn}
      </div>
    );
  }

  return btn;
}
