import { PriceKind, Tier } from './enum';
import { formatMoney, formatMoneyParts, PriceParts } from './localization';
import { formatPeriods, OptionalPeriod, YearMonthDay } from './period';

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


export type StripeShelfItem = {
  recurring: StripePrice;
  trial?: StripePrice
}

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


