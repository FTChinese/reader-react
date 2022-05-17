import { Tier, Cycle, PriceKind, DiscountStatus, OfferKind } from './enum';
import { YearMonthDay, OptionalPeriod, isValidPeriod } from './period';

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


export function filterOffers(offers: Discount[], filters: OfferKind[]): Discount[] {
  return offers
    .filter(offer => {
      return isValidPeriod(offer) && filters.includes(offer.kind);
    })
    .sort((a, b) => {
      return b.priceOff - a.priceOff
    });
}
