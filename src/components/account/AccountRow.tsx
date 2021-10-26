export function AccountRow(
  props: {
    title: string;
    children: JSX.Element;
  }
) {
  return (
    <div className="border-bottom pb-3 pt-3">
      <h5>{props.title}</h5>
      {props.children}
    </div>
  );
}
