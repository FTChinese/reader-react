import { Spinner } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/types';

/**
 * @deprecated
 */
export function LoadIndicator(
  props: {
    progress: boolean;
    small?: boolean;
    variant?: Variant
  }
) {

  if (props.progress) {
    return <Spinner
      as="span"
      animation="border"
      size={props.small ? 'sm' : undefined}
      variant={props.variant}
    />;
  }

  return null;
}

export function CircleLoader(
  props: {
    progress: boolean;
    small?: boolean;
    variant?: Variant;
  }
) {
  if (!props.progress) {
    return null;
  }

  return (
    <Spinner
      as="span"
      animation="border"
      size={props.small ? 'sm' : undefined}
      variant={props.variant}
    />
  );
}
