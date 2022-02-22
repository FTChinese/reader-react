import { StringPair } from '../../data/pair';

export function DescriptionList(
  props: {
    rows: StringPair[],
  }
) {
  return (
    <dl>
      {
        props.rows.map((row, index) => <DescContent pair={row} key={index} />)
      }
    </dl>
  );
}

function DescContent(
  props: {
    pair: StringPair,
  }
) {
  return (
    <>
      <dt>{props.pair[0]}</dt>
      <dd>{props.pair[1]}</dd>
    </>
  )
}
