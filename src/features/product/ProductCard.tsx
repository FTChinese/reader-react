import { TextList } from '../../components/list/TextList';
import { isMembershipZero, Membership } from '../../data/membership';
import { PaywallProduct, productDesc } from '../../data/paywall';
import {
  newCartItemFtc,
  collectPaywallPrices,
  collectStripePrices,
  newCarItemStripe,
} from '../../data/shopping-cart';
import { FtcPriceCard, StripePriceCard } from './PriceCard';
import { paywallStripeState } from '../../components/hooks/usePaywall';
import { useRecoilValue } from 'recoil';

export function ProductCard(
  props: {
    product: PaywallProduct;
    member: Membership;
  }
) {

  const stripePriceStore = useRecoilValue(paywallStripeState);

  const { ftcPrices, stripeIds } = collectPaywallPrices(props.product, isMembershipZero(props.member));

  console.log(ftcPrices);

  const stripePrices = collectStripePrices(stripeIds, stripePriceStore);

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
        {props.product.heading}
      </h5>

      <div className={rowClass(ftcPrices.length)}>
        {
          ftcPrices.map((price, i) => (
            <div className="col mb-3" key={i}>
              <FtcPriceCard
                item={newCartItemFtc(price, props.member)}
              />
            </div>
          ))
        }
      </div>

      <div className={rowClass(stripePrices.length)}>
        {
          stripePrices.map((price, i) => (
            <div className="col mb-3" key={i}>
              <StripePriceCard item={newCarItemStripe(price, props.member)} />
            </div>
          ))
        }
      </div>

      <small className="text-muted">
        * 自动续订通过<a href="https://stripe.com/" target="_blank">Stripe</a>支付，以英镑计价，需使用支持国际货币的信用卡
      </small>

      <TextList
        lines={productDesc(props.product)}
        className="mt-3" />

      <small className="text-muted">
        {props.product.smallPrint}
      </small>
    </div>
  );
}


