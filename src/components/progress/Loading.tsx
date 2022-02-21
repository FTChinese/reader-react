import Spinner from 'react-bootstrap/Spinner';

export function Loading(
  props: {
    loading: boolean;
    children: JSX.Element;
    text?: string;
  }
) {
  if (props.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner
          as="span"
          animation="border"
        />
        {
          props.text &&
          <span className="ms-2">
            {props.text}
          </span>
        }
      </div>
    );
  }

  return props.children;
}
