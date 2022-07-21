import { CheckoutHeader, CheckoutMessage, StripePayLink } from '../../components/text/Checkout'
import { CenterColumn } from '../../components/layout/Column';
import { priceCardParamsOfStripe } from '../../data/shopping-cart';
import { StripeCoupon, StripePayMethod, StripeSubs, StripeCouponApplied, formatCouponAmount } from '../../data/stripe';
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
import { TextScaled } from '../../components/text/BodyText';
import { stripeSubsDetails } from '../../data/pair';
import { useMemo } from 'react';

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
    subs?: StripeSubs; // After subscribed.
    onPaymentMethod: () => void;
    onSubscribe: () => void;
  }
) {

  const forbidden = props.cartItem.intent.kind === IntentKind.Forbidden;
  const isApplyCoupon = props.cartItem.intent.kind === IntentKind.ApplyCoupon;

  const card = props.paymentMethod?.card;

  const alreadyEnjoyed = isApplyCoupon && !!props.couponApplied;

  const disabled = useMemo(() => {
    return props.submitting || !props.paymentMethod || forbidden || props.checkingCoupon || alreadyEnjoyed
  }, [
    props.submitting,
    props.paymentMethod,
    forbidden,
    props.checkingCoupon,
    alreadyEnjoyed
  ]);

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
          props.cartItem.coupon &&
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
              tier={props.subs.tier}
              subsRows={stripeSubsDetails(props.subs)}
              coupon={
                (isApplyCoupon && props.subs.discount)
                  ? props.subs.discount.coupon
                  : undefined
              }
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
          <div>
            <TextScaled
              size={0.8}
              className="text-black60"
              text={`领取期限 ${localizeDate(parseISO(props.coupon.startUtc))} ~ ${localizeDate(parseISO(props.coupon.endUtc))}`}
            />
          </div>
        }

        {
          (!props.checking && props.applied) &&
          <div
            className="mt-3 text-danger"
          >
            <TextScaled
              size={0.8}
              text={couponAlreadyUsed(props.applied.createdUtc)}
            />
          </div>
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
