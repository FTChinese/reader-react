import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/esm/types';

export function BaseButton(
  props: {
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
    variant?: ButtonVariant;
    children: JSX.Element | string
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'primary'}
      size={props.size}
      onClick={props.onClick}
    >
      { props.children }
    </Button>
  );
}

