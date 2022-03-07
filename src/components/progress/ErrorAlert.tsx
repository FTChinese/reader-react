import Alert from 'react-bootstrap/Alert';

export function ErrorAlert(
  props: {
    msg: string;
    onClose: () => void;
  }
) {
  if (!props.msg) {
    return null;
  }

  return (
    <Alert
      variant="danger"
      dismissible
      onClose={props.onClose}
    >
      {props.msg}
    </Alert>
  );
}
