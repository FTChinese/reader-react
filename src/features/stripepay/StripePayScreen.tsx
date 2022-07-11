import { CheckoutHeader, CheckoutMessage, StripePayLink } from '../../components/text/Checkout'
import { CenterColumn } from '../../components/layout/Column';
import { priceCardParamsOfStripe } from '../../data/shopping-cart';
import { StripeCoupon, StripePayMethod, Subs, StripeCouponApplied, formatCouponAmount } from '../../data/stripe';
import { PriceCard } from '../product/PriceCard';
import { StripeSubsDetails } from './StripeSubsDetails';
import { BlockLoadButton } from '../../components/buttons/Buttons';
import { IntentKind, stripeBtnText } from '../../data/chekout-intent';
import { BankCard } from '../stripewallet/BankCard';
import { PaymentMethodSelector } from '../stripesetup/PaymentMethodSelector';
import { CartItemStripe } from '../../data/paywall-product';
import { CircleLoader } from '../../components/progress/LoadIndicator';
import { localizeDate } from '../../utils/format-time';
import { parseISO } from 'date-fns';
import { Card } from 'react-bootstrap';
import { BlockTextScaled } from '../../components/text/BodyText';

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
    checkingCoupon: boolean;
    couponApplied?: StripeCouponApplied;
    subs?: Subs; // After subscribed.
    onPaymentMethod: () => void;
    onSubscribe: () => void;
  }
) {

  const forbidden = props.cartItem.intent.kind === IntentKind.Forbidden;
  const card = props.paymentMethod?.card;

  const isApplyCoupon =  props.cartItem.intent.kind === IntentKind.ApplyCoupon;
  const alreadyEnjoyed = isApplyCoupon && !!props.couponApplied;

  const disabled = props.submitting || !props.paymentMethod || forbidden || props.checkingCoupon || alreadyEnjoyed;


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

        {
          (props.cartItem.coupon && isApplyCoupon) &&
          <CouponApplicable
            coupon={props.cartItem.coupon}
            checking={props.checkingCoupon}
            applied={props.couponApplied}
          />
        }

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
            disabled={disabled}
            text={stripeBtnText(props.cartItem.intent.kind)}
            progress={props.submitting}
          />
        }
      </>
    </CenterColumn>
  );
}

function CouponApplicable(
  props: {
    coupon: StripeCoupon;
    checking: boolean;
    applied?: StripeCouponApplied;
  }
) {
  return (
    <Card className="mb-3">
      <Card.Body className="text-center">
        <Card.Title>优惠券</Card.Title>

        <div>-{formatCouponAmount(props.coupon)}</div>
        <CircleLoader progress={props.checking} />

        {
          (props.coupon.startUtc && props.coupon.endUtc) &&
          <BlockTextScaled
            size={0.8}
            className="ttext-black60"
          >
            <span>
            领取期限 {localizeDate(parseISO(props.coupon.startUtc))} ~ {localizeDate(parseISO(props.coupon.endUtc))}
            </span>
          </BlockTextScaled>
        }

        {
          (!props.checking && props.applied) &&
          <div>{couponAlreadyUsed}</div>
        }
      </Card.Body>
    </Card>
  );
}

function couponAlreadyUsed(time?: string): string {
  const date = time
    ? localizeDate(parseISO(time))
    : '';

  return `您已经${date ? '在' + date : ''}使用过一次优惠券，一个付款周期内只能使用一次优惠券。`;
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
