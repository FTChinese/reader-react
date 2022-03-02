import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/types';
import { ChevronRight } from '../graphics/icons';

export function RowContainer(
  props: {
    children: JSX.Element;
  }
) {
  return (
    <div className="border-bottom pt-2 pb-2">
      {props.children}
    </div>
  );
}

export function RowSecondary(
  props: {
    children: JSX.Element;
    className?: string;
  }
) {
  let className = 'scale-down8 text-black50';
  if (props.className) {
    className +=  ` ${props.className}`;
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}

export function RowTrailButton(
  props: {
    text?: string;
    hideIcon?: boolean;
    variant?: ButtonVariant
    onClick?: () => void;
  }
) {
  return (
    <Button
      variant={props.variant || 'link'}
      size="sm"
      onClick={props.onClick}
    >
      {
        props.text && <span className="scale-down8">{props.text}</span>
      }
      {
        !props.hideIcon && <ChevronRight />
      }
    </Button>
  );
}
