import { useState } from 'react';
import { toast } from 'react-toastify';
import { ReaderPassport } from '../../data/account';
import { CartItemStripe } from '../../data/shopping-cart';
import { Subs, SubsResult } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { createSubs, loadCusDefaultPayMethod, updateSubs } from '../../repository/stripe';
import { useAuth } from '../../components/hooks/useAuth';
import { IntentKind } from '../../data/chekout-intent';
import { usePaymentSetting } from '../../components/hooks/usePaymentSetting';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { StripeDefaultPaymentMethod } from './StripDefaultPaymentMethod';
import { ProgressButton } from '../../components/buttons/ProgressButton';

/**
 * @description Handles Stripe pay actions.
 * Embedded in the PayentDialog.
 * @see https://stripe.com/docs/billing/subscriptions/build-subscription
 * https://stripe.com/docs/stripe-js/react
 */
export function StripePay(
  props: {
    item: CartItemStripe;
    onSuccess: (subs: Subs) => void;
  }
) {

  const { passport } = useAuth();
  if (!passport) {
    return null;
  }

  const msg = (
    <p className="scale-down8 text-center">{props.item.intent.message}</p>
  );

  let isNewSubs = true;

  switch (props.item.intent.kind) {
    case IntentKind.Create:
    case IntentKind.OneTimeToAutoRenew:
      isNewSubs = true;
      break;

    case IntentKind.Upgrade:
    case IntentKind.SwitchInterval:
      isNewSubs = false;
      break;


    // Does not exist for stripe.
    case IntentKind.Forbidden:
    case IntentKind.Renew:
    case IntentKind.Downgrade:
    case IntentKind.AddOn:
      return msg;
  }

  return (
    <>
      { msg }
      <CustomerPaymentMethod
        passport={passport}
      />

      <SubscribeButton
        passport={passport}
        item={props.item}
        isNew={isNewSubs}
        onSuccess={props.onSuccess}
      />
    </>
  );
}

/**
 * @description Load and show a customer's default payment
 * method, used for new subscription.
 */
function CustomerPaymentMethod(
  props: {
    passport: ReaderPassport,
  }
) {

  const cusId = props.passport.stripeId;
  if (!cusId) {
    return null;
  }

  const load = () => loadCusDefaultPayMethod(props.passport.token, cusId);

  return (
    <div className="mt-3 mb-3">
      <PaymentMethodSelector/>
      <StripeDefaultPaymentMethod
        passport={props.passport}
        load={load}
      />
    </div>
  );
}

/**
 * @description Submit required data to create a new subscription.
 */
function SubscribeButton(
  props: {
    passport: ReaderPassport;
    item: CartItemStripe;
    isNew: boolean; // Whether it is a new subscription, or updating to other price.
    onSuccess: (subs: Subs) => void;
  }
) {

  const { setMembership } = useAuth();
  const { paymentSetting } = usePaymentSetting();
  const [ progress, setProgress ] = useState(false);

  const handleClick = () => {
    if (!paymentSetting.selectedMethod) {
      console.error('No payment method selected');
      return;
    }

    let startPromise: Promise<SubsResult>;

    if (props.isNew) {
      startPromise = createSubs(
        props.passport.token,
        {
          priceId: props.item.recurring.id,
          defaultPaymentMethod: paymentSetting.selectedMethod.id,
          introductoryPriceId: props.item.trial?.id
        }
      );
    } else {
      if (!props.passport.membership.stripeSubsId) {
        return;
      }

      startPromise = updateSubs(
        props.passport.token,
        {
          priceId: props.item.recurring.id,
          defaultPaymentMethod: paymentSetting.selectedMethod.id,
          id: props.passport.membership.stripeSubsId,
        }
      );
    }

    setProgress(true);

    startPromise
      .then(result => {
        // TODO: save membership.
        console.log(result);
        setMembership(result.membership);
        setProgress(false);
        props.onSuccess(result.subs);
      })
      .catch((err: ResponseError) => {
        console.log(err);
        setProgress(false);
        toast.error(err.toString());
      });
  };

  return (
    <ProgressButton
      disabled={!paymentSetting.selectedMethod || progress}
      text={props.isNew ? '订阅' : '升级'}
      progress={progress}
      block={true}
      onClick={handleClick}
    />
  );
}
