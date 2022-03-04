import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/types';
import { CircleLoader } from '../progress/LoadIndicator';

/**
 * @description SubmitButton is used in a plain form
 * without Formik.
 */
export function SubmitButton(
  props: {
    text: string;
    disabled: boolean;
    progress: boolean;
    variant?: ButtonVariant;
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'link'}
      size="sm"
      type="submit"
    >
      <CircleLoader
        progress={props.progress}
      />
      {props.text}
    </Button>
  )
}
