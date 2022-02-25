import { StringPair } from '../../data/pair';

export function HeadTailTable(
  props: {
    caption: string;
    rows: StringPair[];
  }
) {
  return (
    <table className="table">
      <caption className="text-center">{props.caption}</caption>
      <tbody>
        {
          props.rows.map((pair, i) => (
            <tr key={i}>
              <th scope="col">{pair[0]}</th>
              <td>{pair[1]}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
