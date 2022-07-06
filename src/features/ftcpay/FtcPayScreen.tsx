import { useState } from 'react';
import { BlockLoadButton } from '../../components/buttons/Buttons';
import { CenterColumn } from '../../components/layout/Column';
import { CheckoutHeader, CheckoutMessage } from '../../components/text/Checkout';
import { IntentKind } from '../../data/chekout-intent';
import { PaymentKind } from '../../data/enum';
import { ConfirmationResult } from '../../data/order';
import { CartItemFtc, priceCardParamsOfFtc } from '../../data/shopping-cart';
import { PriceCard } from '../product/PriceCard';
import { FtcPaymentMethods } from './FtcPaymentMethods';
import { FtcPayDetails } from './FtcPayResult';

export function FtcPayScreen(
  props: {
    cartItem: CartItemFtc;
    submitting: boolean;
    onClickPay: (payMethod: PaymentKind) => void;
    confirmed?: ConfirmationResult;
  }
) {

  // One-off purchase has the following intent kinds only:
  // - Create
  // - Renew
  // - Upgrade
  // - AddOn
  // All others options belong to forbidden.
  const forbidden = props.cartItem.intent.kind === IntentKind.Forbidden;

  return (
    <CenterColumn>
      <>
        <CheckoutHeader
          tier={props.cartItem.price.tier}
        />

        <PriceCard
          params={priceCardParamsOfFtc(props.cartItem)}
        />

        <CheckoutMessage
          text={props.cartItem.intent.message}
        />

        {
          (!forbidden && !props.confirmed) &&
          <PayButton
            submitting={props.submitting}
            onClick={props.onClickPay}
          />
        }

        {
          props.confirmed &&
          <FtcPayDetails
            method={props.confirmed.order.payMethod}
            result={props.confirmed.payment}
          />
        }
      </>
    </CenterColumn>
  );
}

/**
 * @description Show a list of payment method and a submit button.
 * Visible only when the payment intent is not forbidden
 * and no confirmation result is returned yet.
 */
function PayButton(
  props: {
    submitting: boolean;
    onClick: (method: PaymentKind) => void;
  }
) {
  const [ payMethod, setPayMethod ] = useState<PaymentKind | undefined>();

  return (
    <>
      <FtcPaymentMethods
        selected={payMethod}
        onSelect={setPayMethod}
      />

      <BlockLoadButton
        disabled={!payMethod || props.submitting}
        text="支付"
        progress={props.submitting}
        onClick={() => {
          if (payMethod) {
            props.onClick(payMethod);
          }
        }}
      />
    </>
  );
}


