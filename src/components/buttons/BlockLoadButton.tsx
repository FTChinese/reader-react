import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/types';
import { CircleLoader } from '../progress/LoadIndicator';

/**
 * @description Used when we need to submit data
 * without a form.
 */
export function BlockLoadButton(
  props: {
    disabled: boolean;
    text: string;
    progress: boolean;
    variant?: ButtonVariant;
    onClick?: () => void
  }
) {

  const btn = (
    <Button
      disabled={props.disabled}
      variant={props.variant}
      onClick={props.onClick}
      size="sm"
      type="button"
    >
      <CircleLoader
        progress={props.progress}
      />
      {
        !props.progress &&
         <span>{props.text}</span>
      }
    </Button>
  );

  return (
    <div className="d-grid">
      {btn}
    </div>
  );
}
