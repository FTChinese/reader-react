import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { TextList } from '../../components/list/TextList';
import { Membership } from '../../data/membership';
import { PaywallProduct, productDesc } from '../../data/paywall';
import {
  CartItemStripe,
  buildFtcCartItems,
  buildStripeCartItems,
} from '../../data/shopping-cart';
import { stripePricesState } from '../../components/hooks/recoilState';
import { FtcPriceCard, StripePriceCard } from './PriceCard';

export function ProductCard(
  props: {
    product: PaywallProduct;
    member: Membership;
  }
) {

  const ftcItems = buildFtcCartItems(props.product, props.member);

  const [stripeItems, setStripeItems] = useState<CartItemStripe[]>();

  const stripePrices = useRecoilValue(stripePricesState);

  useEffect(() => {
    if (stripePrices.size === 0) {
      return;
    }

    setStripeItems(buildStripeCartItems({
      product: props.product,
      m: props.member,
      prices: stripePrices,
    }));

  }, [stripePrices.size]);

  return (
    <div className="h-100 p-3">
      <h5 className="text-center mb-3 pb-3 border-bottom">
        {props.product.heading}
      </h5>

      <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 mt-3">
        {ftcItems.map((item, i) => (
          <div className="col mb-3" key={i}>
            <FtcPriceCard item={item} />
          </div>
        ))}
      </div>

      <div className="row row-cols-1 row-cols-lg-2">
        {stripeItems &&
          stripeItems.map((item, i) => (
            <div className="col mb-3" key={i}>
              <StripePriceCard item={item} />
            </div>
          ))}
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


