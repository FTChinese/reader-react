import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export function LeadIconText(
  props: {
    icon: JSX.Element;
    text: string;
  }
) {
  return (
    <>
      {props.icon}
      <span className='ps-2'>{props.text}</span>
    </>
  );
}

export function TrailIconText(
  props: {
    icon: JSX.Element;
    text: string;
  }
) {
  return (
    <>
      <span className='pe-2'>{props.text}</span>
      {props.icon}
    </>
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

export function PrimaryButton(
  props: {
    children: JSX.Element;
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant="primary"
      size={props.size}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}

export function SecondaryButton(
  props: {
    children: JSX.Element;
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant="outline-primary"
      size={props.size}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}

export function DangerButton(
  props: {
    children: JSX.Element;
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant="outline-danger"
      size={props.size}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}

export function TextButton(
  props: {
    children: JSX.Element;
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
      {props.children}
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
