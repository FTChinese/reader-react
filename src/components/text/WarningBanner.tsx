export function WarningBanner(
  props: {
    text: string;
  }
) {
  return (
    <div className="text-center bg-danger text-white mb-3">
      {props.text}
    </div>
  );
}
