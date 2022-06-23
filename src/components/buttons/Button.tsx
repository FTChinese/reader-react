import { BaseButton } from './BaseButton';

export function PrimaryButton(
  props: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    leadingIcon?: JSX.Element;
    trailingIcon?: JSX.Element;
  }
) {
  return (
    <BaseButton
      text={props.text}
      onClick={props.onClick}
      disabled={props.disabled}
      startIcon={props.leadingIcon}
      endIcon={props.trailingIcon}
      variant="primary"
    />
  );
}

export function SecondaryButton(
  props: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    leadingIcon?: JSX.Element;
    trailingIcon?: JSX.Element;
  }
) {
  return (
    <BaseButton
      text={props.text}
      onClick={props.onClick}
      disabled={props.disabled}
      startIcon={props.leadingIcon}
      endIcon={props.trailingIcon}
      variant="secondary"
    />
  );
}

export function TextButton(
  props: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    leadingIcon?: JSX.Element;
    trailingIcon?: JSX.Element;
  }
) {
  return (
    <BaseButton
      text={props.text}
      onClick={props.onClick}
      disabled={props.disabled}
      startIcon={props.leadingIcon}
      endIcon={props.trailingIcon}
      variant="link"
      size="sm"
    />
  );
}

