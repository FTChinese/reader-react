export function RowContainer(
  props: {
    children: JSX.Element;
  }
) {
  return (
    <div className="border-bottom pt-2 pb-2">
      {props.children}
    </div>
  );
}
