import { BankCard } from './BankCard';
import { LeadIconButton } from '../../components/buttons/Buttons';
import { Flex } from '../../components/layout/Flex';
import { CircleLoader } from '../../components/progress/LoadIndicator';
import { StripePayMethod } from '../../data/stripe';
import { PaymentMethodSelector } from '../stripesetup/PaymentMethodSelector';

/**
 * onSetDefault callback is used to set default payment method. * A default payment method could be set
 * either on a customer.invoice_settings.default_payment_method
 * or subscription.default_payment_method.
 * We employ this approach:
 * - If user has an active subscription, set the payment method on subscription, which actually means you are modifying this subscritpion;
 * - If user does not have an active subscription, set it on customer's invoice settings.
 * @see https://stripe.com/docs/api/customers/object
 * @see https://stripe.com/docs/api/subscriptions/object
 */
export function StripeWalletScreen(
  props: {
    paymentMethod?: StripePayMethod;
    isDefault: boolean;
    submitting: boolean;
    onSetDefault: (method: StripePayMethod) => void;
    onAddCard: () => void;
  }
) {

  const card = props.paymentMethod?.card;

  return (
    <>

      <PaymentMethodSelector
        onClick={props.onAddCard}
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

      <SetAsDefault
        submitting={props.submitting}
        isDefault={props.isDefault}
        onClick={() => {
          if (props.paymentMethod) {
            props.onSetDefault(props.paymentMethod);
          }
        }}
      />
    </>
  );
}

function SetAsDefault(
  props: {
    submitting: boolean;
    isDefault: boolean;
    onClick: () => void;
  }
) {
  return (
    <Flex justify="end">
      <LeadIconButton
        text="设为默认"
        icon={<CircleLoader progress={props.submitting} />}
        onClick={props.onClick}
        disabled={props.isDefault || props.submitting}
        variant="link"
      />
    </Flex>
  );
}
