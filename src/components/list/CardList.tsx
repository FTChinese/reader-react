import { StringPair } from './pair';
import { TwoColList } from './TwoColList';

export function CardList(
  props: {
    rows: StringPair[];
    header?: string;
    title?: string;
    children?: JSX.Element;
    className?: string;
  }
) {
  const wrapperClass = props.className ? `card ${props.className}` : 'card';

  return (
    <div className={wrapperClass}>
      {
        props.header &&
        <div className="card-header text-muted text-center">{props.header}</div>
      }
      {
        (props.title || props.children) &&
        <div className="card-body">
          {
            props.title &&
            <h5 className="card-title">{props.title}</h5>
          }
          {props.children}
        </div>
      }
      <TwoColList rows={props.rows}/>
    </div>
  );
}
