import { GlobalSpinner } from './progress/GlobalSpinner';

export function ProgressOrError(
  props: {
    errMsg: string;
    progress?: boolean;
    children?: JSX.Element
  }
) {
  if (props.progress) {
    return <GlobalSpinner/>;
  }

  if (props.errMsg) {
    return (
      <div className="text-center">
        <div>出错了！</div>
        <div className="text-danger">{props.errMsg}</div>
      </div>
    );
  }

  if (props.children) {
    return props.children
  }

  return <></>;
}
