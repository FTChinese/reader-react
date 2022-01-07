export function FullscreenTwoCols(
  props: {
    children: JSX.Element;
    right?: JSX.Element;
  }
) {
  return (
    <div className="container-fluid">
      <div className="row row-cols-1 row-cols-md-2">
        <div className="col">
          {props.children}
        </div>
        <div className="col">
          {props.right}
        </div>
      </div>
    </div>
  );
}
