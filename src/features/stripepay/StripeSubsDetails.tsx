import { useEffect } from 'react';
import { PaySuccessLink } from '../../components/text/Checkout';
import { useShoppingCart } from '../../components/hooks/useShoppingCart';
import { HeadTailTable } from '../../components/list/HeadTailTable';
import { localizeTier } from '../../data/localization';
import { StringPair } from '../../data/pair';
import { formatCouponAmount, StripeCoupon } from '../../data/stripe';
import { TextScaled } from '../../components/text/BodyText';
import { Tier } from '../../data/enum';

/**
 * @description Show details of subscription after success.
 */
export function StripeSubsDetails(
  props: {
    tier: Tier;
    subsRows: StringPair[];
    coupon?: StripeCoupon;
  }
) {

  const { clearCart } = useShoppingCart();

  // If we showed user this components, we are
  // safe to cleanup shopping cart.
  // This is only palce to safely cleanup
  // shopping cart for Stripe pay since we are displaying
  // this component under StripePay, which
  // is using the shopping cart when this component
  // is mounted.
  useEffect(() => {
    return function cleanup() {
      clearCart();
    };
  }, []);

  return (
    <div className="mt-3">
      <h5 className="text-center">订阅成功</h5>
      {
        props.coupon &&
        <p className="text-center">优惠{formatCouponAmount(props.coupon)}将在下次发票中扣除</p>
      }
      <HeadTailTable
        caption={localizeTier(props.tier)}
        rows={props.subsRows}
      />
      <div>
        <TextScaled
          size={0.8}
          text="* 周期结束时将自动续订"
          className="text-muted"
        />
      </div>
      <PaySuccessLink />
    </div>
  );
}
