import { useEffect } from 'react';
import { useShoppingCart } from '../../components/hooks/useShoppingCart';
import { HeadTailTable } from '../../components/list/HeadTailTable';
import { localizeSubsStatus, localizeTier } from '../../data/localization';
import { StringPair } from '../../data/pair';
import { Subs } from '../../data/stripe';
import { PaySuccessLink } from './PaySuccessLink';

/**
 * @description Show details of subscription after success.
 */
export function StripeSubsDetails(
  props: {
    subs: Subs,
  }
) {

  const { clearCart } = useShoppingCart();

  const rows: StringPair[] = [
    ['本周期开始时间', `${props.subs.currentPeriodStart}`],
    ['本周期结束时间', props.subs.currentPeriodEnd],
    ['订阅状态', localizeSubsStatus(props.subs.status)]
  ];

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
    <>
      <HeadTailTable
        caption={localizeTier(props.subs.tier)}
        rows={rows}
      />
      <p className="scale-down8 text-muted">*周期结束时将自动续订</p>
      <PaySuccessLink />
    </>
  );
}
