import Spinner from 'react-bootstrap/Spinner';

export function InlineSpinner(
  props: {
    children: JSX.Element,
    progress: boolean,
  }
) {
  if (props.progress) {
    return <Spinner as="span" animation="border" size="sm"/>
  }

  return props.children;
}
