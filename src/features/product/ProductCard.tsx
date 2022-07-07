import { TextList } from '../../components/list/TextList';
import {
  priceCardParamsOfStripe,
  priceCardParamsOfFtc,
} from '../../data/shopping-cart';
import { PriceCard } from './PriceCard';
import { CartItemFtc, CartItemStripe, ProductItem } from '../../data/paywall-product';
import { StripePayLink } from '../../components/text/Checkout';

export function ProductCard(
  props: {
    item: ProductItem;
    onFtcPay: (item: CartItemFtc) => void;
    onStripePay: (item: CartItemStripe) => void;
  }
) {

  function rowClass(count: number): string {
    let className = 'row row-cols-1';
    switch (count) {
      case 1:
        return className;

      case 2:
        return className += ' row-cols-lg-2';

      default:
        return className += ' row-cols-lg-2 row-cols-xl-3'
    }
  }

  return (
    <div className="h-100 p-3">
      <h5 className="text-center mb-3 pb-3 border-bottom">
        {props.item.content.heading}
      </h5>

      <div className={rowClass(props.item.ftcItems.length)}>
        {
          props.item.ftcItems.map(cartItem => (
            <div
              className="col mb-3"
              key={cartItem.price.id}
            >
              <PriceCard
                params={ priceCardParamsOfFtc(cartItem) }
                onClick={ () => props.onFtcPay(cartItem) }
              />
            </div>
          ))
        }
      </div>

      <div className={rowClass(props.item.stripeItems.length)}>
        {
          props.item.stripeItems.map(cartItem => (
            <div
              className="col mb-3"
              key={cartItem.recurring.id}
            >
              <PriceCard
                params={priceCardParamsOfStripe(cartItem)}
                onClick={ () => props.onStripePay(cartItem) }
              />
            </div>
          ))
        }
      </div>

      <StripePayLink />

      <TextList
        lines={props.item.content.description}
        className="mt-3" />

      <small className="text-muted">
        {props.item.content.smallPrint}
      </small>
    </div>
  );
}

