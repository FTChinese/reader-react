export function TextScaled(
  props: {
    size: number;
    text: string;
    className?: string;
  }
) {
  const fontStyle = {
    fontSize: `${props.size}em`,
  };

  return (
    <span
      style={fontStyle}
      className={props.className}
    >
      {props.text}
    </span>
  );
}

export function BlockTextScaled(
  props: {
    size: number;
    children?: JSX.Element;
    className?: string;
  }
) {
  const fontStyle = {
    fontSize: `${props.size}em`,
  };

  return (
    <div
      style={fontStyle}
      className={props.className}
    >
      {props.children}
    </div>
  );
}
