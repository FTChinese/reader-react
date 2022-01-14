export function FullscreenSingleCol(
  props: {
    children: JSX.Element
  }
) {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {props.children}
        </div>
      </div>
    </div>
  );
}
