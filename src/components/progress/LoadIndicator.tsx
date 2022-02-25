import { Spinner } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/types';

export function LoadIndicator(
  props: {
    progress: boolean;
    small?: boolean;
    variant?: Variant
  }
) {

  if (props.progress) {
    return <Spinner
      animation="border"
      size={props.small ? 'sm' : undefined}
      variant={props.variant}
    />;
  }

  return null;
}
