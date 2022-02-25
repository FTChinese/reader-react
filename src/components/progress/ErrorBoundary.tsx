export function ErrorBoundary(
  props: {
    errMsg: string;
    children: JSX.Element
  }
) {

  if (props.errMsg) {
    return (
      <div className="text-danger text-center">Error: {props.errMsg}</div>
    );
  }

  return props.children;
}
