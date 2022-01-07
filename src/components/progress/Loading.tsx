export function Loading(
  props: {
    loading: boolean;
    children: JSX.Element;
  }
) {
  if (props.loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  return props.children;
}
