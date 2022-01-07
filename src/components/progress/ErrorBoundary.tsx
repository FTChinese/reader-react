export function ErrorBoudary(
  props: {
    errMsg: string;
    children: JSX.Element
  }
) {

  if (props.errMsg) {
    return (
      <div className="text-danger">Error: {props.errMsg}</div>
    );
  }

  return props.children;
}
