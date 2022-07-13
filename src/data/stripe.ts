import { PaymentMethod } from '@stripe/stripe-js';
import { Edition } from './edition';
import { PriceKind, SubStatus, Tier } from './enum';
import { formatMoney, newMoneyParts, PriceParts } from './localization';
import { Membership } from './membership';
import { YearMonthDay, OptionalPeriod, isValidPeriod, formatPeriods } from './period';

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

export type StripeDiscount = {
  id: string;
  coupon: StripeCoupon;
  customerId: string;
  end?: number;
  invoiceId?: string;
  invoiceItemId?: string;
  promotionCodeId?: string;
  start: number;
  subsId?: string;
};

export type Subs = Edition & {
  id: string;
  currentPeriodEnd: string;
  currentPeriodStart: string;
  customerId: string;
  defaultPaymentMethodId?: string;
  discount: StripeDiscount;
  ftcUserId?: string;
  latestInvoiceId: string;
  liveMode: boolean;
  paymentIntent: PaymentIntent;
  status: SubStatus;
};

export type StripeInvoice = {
  id: string;
  autoAdvance: boolean;
  chargeId: string;
  currency: string;
  customerId: string;
  hostedInvoiceUrl: string;
  invoicePdf: string;
  liveMode: boolean;
  number: number;
  paid: boolean;
  periodEndUtc?: string;
  periodStartUtc?: string;
  receiptNumber: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  subscriptionId: string;
  total: number;
  created: number;
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

/**
 * A reduced version of stripe.js PaymentMethod
 */
export type StripePayMethod = {
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

export function convertPaymentMthod(pm: PaymentMethod): StripePayMethod {
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

/**
 * @description Stripe price represents the item user could
 * subscribe to.
 * A stripe price might have multiple coupons attached.
 */
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

export function newStripePriceParts(
  sp: StripePrice,
  recurring: boolean,
  coupon?: StripeCoupon
): PriceParts {
  const amount = coupon
    ? (sp.unitAmount - coupon.amountOff)
    : sp.unitAmount;

  return {
    ...newMoneyParts(
      sp.currency,
      amount / 100,
    ),
    cycle: '/' + formatPeriods(sp.periodCount, recurring),
  };
}

/**
 * @description After you’ve created a coupon, create a discount by applying the coupon to a subscription. You can do this when creating the subscription or by updating a customer’s existing subscription
 * @see https://stripe.com/docs/billing/subscriptions/coupons
 * @see https://stripe.com/docs/api/subscriptions/object discount
 * @see https://stripe.com/docs/api/coupons
 * @see https://stripe.com/docs/api/discounts
 *
 */
export type StripeCoupon = {
  id: string;
  amountOff: number,
  currency: string;
  redeemBy: number;
  priceId?: string;
} & OptionalPeriod;

export function formatCouponAmount(c: StripeCoupon): string {
  return formatMoney(c.currency, c.amountOff / 100);
}

function filterCoupons(coupons: StripeCoupon[]): StripeCoupon[] {
  return coupons
    .filter(isValidPeriod)
    .sort((a, b) => b.amountOff - a.amountOff);
}

/**
 * @description findStripeConpon finds the most appropriate
 * coupon that could be applied to a price.
 * In case of multiple coupons applicable, the one with
 * largest amount off is used.
 * The returned coupon might not be used since its valid period
 * is not checked.
 */
 export function applicableCoupon(coupons: StripeCoupon[]): StripeCoupon | undefined {

  if (coupons.length === 0) {
    return undefined;
  }

  const filtered = filterCoupons(coupons);

  if (filtered.length === 0) {
    return undefined
  }

  return filtered[0];
}

/**
 * @description StripePaywallItem contains a stripe and optional
 * coupond applicable to this price.
 */
export type StripePaywallItem = {
  price: StripePrice;
  coupons: StripeCoupon[];
};

export type StripeCouponApplied = {
  invoiceId: string;
  ftcId: string;
  subsId: string;
  couponId: string;
  createdUtc?: string;
  redeemedUtc?: string;
}
