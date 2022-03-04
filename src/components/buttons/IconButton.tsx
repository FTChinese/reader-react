import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/types';

export function IconButton(
  props: {
    text?: string;
    start?: JSX.Element;
    end?: JSX.Element;
    variant?: ButtonVariant;
    onClick?: () => void;
  }
) {
  return (
    <Button
      variant={props.variant || 'link'}
      size="sm"
      onClick={props.onClick}
    >
      { props.start }
      {
        props.text && <span className="scale-down8">{props.text}</span>
      }
      { props.end }
    </Button>
  );
}
