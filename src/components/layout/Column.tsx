
export function CenterColumn(
  props: {
    children: JSX.Element;
    maxWidth?: number;
  }
) {
  let maxWidth = 8;
  if (props.maxWidth) {
    if (props.maxWidth > 12) {
      maxWidth = 12;
    } else {
      maxWidth = props.maxWidth;
    }
  }

  return (
    <div className="row justify-content-center">
      <div className={`col-12 col-lg-${maxWidth}`}>
        {props.children}
      </div>
    </div>
  );
}
