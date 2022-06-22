import { PaymentMethod as StripePayMethod } from '@stripe/stripe-js';
import { Edition } from './edition';
import { PriceKind, SubStatus, Tier } from './enum';
import { Membership } from './membership';
import { YearMonthDay, OptionalPeriod } from './period';

export type PubKey = {
  live: boolean;
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

export type StripePrice = {
  id: string;
  active: boolean;
  currency: string;
  isIntroductory: boolean;
  kind: PriceKind;
  liveMode: boolean;
  nickname: string;
  productId: string;
  periodCount: YearMonthDay;
  tier: Tier;
  unitAmount: number;
  created: number;
} & OptionalPeriod;

export type StripeCoupon = {
  id: string;
  amountOff: number,
  currency: string;
  redeemBy: number;
  priceId?: string;
  startUtc?: string;
  endUtc?: string;
};

export type StripePaywallItem = {
  price: StripePrice;
  coupons: StripeCoupon[];
};

export function getCoupon(coupons: StripeCoupon[]): StripeCoupon | undefined {
  switch (coupons.length) {
    case 0:
      return undefined;

    case 1:
      return coupons[0];

    default:
      return coupons.sort((a, b) => b.amountOff - a.amountOff)[0];
  }
}
