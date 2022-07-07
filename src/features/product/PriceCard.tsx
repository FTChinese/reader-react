import Card from 'react-bootstrap/Card';
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

function PriceCrossed(
  props: {
    parts?: PriceParts;
  }
) {
  if (!props.parts) {
    return null;
  }

  return (
    <>
      <span>原价</span>
      <del>
        {props.parts.symbol}
        {props.parts.integer}
        {props.parts.decimal}
        {props.parts.cycle}
      </del>
    </>
  );
}

function PriceAutoRenewed(
  props: {
    parts?: PriceParts;
  }
) {

  if (!props.parts) {
    return null;
  }

  return (
    <>
      <span>试用结束后自动续订</span>
      <span>
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
        <div className="scale-down8">
          {props.params.title}
        </div>

        <div>
          <PriceHighlight
            parts={props.params.payable}
          />
        </div>

        <div className="text-black60 scale-down5">
          {
            props.params.crossed &&
            <PriceCrossed
              parts={props.params.crossed}
            />
          }
          {
            props.params.postTrial &&
            <PriceAutoRenewed
              parts={props.params.crossed}
            />
          }
        </div>
      </Card.Body>

      <p className="text-center text-black50 scale-down5">
        {
          props.params.isAutoRenew ?
          '* 仅限Stripe支付' :
          '* 仅限支付宝或微信支付'
        }
      </p>
    </Card>
  );
}

