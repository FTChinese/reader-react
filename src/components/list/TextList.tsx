/**
 * @description Show a list of plain text.
 */
export function TextList(
  props: {
    lines: string[];
    className?: string;
  }
) {

  return (
    <ul className={props.className}>
      {
        props.lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))
      }
    </ul>
  );
}
