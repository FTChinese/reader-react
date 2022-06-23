import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/types';

export function BaseButton(
  props: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    variant?: ButtonVariant;
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'link'}
      size={props.size}
      onClick={props.onClick}
    >
      { props.startIcon }
      { props.text }
      { props.endIcon }
    </Button>
  );
}
