import { Edition } from './edition';
import { SubStatus } from './enum';

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
  customerId: string;
  defaultPaymentMethodId?: string;
  ftcUserId?: string;
  latestInvoiceId: string;
  liveMode: boolean;
  paymentIntent: PaymentIntent;
  status: SubStatus;
};

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
  kind: 'card' | 'card_present' | 'eps' | 'fpx';
  card: {
    brand: 'amex' | 'diners' | 'discover' | 'jcb' | 'mastercard' | 'unionpay' | 'unknown' | 'visa';
    country: string;
    expMonth: number;
    expYear: number;
    fingerprint: string;
    last4: string;
  };
};
