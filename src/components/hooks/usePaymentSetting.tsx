import { atom, useRecoilState } from 'recoil';
import { Customer, PaymentMethod, SetupIntent } from '../../data/stripe';

/**
 * @description This is the single source of truth
 * for user's selected payment method when using Stripe.
 * It might comes from multiple sources:
 * - Retrieve from customer's default payment method
 * - User selected from a list of available payment methods
 * - A new payment method added via PaymentMethodDialog and populated from StripeSetupCbpage after successful redirection.
 */
type StripePaymentSetting = {
  customer?: Customer;
  selectedMethod?: PaymentMethod;
  methodCandidates: PaymentMethod[];
  setup?: SetupIntent;
}

const paymentSettingState = atom<StripePaymentSetting>({
  key: 'customerPaymentMethods',
  default: {
    customer: undefined,
    selectedMethod: undefined,
    methodCandidates: [],
    setup: undefined,
  },
});

export function usePaymentSetting() {
  const [ paymentSetting, setPaymentSetting ] = useRecoilState(paymentSettingState);

  function setCustomer(c: Customer) {
    setPaymentSetting({
      ...paymentSetting,
      customer: c,
    });
  }

  function setCustomerDefaultPayment(id: string) {
    const cus: Customer | undefined = paymentSetting.customer
      ? {
        ...paymentSetting.customer,
        defaultPaymentMethod: id,
      }
      : undefined;

    setPaymentSetting({
      ...paymentSetting,
      customer: cus,
    })
  }

  function selectPaymentMethod(pm: PaymentMethod) {
    setPaymentSetting({
      ...paymentSetting,
      selectedMethod: pm,
    });
  }

  function addPaymentMethods(list: PaymentMethod[]) {
    if (!paymentSetting.selectedMethod) {
      setPaymentSetting({
        ...paymentSetting,
        methodCandidates: list,
      });
      return;
    }

    const foundIndex = list.findIndex(elem => {
      return elem.id === paymentSetting.selectedMethod?.id;
    });

    if (foundIndex > - 1) {
      setPaymentSetting({
        ...paymentSetting,
        methodCandidates: list,
      });
      return;
    }

    setPaymentSetting({
      ...paymentSetting,
      methodCandidates: [paymentSetting.selectedMethod, ...list]
    });
  }

  // Keep a setup intent persistent during current session
  // so that we won't create too much unused setup intent.
  // Once used, removed it from memory.
  function setSetupIntent(si: SetupIntent) {
    setPaymentSetting({
      ...paymentSetting,
      setup: si,
    });
  }

  function removeSetupIntent() {
    setPaymentSetting({
      ...paymentSetting,
      setup: undefined,
    })
  }

  function clearPaymentSetting() {
    setPaymentSetting({
      customer: undefined,
      selectedMethod: undefined,
      methodCandidates: [],
      setup: undefined,
    });
  }

  return {
    paymentSetting,
    setCustomer,
    setCustomerDefaultPayment,
    selectPaymentMethod,
    addPaymentMethods,
    setSetupIntent,
    removeSetupIntent,
    clearPaymentSetting,
  };
}
