import { useState, useEffect } from 'react';
import { useStripePaySetting } from '../../components/hooks/useStripePaySetting';
import { ErrorBoudary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { ReaderPassport } from '../../data/account';
import { PaymentMethod } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { BankCard } from './BankCard';

/**
 * @description Loads and display Stripe's default payment method.
 * They default payment method might comes from customer.invoice_settings
 * if user is not subscribed yet, or from subscription.default_payment_method
 * if user is alreayd subscribed.
 */
export function StripeDefaultPaymentMethod(
  props: {
    passport: ReaderPassport;
    load: () => Promise<PaymentMethod>;
  }
) {
  const [ err, setErr ] = useState('');
  const [ progress, setProgress ] = useState(false);

  const { paymentSetting, selectPaymentMethod } = useStripePaySetting();

  // If there's already a default payment method, stop;
  // otherwise load either customer's invoice default payment method,
  // or current subscription's default payment method.
  useEffect(() => {
    if (paymentSetting.selectedMethod) {
      return;
    }

    setErr('');
    setProgress(true);

    props.load()
      .then(pm => {
        console.log('Stripe payment method loaded');
        setProgress(false);
        // Only set payment method if no one exists.
        // It might happen when network is very slow, the data is loaded
        // after user added a new card.
        if (paymentSetting.selectedMethod) {
          return;
        }

        selectPaymentMethod(pm);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        if (err.notFound) {
          return;
        }
        setErr(err.toString());
      });
  }, []);

  return (
    <ErrorBoudary errMsg={err}>
      <Loading loading={progress}>
        <DisplayPaymentMethod
          paymentMethod={paymentSetting.selectedMethod}
        />
      </Loading>
    </ErrorBoudary>
  );
}

/**
 * @description Display a card under payment method.
 * A payment method might comes from multiple sources:
 * - User added using the NewCardForm
 * - Automatically loaded from a customer's default payment method.
 * If customer's default payment method exists, and a new card is added,
 * always use the new one.
 * As long as a payment method exits, it will be displayed.
 * @todo In the future we should list all payment methods.
 */
function DisplayPaymentMethod(
  props: {
    paymentMethod?: PaymentMethod;
  }
) {

  if (!props.paymentMethod) {
    return <div className="text-black60 scale-down8">未设置</div>;
  }

  return <BankCard
    paymentMethod={props.paymentMethod}
  />;
}
