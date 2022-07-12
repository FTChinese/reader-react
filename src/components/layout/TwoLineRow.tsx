import { fontSize } from '../text/BodyText';
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
  return (
    <div
      style={fontSize(0.8)}
      className="text-black60"
    >
      {props.text}
    </div>
  );
}
