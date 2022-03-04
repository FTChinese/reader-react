import { PaymentMethod as StripePayMethod } from '@stripe/stripe-js';
import { Edition } from './edition';
import { SubStatus } from './enum';
import { Membership } from './membership';

export type PubKey = {
  key: string;
};

export type Customer = {
  id: string;
  ftcId: string;
  currency?: string;
  created: number;
  defaultPaymentMethod?: string; // Deprecated. Use defaultPaymentMethodId if available.
  defaultPaymentMethodId?: string;
  email: string;
  liveMode: boolean;
};

export type SubsParams = {
  priceId: string;
  introductoryPriceId?: string;
  defaultPaymentMethod?: string;
};

export type Subs = Edition & {
  id: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  customerId: string;
  defaultPaymentMethodId?: string;
  ftcUserId?: string;
  latestInvoiceId: string;
  liveMode: boolean;
  paymentIntent: PaymentIntent;
  status: SubStatus;
};

export type SubsResult = {
  membership: Membership;
  subs: Subs;
};

export type SetupIntentParams = {
  customer: string;
};

export type SetupIntent = {
  id: string;
  clientSecret: string;
  customerId: string;
  liveMode: boolean;
  paymentMethodId?: string;
};

export function emptySetupIntent(): SetupIntent {
  return {
    id: '',
    clientSecret: '',
    customerId: '',
    liveMode: false,
  }
}

export type PaymentIntent = {
  id: string;
  clientSecret?: string;
  customerId: string;
  invoiceId: string;
  liveMode: boolean;
  paymentMethodId: string;
};

export type PaymentMethod = {
  id: string;
  customerId: string;
  card: PaymentCard;
};

export type PaymentCard = {
  brand: string;
  country: string;
  expMonth: number;
  expYear: number;
  last4: string;
};

export function convertPaymentMthod(pm: StripePayMethod): PaymentMethod {
  return {
    id: pm.id,
    customerId: pm.customer || '',
    card: {
      brand: pm.card?.brand || 'unknown',
      country: pm.card?.country || '',
      expMonth: pm.card?.exp_month || 0,
      expYear: pm.card?.exp_year || 0,
      last4: pm.card?.last4 || ''
    }
  }
}
