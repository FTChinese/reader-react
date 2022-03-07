import { useAuth } from '../components/hooks/useAuth';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { Unauthorized } from '../components/routes/Unauthorized';
import { CustomerPaymentMethods } from '../features/checkout/CustomerPaymentMethods';
import { SetupPaymentMethod } from '../features/checkout/SetupPaymentMethod';
import { SetupUsage } from '../store/stripeSetupSession';

/**
 * @description Payment method managment.
 * @todo Enable deleting payment method, change
 * current subscription's default payment method.
 * If subscription does not exist, set default
 * payment method on customer.
 */
export function StripeSettingPage() {
  const { passport } = useAuth();
  if (!passport) {
    return <Unauthorized/>;
  }

  return (
    <SingleCenterCol>
      <>
        <h2>Stripe支付管理</h2>
        <CustomerPaymentMethods
          passport={passport}
          selectable={false}
        />
        <SetupPaymentMethod
          passport={passport}
          usage={SetupUsage.Future}
        />
      </>
    </SingleCenterCol>
  );
}
