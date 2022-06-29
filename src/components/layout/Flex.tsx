export function Flex(
  props: {
    children: JSX.Element;
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    border?: boolean;
    className?: string;
  }
) {

  const justify = props.justify || 'between';
  const align = props.align || 'start';

  let className = `d-flex justify-content-${justify} align-items-${align}`;

  if (props.border) {
    className += ' border-bottom';
  }

  if (props.className) {
    className += ` ${props.className}`;
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}
