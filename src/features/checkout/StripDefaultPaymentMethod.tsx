import { useState, useEffect } from 'react';
import { useStripePaySetting } from '../../components/hooks/useStripePaySetting';
import { ErrorBoundary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { PassportProp } from '../../data/account';
import { PaymentMethod } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { loadStripeDefaultPayment } from '../../repository/stripe';
import { BankCardRow } from './BankCard';

/**
 * @description Loads and display Stripe's default payment method.
 * They default payment method might comes from customer.invoice_settings
 * if user is not subscribed yet, or from subscription.default_payment_method
 * if user is alreayd subscribed.
 */
export function StripeDefaultPaymentMethod(
  props: PassportProp & {
    // If children is not defined, use a component
    // to show default payment method.
    // This way you can only show the default payment method
    // in MembershipPage while being able to
    // show a different selected one
    // in CheckoutPage.
    children?: JSX.Element;
  },
) {
  const [ err, setErr ] = useState('');
  const [ progress, setProgress ] = useState(false);

  const { paymentSetting, setDefaultPaymentMethod, selectPaymentMethod } = useStripePaySetting();

  // If there's already a default payment method, stop;
  // otherwise load either customer's invoice default payment method,
  // or current subscription's default payment method.
  useEffect(() => {
    if (paymentSetting.defaultMethod) {
      return;
    }

    setErr('');
    setProgress(true);

    // If membership.stripeSubsId exists, use
    // subscription's default payment method;
    // otherwise, if ReaderAccount.stripeId exists,
    // user customer's default payment method.
    loadStripeDefaultPayment(props.passport)
      .then(pm => {
        console.log('Stripe payment method loaded');
        // Only set payment method if no one exists.
        // It might happen when network is very slow, the data is loaded
        // after user added a new card.
        setDefaultPaymentMethod(pm);
        // If we found out user has not seleteced
        // any payment method, use the default one.
        if (!paymentSetting.selectedMethod) {
          selectPaymentMethod(pm);
        }

        setProgress(false);
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
    <ErrorBoundary errMsg={err}>
      <Loading loading={progress}>
        {
          props.children ?
          props.children :
          <DisplayPaymentMethod
            paymentMethod={paymentSetting.defaultMethod}
          />
        }
      </Loading>
    </ErrorBoundary>
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
 */
export function DisplayPaymentMethod(
  props: {
    paymentMethod?: PaymentMethod;
  }
) {

  if (!props.paymentMethod) {
    return <div className="text-black60 scale-down8">未设置</div>;
  }

  return <BankCardRow
    paymentMethod={props.paymentMethod}
    selectable={false}
  />;
}
