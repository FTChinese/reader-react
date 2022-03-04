export function Flex(
  props: {
    children: JSX.Element;
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  }
) {

  const justify = props.justify || 'between';
  const align = props.align || 'start';

  const className = `d-flex justify-content-${justify} align-items-${align}`;

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}
