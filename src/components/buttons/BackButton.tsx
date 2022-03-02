import { ArrowLeft } from '../graphics/icons';

export function BackButton(
  props: {
    onBack: () => void;
  }
) {
  return (
    <button className="btn btn-light" onClick={props.onBack}>
      <ArrowLeft/>
    </button>
  );
}
