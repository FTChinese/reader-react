import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PassportProp } from '../../data/account';
import { CartItemStripe } from '../../data/shopping-cart';
import { Subs, SubsResult } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { createStripeSubs, updateStripeSubs } from '../../repository/stripe';
import { useAuth } from '../../components/hooks/useAuth';
import { IntentKind, stripeBtnText } from '../../data/chekout-intent';
import { useStripePaySetting } from '../../components/hooks/useStripePaySetting';
import { DisplayPaymentMethod, StripeDefaultPaymentMethod } from './StripDefaultPaymentMethod';
import { BlockLoadButton } from '../../components/buttons/BlockLoadButton';
import { StripeSubsDetails } from './StripeSubsDetails';
import { localizeTier } from '../../data/localization';
import { StripePayLink } from '../product/StripePayLink';
import { IconButton } from '../../components/buttons/IconButton';
import { ChevronRight } from '../../components/graphics/icons';
import { PaymentMethodDialog } from './PaymentMethodDialog';
import { Flex } from '../../components/layout/Flex';

/**
 * @description Handles Stripe pay actions.
 * Embedded in the PayentDialog.
 * @see https://stripe.com/docs/billing/subscriptions/build-subscription
 * https://stripe.com/docs/stripe-js/react
 */
export function StripePay(
  props: {
    item: CartItemStripe;
  }
) {

  const { passport } = useAuth();
  if (!passport) {
    return null;
  }

  const { paymentSetting } = useStripePaySetting();
  const [ subs, setSubs ] = useState<Subs>();

  const msg = (
    <p className="scale-down8 text-center">{props.item.intent.message}</p>
  );

  if (subs) {
    return (
      <>
        {msg}
        <div className="mt-3">
          <h5 className="text-center">{localizeTier(subs.tier)}订阅成功</h5>
          <StripeSubsDetails subs={subs}/>
        </div>
      </>
    );
  }

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

      <div className="mt-3 mb-3">
        <PaymentMethodHeader />
        {
          // If a payment method is seletecd,
          // display it; otherwise loads default payment method.
          paymentSetting.selectedMethod ?
          <DisplayPaymentMethod
            paymentMethod={paymentSetting.selectedMethod}
          /> :
          <StripeDefaultPaymentMethod
            passport={passport}
          />
        }
      </div>

      <SubscribeButton
        passport={passport}
        item={props.item}
        isNew={isNewSubs}
        onSuccess={setSubs}
      />
    </>
  );
}

function PaymentMethodHeader() {
  const [ show, setShow ] = useState(false);

  const { paymentSetting } = useStripePaySetting();

  // Automatically close the dialog after user selected a new payment method.
  useEffect(() => {
    // If nothing selected, do nothing.
    if (!paymentSetting.selectedMethod) {
      return;
    }
    setShow(false);
  }, [paymentSetting.selectedMethod?.id]);

  return (
    <>
      <Flex border={true}>
        <>
          <h6>支付方式</h6>
          <IconButton
            text="添加"
            end={<ChevronRight />}
            onClick={() => setShow(true)}
          />
        </>
      </Flex>

      <PaymentMethodDialog
        title="选择或添加支付方式"
        show={show}
        onHide={() => setShow(false)}
      />
    </>
  );
}

/**
 * @description Submit required data to create a new subscription.
 */
function SubscribeButton(
  props: PassportProp & {
    item: CartItemStripe;
    isNew: boolean; // Whether it is a new subscription, or updating to other price.
    onSuccess: (subs: Subs) => void;
  }
) {

  const { setMembership } = useAuth();
  const { paymentSetting } = useStripePaySetting();
  const [ progress, setProgress ] = useState(false);

  const handleClick = () => {
    if (!paymentSetting.selectedMethod) {
      console.error('No payment method selected');
      return;
    }

    let startPromise: Promise<SubsResult>;

    if (props.isNew) {
      startPromise = createStripeSubs(
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

      startPromise = updateStripeSubs(
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
    <>
      <BlockLoadButton
        disabled={!paymentSetting.selectedMethod || progress}
        text={stripeBtnText(props.item.intent.kind)}
        progress={progress}
        onClick={handleClick}
      />
      <StripePayLink />
    </>

  );
}
