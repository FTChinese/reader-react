export function TwoColHeader(
  props: {
    left: JSX.Element;
    right: JSX.Element;
  }
) {
  return (
    <div className="d-flex justify-content-between align-items-start">
      {props.left}
      {props.right}
    </div>
  );
}
