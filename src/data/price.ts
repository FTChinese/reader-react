import { Tier, Cycle, PriceKind, DiscountStatus, OfferKind } from './enum';
import { formatMoney, formatMoneyParts, PriceParts } from './localization';
import { Membership, isMembershipZero, isMemberExpired } from './membership';
import { YearMonthDay, OptionalPeriod, isValidPeriod, formatPeriods } from './period';

/**
 * @description Price determines how much a product cost.
 */
 export type Price = {
  id: string;
  tier: Tier;
  cycle?: Cycle;
  active: boolean;
  archived: boolean;
  currency: string;
  kind: PriceKind;
  liveMode: boolean;
  nickname: string | null;
  periodCount: YearMonthDay;
  productId: string;
  stripePriceId: string;
  title?: string;
  unitAmount: number;
} & OptionalPeriod;

export function isIntro(p: Price): boolean {
  return p.kind === 'one_time';
}

export function ftcRegularPriceParts(price: Price): PriceParts {
  return {
    ...formatMoneyParts(
      price.currency,
      price.unitAmount
    ),
    cycle: '/' + formatPeriods(price.periodCount, false)
  };
}

export function ftcRegularCharge(price: Price): string {
  return `${formatMoney(price.currency, price.unitAmount)}/${formatPeriods(price.periodCount, false)}`
}

export type Discount = {
  id: string;
  description?: string;
  kind: OfferKind;
  liveMode: boolean;
  overridePeriod: YearMonthDay;
  priceId: string;
  priceOff: number;
  recurring: boolean;
  status: DiscountStatus;
} & OptionalPeriod;

/**
 * @description PaywallPrice contains a price and a list of
 * opitonal discounts.
 */
 export type PaywallPrice = Price & {
  offers: Discount[];
};

export function applicableOffer(pp: PaywallPrice, filters: OfferKind[]): Discount | undefined {
  if (pp.offers.length === 0) {
    return undefined;
  }

  const filtered = pp.offers.filter(offer => {
      return isValidPeriod(offer) && filters.includes(offer.kind);
    })
    .sort((a, b) => {
      return b.priceOff - a.priceOff;
    });

  if (filtered.length == 0) {
    return undefined;
  }

  return filtered[0];
}

export function applicableOfferKinds(m: Membership): OfferKind[] {
  if (isMembershipZero(m)) {
    return [
      'promotion'
    ];
  }

  if (isMemberExpired(m)) {
    return [
      'promotion',
      'win_back'
    ];
  }

  return [
    'promotion',
    'retention'
  ];
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

export function stripeRecurringPriceParts(price: StripePrice): PriceParts {
  return {
    ...formatMoneyParts(
      price.currency,
      price.unitAmount / 100,
    ),
    cycle: '/' + formatPeriods(price.periodCount, true),
  };
}

export function stripeRecurringCharge(price: StripePrice): string {
  return `${formatMoney(price.currency, price.unitAmount / 100)}/${formatPeriods(price.periodCount, true)}`;
}
