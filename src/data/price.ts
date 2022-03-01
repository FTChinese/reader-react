import { Tier, Cycle, PriceKind, DiscountStatus, OfferKind } from './enum';
import { formatMoney, formatMoneyParts, PriceParts } from './localization';
import { YearMonthDay, OptionalPeriod, formatPeriods } from './period';

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
