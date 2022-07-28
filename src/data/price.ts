import { Tier, Cycle, PriceKind, DiscountStatus, OfferKind } from './enum';
import { formatMoney, newMoneyParts, PriceParts } from './localization';
import { YearMonthDay, OptionalPeriod, isValidPeriod, cycleOfYMD, totalDaysOfYMD, formatYMD, isZeroYMD } from './period';

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

export function isValidIntro(p?: Price): boolean {
  if (!p) {
    return false;
  }

  if (p.kind !== 'one_time') {
    return false;
  }

  if (!isValidPeriod(p)) {
    return false;
  }

  return true;
}

export function newFtcPriceParts(price: Price, discount?: Discount): PriceParts {
  if (discount) {
    const period = isZeroYMD(discount.overridePeriod)
      ? price.periodCount
      : discount.overridePeriod;

    return {
      ...newMoneyParts(
        price.currency,
        price.unitAmount - discount.priceOff,
      ),
      cycle: '/' + formatYMD(period, false),
    };
  }

  return {
    ...newMoneyParts(
      price.currency,
      price.unitAmount
    ),
    cycle: '/' + formatYMD(price.periodCount, false),
  };
}

export type DailyPrice = {
  holder: string;
  replacer: string;
}

export function dailyPrice(price: Price): DailyPrice {
  const days = totalDaysOfYMD(price.periodCount) || 1;

  const avg = price.unitAmount / days;

  const dailyAmount = formatMoney(price.currency, avg);

  switch (cycleOfYMD(price.periodCount)) {
    case 'year':
      return {
        holder: '{{dailyAverageOfYear}}',
        replacer: dailyAmount,
      };

    case 'month':
      return {
        holder: '{{dailyAverageOfMonth}}',
        replacer: dailyAmount,
      };
  }
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

export type DiscountRedeemed = {
  compoundId: string;
  discountId: string;
  orderId: string;
  redeemedUtc?: string;
}

function filterOffers(offers: Discount[], filters: OfferKind[]): Discount[] {
  return offers
    .filter(offer => {
      return isValidPeriod(offer) && filters.includes(offer.kind);
    })
    .sort((a, b) => b.priceOff - a.priceOff);
}

/**
 * @description aplicableOffer finds the most applicable discount
 * attached to a price based on user's current membership.
 */
 export function applicableOffer(offers: Discount[], filters: OfferKind[]): Discount | undefined {
  if (offers.length === 0) {
    return undefined;
  }

  const filtered = filterOffers(offers, filters);

  if (filtered.length === 0) {
    return undefined;
  }

  return filtered[0];
}
