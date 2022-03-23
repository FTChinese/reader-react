import { Tier, Cycle, PriceKind, DiscountStatus, OfferKind } from './enum';
import { YearMonthDay, OptionalPeriod } from './period';

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


