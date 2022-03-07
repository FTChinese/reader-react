import { atom, useRecoilState } from 'recoil';
import { PaymentMethod } from '../../data/stripe';

/**
 * @description This is the single source of truth
 * for user's selected payment method when using Stripe.
 * It might comes from multiple sources:
 * - Retrieve from customer's default payment method
 * - User selected from a list of available payment methods
 * - A new payment method added via PaymentMethodDialog and populated from StripeSetupCbpage after successful redirection.
 */
type StripePaymentSetting = {
  defaultMethod?: PaymentMethod;
  // The selected payment method might comes from
  // multiple sources:
  // * If user already selected one from list, use it;
  // * otherwise load user's default payment method.
  selectedMethod?: PaymentMethod;
  methodCandidates: PaymentMethod[];
}

const paymentSettingState = atom<StripePaymentSetting>({
  key: 'customerPaymentMethods',
  default: {
    defaultMethod: undefined,
    selectedMethod: undefined,
    methodCandidates: [],
  },
});

export function useStripePaySetting() {
  const [ paymentSetting, setPaymentSetting ] = useRecoilState(paymentSettingState);

  function selectPaymentMethod(pm: PaymentMethod) {
    setPaymentSetting({
      ...paymentSetting,
      selectedMethod: pm,
    });
  }

  function setDefaultPaymentMethod(pm: PaymentMethod) {
    setPaymentSetting({
      ...paymentSetting,
      defaultMethod: pm,
    });
  }

  function clearPaymentSetting() {
    setPaymentSetting({
      selectedMethod: undefined,
      methodCandidates: [],
    });
  }

  return {
    paymentSetting,
    setDefaultPaymentMethod,
    selectPaymentMethod,
    clearPaymentSetting,
  };
}
