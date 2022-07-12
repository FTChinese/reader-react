import { CSSProperties } from 'react';

export function TextScaled(
  props: {
    size: number;
    text: string;
    className?: string;
  }
) {
  return (
    <span
      style={fontSize(props.size)}
      className={props.className}
    >
      {props.text}
    </span>
  );
}

export function fontSize(size: number): CSSProperties {
  return {
    fontSize: `${size}em`,
  }
}
