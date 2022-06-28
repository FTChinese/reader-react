export function BorderHeader (
  props: {
    text: string;
    level?: number;
    center?: boolean;
  }
) {
  let className = 'border-bottom text-black60';

  if (props.center) {
    className += ' tetxt-center';
  }

  switch (props.level) {
    case 1:
      return (
        <h1 className={className}>{props.text}</h1>
      );

    case 2:
      return (
        <h2 className={className}>{props.text}</h2>
      );

    case 3:
      return (
        <h3 className={className}>{props.text}</h3>
      );

    case 4:
      return (
        <h4 className={className}>{props.text}</h4>
      );

    case 5:
      return (
        <h5 className={className}>{props.text}</h5>
      );

    default:
      return (
        <h6 className={className}>{props.text}</h6>
      );
  }
}
