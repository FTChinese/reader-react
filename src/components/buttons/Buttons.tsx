import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/esm/types';
import Spinner from 'react-bootstrap/Spinner';
import { BoxArrowUpRight } from '../graphics/icons';

export function LeadIconText(
  props: {
    icon: JSX.Element;
    text: string;
  }
) {
  return (
    <span className="d-flex align-items-center">
      {props.icon}
      <span className='ps-1'>{props.text}</span>
    </span>
  );
}

export function TrailIconText(
  props: {
    icon: JSX.Element;
    text: string;
  }
) {
  return (
    <span className="d-flex align-items-center">
      <span className='pe-1'>{props.text}</span>
      {props.icon}
    </span>
  );
}

export function ExternalLink(
  props: {
    text: string;
    href: string;
  }
) {
  return (
    <a target="__blank"
      className="btn btn-link btn-sm"
      href={props.href}
    >
      <TrailIconText
        text={props.text}
        icon={<BoxArrowUpRight />}
      />
    </a>
  );
}

export function SpinnerOrText(
  props: {
    text: string;
    progress: boolean
  }
) {
  if (props.progress) {
    return (
      <Spinner
        as="span"
        animation="border"
        size="sm"
      />
    );
  } else {
    return (
      <>{props.text}</>
    );
  }
}

export function OButton(
  props: {
    children: JSX.Element;
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
    variant?: ButtonVariant
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'primary'}
      size={props.size}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}

export function BlockLoadButton(
  props: {
    text: string;
    onClick: () => void;
    progress: boolean;
    disabled?: boolean;
    size?: 'sm' | 'lg';
    variant?: ButtonVariant
    className?: string;
  }
) {

  let className = 'd-grid';
  if (props.className) {
    className += ` ${props.className}`;
  }

  return (
    <div className={className}>
      <Button
        disabled={props.disabled}
        variant={props.variant || 'primary'}
        size={props.size || 'sm'}
        onClick={props.onClick}
        type="button"
      >
        {
          props.progress ?
          <Spinner
            as="span"
            animation="border"
            size="sm"
          /> :
          <span>{props.text}</span>
        }
      </Button>
    </div>
  );
}

export function TrailIconButton(
  props: {
    text: string;
    icon: JSX.Element;
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
    variant?: ButtonVariant
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'link'}
      size={props.size || 'sm'}
      onClick={props.onClick}
      className="d-flex align-items-center"
    >
      <span className='pe-1'>{props.text}</span>
      {props.icon}
    </Button>
  );
}

export function LeadIconButton(
  props: {
    text: string;
    icon: JSX.Element;
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
    variant?: ButtonVariant
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'link'}
      size={props.size || 'sm'}
      onClick={props.onClick}
      className="d-flex align-items-center"
    >
      {props.icon}
      <span className='pe-1'>{props.text}</span>
    </Button>
  );
}

export function IconButton(
  props: {
    icon: JSX.Element;
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
    variant?: ButtonVariant
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'link'}
      size={props.size || 'sm'}
      onClick={props.onClick}
    >
      {props.icon}
    </Button>
  );
}

export function TextButton(
  props: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant="link"
      size="sm"
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
}

export function DisplayGrid(
  props: {
    children: JSX.Element;
    className?: string;
  }
) {
  let className = 'd-grid';
  if (props.className) {
    className += ` ${props.className}`;
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}
