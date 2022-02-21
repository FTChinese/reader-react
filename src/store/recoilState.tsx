import { atom } from 'recoil';
import { StripePrice } from '../data/price';
import { PaymentMethod } from '../data/stripe';

export const stripePricesState = atom<Map<string, StripePrice>>({
  key: 'stripePricesState',
  default: new Map(),
});

/**
 * @description This is the single source of truth
 * for user's selected payment method when using Stripe.
 * It might comes from multiple sources:
 * - Retrieve from customer's default payment method
 * - User selected from a list of available payment methods
 * - A new payment method added via PaymentMethodDialog and populated from StripeSetupCbpage after successful redirection.
 */
export const paymentMethodState = atom<PaymentMethod>({
  key: 'paymentMethodState',
  default: {
    id: '',
    customerId: '',
    card: {
      brand: '',
      country: '',
      expMonth: 0,
      expYear: 0,
      last4: ''
    }
  }
});
