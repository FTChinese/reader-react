import { GlobalSpinner } from './progress/GlobalSpinner';

export function ProgressOrError(
  props: {
    progress: boolean;
    errMsg: string;
    children?: JSX.Element
  }
) {
  if (props.progress) {
    return <GlobalSpinner/>;
  }

  if (props.errMsg) {
    return (
      <div className="text-danger text-center">
        <div>出错了！</div>
        <div>{props.errMsg}</div>
      </div>
    );
  }

  if (props.children) {
    return props.children
  }

  return <></>;
}
