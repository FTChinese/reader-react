import { StringPair } from '../../data/pair';

export function TwoColList(
  props: {
    rows: StringPair[],
  }
) {
  return (
    <ul className="list-group list-group-flush">
      {
        props.rows.map((row, index) =>
          <li
            className="list-group-item d-flex justify-content-between"
            key={index}
          >
            <span>{row[0]}</span>
            <span>{row[1]}</span>
          </li>
        )
      }
    </ul>
  )
}
