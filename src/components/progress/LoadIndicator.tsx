import { Spinner } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/types';

export function CircleLoader(
  props: {
    progress: boolean;
    large?: boolean;
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
      size={props.large ? undefined : 'sm'}
      variant={props.variant}
    />
  );
}
