import { CheckoutHeader, CheckoutMessage, PaymentMethodSelector, StripePayLink } from '../../components/text/Checkout'
import { CenterColumn } from '../../components/layout/Column';
import { priceCardParamsOfStripe, CartItemStripe } from '../../data/shopping-cart';
import { StripePayMethod, Subs } from '../../data/stripe';
import { PriceCard } from '../product/PriceCard';
import { StripeSubsDetails } from './StripeSubsDetails';
import { BlockLoadButton, DisplayGrid, OButton, SpinnerOrText } from '../../components/buttons/Buttons';
import { IntentKind, stripeBtnText } from '../../data/chekout-intent';
import { BankCard } from '../../components/BankCard';

/**
 * @description Handles Stripe pay actions.
 * @see https://stripe.com/docs/billing/subscriptions/build-subscription
 * https://stripe.com/docs/stripe-js/react
 */
export function StripePayScreen(
  props: {
    cartItem: CartItemStripe;
    submitting: boolean;
    paymentMethod?: StripePayMethod;
    subs?: Subs;
    onPaymentMethod: () => void;
    onSubscribe: () => void;
  }
) {

  const forbidden = props.cartItem.intent.kind === IntentKind.Forbidden;
  const card = props.paymentMethod?.card;

  return (
    <CenterColumn>
      <>
        <CheckoutHeader
          tier={props.cartItem.recurring.tier}
        />

        <PriceCard
          params={priceCardParamsOfStripe(props.cartItem)}
        />

        <CheckoutMessage
          text={props.cartItem.intent.message}
        />

        <PaymentMethodSelector
          onClick={props.onPaymentMethod}
        />

        {
          card &&
          <BankCard
            brand={card.brand}
            last4={card.last4}
            expYear={card.expYear}
            expMonth={card.expMonth}
          />
        }

        {
          props.subs ?
          <StripeSubsDetails
            subs={props.subs}
          /> :
          <SubscribeButton
            onClick={props.onSubscribe}
            disabled={props.submitting || !props.paymentMethod || forbidden}
            text={stripeBtnText(props.cartItem.intent.kind)}
            progress={props.submitting}
          />
        }
      </>
    </CenterColumn>
  );
}


function SubscribeButton(
  props: {
    onClick: () => void;
    disabled: boolean;
    text: string;
    progress: boolean;
  }
) {
  return (
    <>
      <BlockLoadButton
        text={props.text}
        progress={props.progress}
        onClick={props.onClick}
        disabled={props.disabled}
        className="mt-3"
      />

      <StripePayLink/>
    </>
  );
}
