export function TwoColHeader(
  props: {
    left: JSX.Element;
    right: JSX.Element;
  }
) {
  return (
    <div className="d-flex justify-content-between align-items-center">
      {props.left}
      {props.right}
    </div>
  );
}
