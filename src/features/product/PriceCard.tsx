import Card from 'react-bootstrap/Card';
import { fontSize, TextScaled } from '../../components/text/BodyText';
import { PriceParts } from '../../data/localization';
import { CartItemUIParams } from '../../data/shopping-cart';

function PriceHighlight(
  props: {
    parts: PriceParts;
  }
) {
  return (
    <>
      <span>{props.parts.symbol}</span>
      <span className="scale-up2">
        {props.parts.integer}{props.parts.decimal}
      </span>
      <span>{props.parts.cycle}</span>
    </>
  );
}

function PriceOriginal(
  props: {
    parts: PriceParts;
    description: string;
    crossed: boolean;
  }
) {
  return (
    <>
      <span>{props.description}</span>
      <span className={props.crossed ? 'text-decoration-line-through' : ''}>
        {props.parts.symbol}
        {props.parts.integer}
        {props.parts.decimal}
        {props.parts.cycle}
      </span>
    </>
  );
}

/**
 * @description PriceCardBody displays a price in a card.
 * It is used in multiple places:
 * - In product card
 * - In payment dialog
 */
export function PriceCard(
  props: {
    params: CartItemUIParams;
    onClick?: () => void;
  }
) {

  const className = props.onClick
    ? 'h-100 cursor-pointer'
    : undefined;

  return (
    <Card
      className={className}
      onClick={props.onClick}
    >
     <Card.Header>
        {props.params.header}
      </Card.Header>

      <Card.Body className="text-center">
        <TextScaled
          size={0.8}
          text={props.params.title}
        />

        <div>
          <PriceHighlight
            parts={props.params.payable}
          />
        </div>

        <div
          style={fontSize(0.8)}
          className="text-black60"
        >
          {
            props.params.original &&
            <PriceOriginal
              description={props.params.original.description}
              crossed={props.params.original.crossed}
              parts={props.params.original.parts}
            />
          }
        </div>

      </Card.Body>

      <div className="text-center pb-3">
        <TextScaled
          size={0.5}
          className="text-black50"
          text={props.params.isAutoRenew ?
            '* 仅限Stripe支付' :
            '* 仅限支付宝或微信支付'}
        />
      </div>
    </Card>
  );
}

