import { useEffect } from 'react';
import { PaySuccessLink } from '../../components/text/Checkout';
import { useShoppingCart } from '../../components/hooks/useShoppingCart';
import { HeadTailTable } from '../../components/list/HeadTailTable';
import { localizeSubsStatus, localizeTier } from '../../data/localization';
import { StringPair, stripeSubsDetails } from '../../data/pair';
import { Subs } from '../../data/stripe';
import { TextScaled } from '../../components/text/BodyText';

/**
 * @description Show details of subscription after success.
 */
export function StripeSubsDetails(
  props: {
    isApplyCoupon: boolean;
    subs: Subs;
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
        (props.isApplyCoupon && props.subs.discount.id) &&
        <p>优惠价格将在下次发票中扣除</p>
      }
      <HeadTailTable
        caption={localizeTier(props.subs.tier)}
        rows={stripeSubsDetails(props.subs)}
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
