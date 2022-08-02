import { CSSProperties } from 'react';

export function IconListItem(
  props: {
    icon?: JSX.Element;
    children: string | JSX.Element;
  }
) {

  return (
    <li className='d-flex'>
      {
        props.icon &&
        <span className='me-2'>{props.icon}</span>
      }
      {props.children}
    </li>
  )
}

export function IconTextList(
  props: {
    icon: JSX.Element;
    lines: string[];
    className?: string;
  }
) {

  const style: CSSProperties = {
    listStyle: 'none',
    padding: 0,
  };

  return (
    <ul
      className={props.className}
      style={style}
    >
      {
        props.lines.map((line, i) => (
          <IconListItem
            key={i}
            icon={props.icon}
          >
            {line}
          </IconListItem>
        ))
      }
    </ul>
  );
}
