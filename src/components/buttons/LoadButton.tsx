import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/types';

export function LoadButton(
  props: {
    text: string;
    disabled: boolean;
    onClick: () => void;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    variant?: ButtonVariant;
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'link'}
      size="sm"
      onClick={props.onClick}
    >
      { props.startIcon }
      { props.text }
      { props.endIcon }
    </Button>
  );
}
