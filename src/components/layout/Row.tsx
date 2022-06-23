export function BlockRow(
  props: {
    children: JSX.Element;
  }
) {
  return (
    <div className="d-grid">
      {props.children}
    </div>
  )
}
