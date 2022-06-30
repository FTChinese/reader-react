import { Flex } from './Flex';

export function TwoLineRow(
  props: {
    first: JSX.Element;
    second: JSX.Element;
  }
) {
  return (
    <div className="border-bottom pt-2 pb-2">
      {props.first}
      {props.second}
    </div>
  );
}

export function PrimaryLine(
  props: {
    text: string;
    trailIcon?: JSX.Element;
  }
) {
  if (!props.trailIcon) {
    return (
      <h6>{props.text}</h6>
    );
  }

  return (
    <Flex>
      <>
        <h6>{props.text}</h6>
        {props.trailIcon}
      </>
    </Flex>
  );
}

export function SecondaryLine(
  props: {
    text: string;
    className?: string;
  }
) {
  let className = 'scale-down8 text-black60';
  if (props.className) {
    className +=  ` ${props.className}`;
  }

  return (
    <div className={className}>
      {props.text}
    </div>
  );
}
